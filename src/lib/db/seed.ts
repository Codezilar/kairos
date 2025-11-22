import { db } from '@/lib/db';
import {
  genders, sizes, brands, categories, collections, productCollections, conditions,
  products, productVariants, productImages,
  insertGenderSchema, insertSizeSchema, insertBrandSchema,
  insertCategorySchema, insertCollectionSchema, insertProductSchema, insertVariantSchema, insertProductImageSchema,
  type InsertProduct, type InsertVariant, type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mkdirSync, existsSync, cpSync } from 'fs';
import { join, basename } from 'path';
import CATEGORIES from '@/lib/constants/categories';
type ProductRow = typeof products.$inferSelect;
type VariantRow = typeof productVariants.$inferSelect;

type RGBHex = `#${string}`;

const log = (...args: unknown[]) => console.log('[seed]', ...args);
const err = (...args: unknown[]) => console.error('[seed:error]', ...args);

function pick<T>(arr: T[], n: number) {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && a.length; i++) {
    const idx = Math.floor(Math.random() * a.length);
    out.push(a.splice(idx, 1)[0]);
  }
  return out;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    log('Seeding filters: device types, conditions, capacities');

    const genderRows = CATEGORIES.map((c) => insertGenderSchema.parse({ label: c.label, slug: c.slug }));
    for (const row of genderRows) {
      const exists = await db.select().from(genders).where(eq(genders.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(genders).values(row);
    }

    // colors removed from schema; seeding conditions instead
    const conditionRows = [
      { name: 'New', slug: 'new' },
      { name: 'Used', slug: 'used' },
      { name: 'Refurbished', slug: 'refurbished' },
    ].map((c) => ({ name: c.name, slug: c.slug }));
    for (const row of conditionRows) {
      const exists = await db.select().from(conditions).where(eq(conditions.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(conditions).values(row as any);
    }

    const sizeRows = [
      { name: '64GB', slug: '64gb', sortOrder: 0 },
      { name: '128GB', slug: '128gb', sortOrder: 1 },
      { name: '256GB', slug: '256gb', sortOrder: 2 },
      { name: '512GB', slug: '512gb', sortOrder: 3 },
      { name: '1TB', slug: '1tb', sortOrder: 4 },
    ].map((s) => insertSizeSchema.parse(s));
    for (const row of sizeRows) {
      const exists = await db.select().from(sizes).where(eq(sizes.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(sizes).values(row);
    }

    log('Seeding brand: Kairos');
    const brand = insertBrandSchema.parse({ name: 'Kairos', slug: 'kairos', logoUrl: undefined });
    {
      const exists = await db.select().from(brands).where(eq(brands.slug, brand.slug)).limit(1);
      if (!exists.length) await db.insert(brands).values(brand);
    }

    log('Seeding categories');
    const catRows = [
      { name: 'Gadgets', slug: 'gadgets', parentId: null },
      { name: 'Phones', slug: 'phones', parentId: null },
      { name: 'Accessories', slug: 'accessories', parentId: null },
    ].map((c) => insertCategorySchema.parse(c));
    for (const row of catRows) {
      const exists = await db.select().from(categories).where(eq(categories.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(categories).values(row);
    }

    log('Seeding collections');
    const collectionRows = [
      insertCollectionSchema.parse({ name: "Summer '25", slug: 'summer-25' }),
      insertCollectionSchema.parse({ name: 'New Arrivals', slug: 'new-arrivals' }),
    ];
    for (const row of collectionRows) {
      const exists = await db.select().from(collections).where(eq(collections.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(collections).values(row);
    }

    const allGenders = await db.select().from(genders);
    const allConditions = await db.select().from(conditions);
    const allSizes = await db.select().from(sizes);
    const kairos = (await db.select().from(brands).where(eq(brands.slug, 'kairos')))[0];
    const gadgetsCat = (await db.select().from(categories).where(eq(categories.slug, 'gadgets')))[0];
    const phonesCat = (await db.select().from(categories).where(eq(categories.slug, 'phones')))[0];
    const accessoriesCat = (await db.select().from(categories).where(eq(categories.slug, 'accessories')))[0];
    const summer = (await db.select().from(collections).where(eq(collections.slug, 'summer-25')))[0];
    const newArrivals = (await db.select().from(collections).where(eq(collections.slug, 'new-arrivals')))[0];

    const uploadsRoot = join(process.cwd(), 'static', 'uploads', 'gadgets');
    if (!existsSync(uploadsRoot)) {
      mkdirSync(uploadsRoot, { recursive: true });
    }

    const sourceDir = join(process.cwd(), 'public', 'shoes');
    const productNames = Array.from({ length: 15 }, (_, i) => `Kairos Gadget ${i + 1}`);

    const sourceImages = [
      'shoe-5.avif','shoe-6.avif','shoe-7.avif','shoe-8.avif','shoe-9.avif',
      'shoe-10.avif','shoe-11.avif','shoe-12.avif','shoe-13.avif','shoe-14.avif','shoe-15.avif',
    ];

    log('Creating products with variants and images');
    for (let i = 0; i < productNames.length; i++) {
      const name = productNames[i];
      const gender = allGenders[randInt(0, allGenders.length - 1)];
      const catPick = [gadgetsCat, phonesCat, accessoriesCat][randInt(0, 2)];
      const desc = `Experience the next generation of tech with ${name}.`;

      const product = insertProductSchema.parse({
        name,
        description: desc,
        categoryId: catPick?.id ?? null,
        genderId: gender?.id ?? null,
        brandId: kairos?.id ?? null,
        isPublished: true,
      });

      const retP = await db.insert(products).values(product as InsertProduct).returning();
      const insertedProduct = (retP as ProductRow[])[0];
      const conditionChoices = pick(allConditions, randInt(2, Math.min(4, allConditions.length)));
      const sizeChoices = pick(allSizes, randInt(1, Math.min(5, allSizes.length)));

      const variantIds: string[] = [];
      let defaultVariantId: string | null = null;

      for (const condition of conditionChoices) {
        for (const size of sizeChoices) {
          const priceNum = Number((randInt(80, 1200) + 0.99).toFixed(2));
          const discountedNum = Math.random() < 0.3 ? Number((priceNum - randInt(5, 25)).toFixed(2)) : null;
          const sku = `GAD-${insertedProduct.id.slice(0, 8)}-${condition.slug.toUpperCase()}-${size.slug.toUpperCase()}`;
          const variant = insertVariantSchema.parse({
            productId: insertedProduct.id,
            sku,
            price: priceNum.toFixed(2),
            salePrice: discountedNum !== null ? discountedNum.toFixed(2) : undefined,
            conditionId: condition.id,
            sizeId: size.id,
            inStock: randInt(5, 50),
            weight: Number((Math.random() * 1 + 0.5).toFixed(2)),
            dimensions: { length: 30, width: 20, height: 12 },
          });
          const retV = await db.insert(productVariants).values(variant as InsertVariant).returning();
          const created = (retV as VariantRow[])[0];
          variantIds.push(created.id);
          if (!defaultVariantId) defaultVariantId = created.id;

        }
      }

      if (defaultVariantId) {
        await db.update(products).set({ defaultVariantId }).where(eq(products.id, insertedProduct.id));
      }

      const pickName = sourceImages[i % sourceImages.length];
      const src = join(sourceDir, pickName);
      const destName = `${insertedProduct.id}-${basename(pickName)}`;
      const dest = join(uploadsRoot, destName);
      try {
        cpSync(src, dest);
        const img: InsertProductImage = insertProductImageSchema.parse({
          productId: insertedProduct.id,
          url: `/static/uploads/gadgets/${destName}`,
          sortOrder: 0,
          isPrimary: true,
        });
        await db.insert(productImages).values(img);
      } catch (e) {
        err('Failed to copy product image', { src, dest, e });
      }

      const collectionsForProduct: { id: string }[] = Math.random() < 0.5 ? [summer] : ([newArrivals, summer].filter(Boolean) as { id: string }[]);
      for (const col of collectionsForProduct) {
        await db.insert(productCollections).values({
          productId: insertedProduct.id,
          collectionId: col.id,
        });
      }

      log(`Seeded product ${name} with ${variantIds.length} variants`);
    }

    log('Seeding complete');
  } catch (e) {
    err(e);
    process.exitCode = 1;
  }
}

seed();
