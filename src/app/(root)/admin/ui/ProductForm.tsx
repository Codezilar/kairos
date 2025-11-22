"use client";

import { useEffect, useState } from "react";

type Option = { label: string; value: string };

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const [brandsOpts, setBrandsOpts] = useState<Option[]>([]);
  const [catsOpts, setCatsOpts] = useState<Option[]>([]);
  const [sizesOpts, setSizesOpts] = useState<Option[]>([]);

  const [status, setStatus] = useState<string | null>(null);

  // fetch helper lists from simple endpoints (server has DB access)
  useEffect(() => {
    async function load() {
      try {
        const [b, c, s] = await Promise.all([
          fetch('/api/admin/options/brands').then((r) => r.json()),
          fetch('/api/admin/options/categories').then((r) => r.json()),
          fetch('/api/admin/options/sizes').then((r) => r.json()),
        ]);
        setBrandsOpts(b || []);
        setCatsOpts(c || []);
        setSizesOpts(s || []);
      } catch (e) {
        // ignore
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Submitting...');
    const payload = {
      name,
      description,
      brandSlug: brand,
      categorySlug: category,
      price: Number(price) || 0,
      // sizes now represent Condition (New/Used/Refurbished)
      sizeSlugs: sizes,
      imageUrls: imageUrls.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      const res = await fetch('/api/admin/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed');
      setStatus(`Created product ${json.id}`);
      setName('');
      setDescription('');
      setPrice('');
      setImageUrls('');
    } catch (err: any) {
      setStatus(`Error: ${err?.message ?? String(err)}`);
    }
  }

  function toggleMulti(setter: (s: string[]) => void, curr: string[], v: string) {
    if (curr.includes(v)) setter(curr.filter((x) => x !== v));
    else setter([...curr, v]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4 bg-light-100">
      <div>
        <label className="block text-caption">Admin Secret</label>
        <input value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="block text-caption">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="block text-caption">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-caption">Brand</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="">— choose —</option>
            {brandsOpts.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-caption">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="">— choose —</option>
            {catsOpts.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-caption">Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-caption">Image URLs (comma separated)</label>
          <input value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-caption">Condition</label>
        <div className="mt-2 flex gap-2 flex-wrap">
          {sizesOpts.map((s) => (
            <button type="button" key={s.value} onClick={() => toggleMulti(setSizes, sizes, s.value)} className={`rounded-md px-3 py-1 border ${sizes.includes(s.value) ? 'bg-dark-900 text-light-100' : ''}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-full bg-dark-900 px-4 py-2 text-light-100" type="submit">Create</button>
        {status && <span className="text-caption">{status}</span>}
      </div>
    </form>
  );
}
