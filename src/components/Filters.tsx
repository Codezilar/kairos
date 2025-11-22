"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getArrayParam, removeParams, toggleArrayParam } from "@/lib/utils/query";
import CATEGORIES from '@/lib/constants/categories';
const BRANDS = [
  { slug: 'kairos', label: 'Kairos' },
  { slug: 'acme', label: 'Acme' },
  { slug: 'generic', label: 'Generic' },
] as const;

const CONDITIONS = [
  { id: 'new', label: 'New' },
  { id: 'used', label: 'Used' },
  { id: 'refurbished', label: 'Refurbished' },
] as const;
const PRICES = [
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] as const;

type GroupKey = "type" | "brand" | "condition" | "price";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
    type: true,
    brand: true,
    condition: true,
    price: true,
  });

  const activeCounts = {
    type: getArrayParam(search, "type").length,
    brand: getArrayParam(search, "brand").length,
    condition: getArrayParam(search, "condition").length,
    price: getArrayParam(search, "price").length,
  };

  useEffect(() => {
    setOpen(false);
  }, [search]);

  const onToggle = (key: GroupKey, value: string) => {
    const url = toggleArrayParam(pathname, search, key, value);
    router.push(url, { scroll: false });
  };

  const clearAll = () => {
    const url = removeParams(pathname, search, ["type", "brand", "condition", "price", "page"]);
    router.push(url, { scroll: false });
  };

  const Group = ({
    title,
    children,
    k,
  }: {
    title: string;
    children: import("react").ReactNode;
    k: GroupKey;
  }) => (
    <div className="border-b border-light-300 py-4">
      <button
        className="flex w-full items-center justify-between text-body-medium text-dark-900"
        onClick={() => setExpanded((s) => ({ ...s, [k]: !s[k] }))}
        aria-expanded={expanded[k]}
        aria-controls={`${k}-section`}
      >
        <span>{title}</span>
        <span className="text-caption text-dark-700">{expanded[k] ? "−" : "+"}</span>
      </button>
      <div id={`${k}-section`} className={`${expanded[k] ? "mt-3 block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
          className="rounded-md border border-light-300 px-3 py-2 text-body-medium"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
        >
          Filters
        </button>
        <button className="text-caption text-dark-700 underline" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <aside className="sticky top-20 hidden h-fit min-w-60 rounded-lg border border-light-300 bg-light-100 p-4 md:block">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-body-medium text-dark-900">Filters</h3>
          <button className="text-caption text-dark-700 underline" onClick={clearAll}>
            Clear all
          </button>
        </div>

        <Group title={`Type ${activeCounts.type ? `(${activeCounts.type})` : ""}`} k="type">
          <ul className="space-y-2">
            {CATEGORIES.map((c) => {
              const checked = getArrayParam(search, "type").includes(c.slug);
              return (
                <li key={c.slug} className="flex items-center gap-2">
                  <input
                    id={`type-${c.slug}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("type" as GroupKey, c.slug)}
                  />
                  <label htmlFor={`type-${c.slug}`} className="text-body text-dark-900">
                    {c.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title={`Brand ${activeCounts.brand ? `(${activeCounts.brand})` : ""}`} k="brand">
          <ul className="flex flex-col gap-2">
            {BRANDS.map((b) => {
              const checked = getArrayParam(search, "brand").includes(b.slug);
              return (
                <li key={b.slug}>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={checked}
                      onChange={() => onToggle("brand" as GroupKey, b.slug)}
                    />
                    <span className="text-body">{b.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
        <Group title={`Condition ${activeCounts.condition ? `(${activeCounts.condition})` : ""}`} k="condition">
          <ul className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((c) => {
              const checked = getArrayParam(search, "condition").includes(c.id);
              return (
                <li key={c.id} className="flex items-center gap-2">
                  <input
                    id={`condition-${c.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("condition" as GroupKey, c.id)}
                  />
                  <label htmlFor={`condition-${c.id}`} className="text-body">
                    {c.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
        <Group title={`Price ${activeCounts.price ? `(${activeCounts.price})` : ""}`} k="price">
          <ul className="space-y-2">
            {PRICES.map((p) => {
              const checked = getArrayParam(search, "price").includes(p.id);
              return (
                <li key={p.id} className="flex items-center gap-2">
                  <input
                    id={`m-price-${p.id}`}
                    type="checkbox"
                    className="h-4 w-4 accent-dark-900"
                    checked={checked}
                    onChange={() => onToggle("price", p.id)}
                  />
                  <label htmlFor={`m-price-${p.id}`} className="text-body">
                    {p.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[80%] overflow-auto bg-light-100 p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-body-medium">Filters</h3>
              <button className="text-caption text-dark-700 underline" onClick={clearAll}>
                Clear all
              </button>
            </div>
            {/* Mobile: render the same groups in a stacked layout */}
            <div className="md:hidden space-y-4">
              <Group title="Brand" k="brand">
                <ul className="grid grid-cols-4 gap-2">
                  {BRANDS.map((b) => {
                    const checked = getArrayParam(search, "brand").includes(b.slug);
                    return (
                      <li key={b.slug}>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-dark-900"
                            checked={checked}
                            onChange={() => onToggle("brand", b.slug)}
                          />
                          <span className="text-body">{b.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Condition" k="condition">
                <ul className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((c) => {
                    const checked = getArrayParam(search, "condition").includes(c.id);
                    return (
                      <li key={c.id} className="flex items-center gap-2">
                        <input
                          id={`m-condition-${c.id}`}
                          type="checkbox"
                          className="h-4 w-4 accent-dark-900"
                          checked={checked}
                          onChange={() => onToggle("condition", c.id)}
                        />
                        <label htmlFor={`m-condition-${c.id}`} className="text-body">
                          {c.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>

              <Group title="Price" k="price">
                <ul className="space-y-2">
                  {PRICES.map((p) => {
                    const checked = getArrayParam(search, "price").includes(p.id);
                    return (
                      <li key={p.id} className="flex items-center gap-2">
                        <input
                          id={`m-price-${p.id}`}
                          type="checkbox"
                          className="h-4 w-4 accent-dark-900"
                          checked={checked}
                          onChange={() => onToggle("price", p.id)}
                        />
                        <label htmlFor={`m-price-${p.id}`} className="text-body">
                          {p.label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Group>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
