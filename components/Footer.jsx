import Image from "next/image";
import Link from "next/link";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    title: "Featured",
    links: ["Best Sellers", "New Arrivals", "Top Rated", "Deals"],
  },
  {
    title: "Gadgets",
    links: ["All Gadgets", "Phones", "Tablets", "Accessories"],
  },
  {
    title: "Support",
    links: ["Help Center", "Shipping", "Returns", "Warranty"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="text-light-100 w-full absolute">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex items-start md:col-span-3">
            <Image src="/onestopshop.png" alt="Kairos" width={48} height={48} />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-heading-3">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-body text-light-400 hover:text-light-300"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-10 md:col-span-2 md:justify-end">
              <Link
                href="https://www.facebook.com/share/1K2RbvJNJ8/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-100"
                target="_blank"
              >
                <FaFacebook className="text-6xl cursor-pointer" />
              </Link>
              <Link
                href="https://www.instagram.com/onestopshopofficialmail?utm_source=qr&igsh=MTNvdjd2a2U4cmxhdg=="
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-100"
                target="_blank"
              >
                <FaInstagram className="text-6xl cursor-pointer" />
              </Link>
              <Link
                href="https://x.com/1StopOfficial"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-light-100"
                target="_blank"
              >
                <FaXTwitter className="text-6xl cursor-pointer" />
              </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-light-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-caption">
            <Image src="/globe.svg" alt="" width={16} height={16} />
            <span>Croatia</span>
            <span>© 2026 ONE STOP SHOP, Inc. All Rights Reserved</span>
          </div>
          <ul className="flex items-center gap-6 text-caption">
            {["Guides", "Terms of Sale", "Terms of Use", "Privacy Policy"].map((t) => (
              <li key={t}>
                <Link href="#">{t}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
