"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram, Twitter, Youtube, Linkedin, Palette } from "lucide-react";
import { useState } from "react";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";

const links = [
  { href: "/", label: "Portfolio" },
  { href: "/store", label: "Store" },
  { href: "/commissions", label: "Commissions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isScrolled = useScrollNavbar(40);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${isScrolled
          ? "border-[--color-border] bg-white/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
        }`}
    >
      <nav className="mx-auto flex h-32 max-w-7x1 justify-between items-center px-14">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <img
            src="/avatar.png"
            alt="Nick Souza"
            className="h-[64px] w-[64px] rounded-full object-cover"
          />
          <img
            src="/nick-logo.png"
            alt="Nick Souza"
            className="h-[53px] w-auto"
          />
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-10 md:flex">
          <div className="flex items-center gap-6 text-[0.82rem] tracking-[0.15em] uppercase">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 text-xs ${isActive(link.href)
                    ? "text-[--color-text-primary]"
                    : "text-[--color-text-muted]"
                  }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[--color-text-primary] transition-transform ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[--color-text-muted]">
            <button
              type="button"
              aria-label="Instagram"
              className="p-1 transition-colors hover:text-[--color-text-primary]"
            >
              <Instagram size={18} />
            </button>
            <button
              type="button"
              aria-label="X / Twitter"
              className="p-1 transition-colors hover:text-[--color-text-primary]"
            >
              <Twitter size={18} />
            </button>
            <button
              type="button"
              aria-label="YouTube"
              className="p-1 transition-colors hover:text-[--color-text-primary]"
            >
              <Youtube size={18} />
            </button>
            <button
              type="button"
              aria-label="LinkedIn"
              className="p-1 transition-colors hover:text-[--color-text-primary]"
            >
              <Linkedin size={18} />
            </button>
            <button
              type="button"
              aria-label="ArtStation"
              className="p-1 transition-colors hover:text-[--color-text-primary]"
            >
              <Palette size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-[--color-border] p-2 text-[--color-text-muted] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[--color-border] bg-white/95 px-6 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3 text-xs tracking-[0.15em] uppercase">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 ${isActive(link.href)
                    ? "text-[--color-text-primary]"
                    : "text-[--color-text-muted]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
