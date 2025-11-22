"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import CATEGORIES from '@/lib/constants/categories';

const NAV_LINKS = [
  { label: "Categories", href: "#categories" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

function useOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [ref, handler]);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLElement | null>(null);
  useOutsideClick(catRef, () => setCatOpen(false));

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Kairos Home" className="flex items-center">
          <Image src="/logo.svg" alt="Kairos" width={28} height={28} priority className="invert" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) =>
            l.label === 'Categories' ? (
              <li key={l.href} ref={catRef} className="relative">
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  aria-expanded={catOpen}
                  className="text-body text-dark-900 transition-colors hover:text-dark-700"
                >
                  Categories
                </button>
                {catOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-md bg-light-100 border border-light-300 shadow-lg z-50 p-3">
                    <ul className="grid grid-cols-1 gap-2">
                      {CATEGORIES.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/products?type=${c.slug}`}
                            className="block px-2 py-1 text-body text-dark-900 hover:bg-light-200 rounded"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li key={l.href}>
                <Link href={l.href} className="text-body text-dark-900 transition-colors hover:text-dark-700">
                  {l.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
            Search
          </button>
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
            My Cart (2)
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="block h-0.5 w-6 bg-dark-900"></span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="space-y-2 px-4 py-3">
          <li>
            <div className="mb-2">
              <h4 className="text-body-medium mb-2">Categories</h4>
              <ul className="grid grid-cols-1 gap-1">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/products?type=${c.slug}`}
                      className="block py-2 text-body text-dark-900 hover:text-dark-700"
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          {NAV_LINKS.filter((n) => n.label !== 'Categories').map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-body text-dark-900 hover:text-dark-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between pt-2">
            <button className="text-body">Search</button>
            <button className="text-body">My Cart (2)</button>
          </li>
        </ul>
      </div>
    </header>
  );
}
