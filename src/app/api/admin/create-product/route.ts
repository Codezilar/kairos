import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  brands,
  categories,
  conditions,
  sizes,
  genders,
  collections,
  productCollections,
  products,
  productVariants,
  productImages,
  insertProductSchema,
  insertVariantSchema,
  insertProductImageSchema,
} from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/actions';

const ADMIN_HEADER = 'x-admin-secret';

export async function POST(req: Request) {
  const secret = req.headers.get(ADMIN_HEADER) ?? '';
  const authorizedUser = await getCurrentUser();
  const ADMIN_UUID = 'c8b063c3-b812-4db3-a318-7389a4ef62a6';

  const okByUser = !!(authorizedUser && authorizedUser.id === ADMIN_UUID);
  const okBySecret = process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;

  if (!okByUser && !okBySecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    name,
    description,
    brandSlug,
    categorySlug,
    genderSlug,
    collectionSlugs = [],
    price = 0,
    conditionSlugs = [],
    sizeSlugs = [],
    imageUrls = [],
  } = body;

  if (!name || !brandSlug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // resolve foreign ids
  const brandRow = (await db.select().from(brands).where(eq(brands.slug, brandSlug)))[0];
  const categoryRow = (await db.select().from(categories).where(eq(categories.slug, categorySlug)))[0];

  // resolve gender
  const genderRow = genderSlug ? (await db.select().from(genders).where(eq(genders.slug, genderSlug)))[0] : null;

  const product = insertProductSchema.parse({
    name,
    description: description ?? '',
    brandId: brandRow?.id ?? null,
    categoryId: categoryRow?.id ?? null,
    genderId: genderRow?.id ?? null,
    isPublished: true,
  });

  const inserted = await db.insert(products).values(product as any).returning();
  const created = (inserted as any[])[0];

  // create variants: for each condition x size
  const conditionRows = conditionSlugs.length
    ? await db.select().from(conditions).where(inArray(conditions.slug, conditionSlugs))
    : await db.select().from(conditions);
  const sizeRows = sizeSlugs.length
    ? await db.select().from(sizes).where(inArray(sizes.slug, sizeSlugs))
    : await db.select().from(sizes);

  const variantIds: string[] = [];
  for (const cond of conditionRows) {
    for (const sz of sizeRows) {
      const sku = `ADM-${created.id.slice(0,8)}-${(cond.slug||'c').toUpperCase()}-${(sz.slug||'s').toUpperCase()}`;
      const variant = insertVariantSchema.parse({
        productId: created.id,
        sku,
        price: String(price ?? '0'),
        salePrice: undefined,
        conditionId: cond.id,
        sizeId: sz.id,
        inStock: 10,
      });
      const rv = await db.insert(productVariants).values(variant as any).returning();
      const v = (rv as any[])[0];
      variantIds.push(v.id);
    }
  }

  // images
  for (const [i, url] of (imageUrls || []).entries()) {
    const img = insertProductImageSchema.parse({ productId: created.id, url: url, sortOrder: i, isPrimary: i === 0, variantId: null });
    await db.insert(productImages).values(img as any);
  }

  // collections (if provided)
  if (collectionSlugs && collectionSlugs.length) {
    const cols = await db.select().from(collections).where(inArray(collections.slug, collectionSlugs));
    for (const col of cols) {
      await db.insert(productCollections).values({ productId: created.id, collectionId: col.id }).catch(() => null);
    }
  }

  return NextResponse.json({ id: created.id });
}
