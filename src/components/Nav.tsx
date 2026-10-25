"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

type NavItem = { href: string; label: string; emoji: string; desktopOnly?: boolean };
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/play", label: "Play", emoji: "🎮" },
  { href: "/scan", label: "Check", emoji: "🔍" },
  { href: "/quiz", label: "Quiz", emoji: "⭐" },
  { href: "/impact", label: "Badges", emoji: "🏅" },
  { href: "/problem", label: "Why it matters", emoji: "🌍", desktopOnly: true },
  { href: "/methodology", label: "Sources", emoji: "📚", desktopOnly: true },
];

export function Nav() {
  const pathname = usePathname();
  const { user, isConfigured, signIn, signOut, loading } = useAuth();

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-40 hidden border-b border-charcoal-200 bg-paper/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" aria-label="3R-AI: Material Afterlife Lab home">
            <Logo />
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-forest-800 text-forest-900"
                      : "border-transparent text-charcoal-600 hover:border-charcoal-300 hover:text-forest-800"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span aria-hidden>{item.emoji}</span> {item.label}
                </Link>
              );
            })}
          </nav>
          <div>
            {!isConfigured ? (
              <span className="border border-soil-300 bg-soil-50 px-3 py-1.5 text-xs font-medium text-soil-800">
                Demo mode
              </span>
            ) : loading ? (
              <span className="text-sm text-charcoal-500">Loading…</span>
            ) : user ? (
              <button
                onClick={signOut}
                className="border border-charcoal-300 px-4 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-forest-700 hover:text-forest-800"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={signIn}
                className="bg-forest-800 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-forest-900"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-forest-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-between px-1 py-1">
          {NAV_ITEMS.filter((i) => !i.desktopOnly).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[11px] font-bold ${active ? "bg-forest-100 text-forest-700" : "text-charcoal-500"}`}
              >
                <span className={`text-2xl ${active ? "anim-bin-happy" : ""}`} aria-hidden>{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
