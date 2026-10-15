"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Briefcase,
  ExternalLink,
  FileText,
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  PaintRoller,
  Settings,
  Users,
  Wrench,
  X,
} from "lucide-react";

const SECTIONS = [
  {
    title: "CRM",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
      { href: "/admin/estimates", label: "Estimates", icon: FileText },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/content", label: "Site settings", icon: Settings, exact: true },
      { href: "/admin/content/services", label: "Services", icon: Wrench },
      { href: "/admin/content/projects", label: "Projects", icon: Images },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/content/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
];

function NavSections({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return SECTIONS.map((section) => (
    <div key={section.title}>
      <p className="mb-2 px-2 text-[11px] font-semibold tracking-widest text-white/40 uppercase">{section.title}</p>
      <ul className="space-y-0.5">
        {section.items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  ));
}

function ActiveNavSections({ onNavigate }: { onNavigate: () => void }) {
  return <NavSections pathname={usePathname()} onNavigate={onNavigate} />;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const close = () => setOpen(false);
  const nav = (
    <nav className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" className="flex items-center gap-2 px-2 font-display text-lg font-semibold text-white">
        <span className="grid size-8 place-items-center rounded-lg bg-accent-500">
          <PaintRoller className="size-4" />
        </span>
        Kapid Admin
      </Link>
      <Suspense fallback={<NavSections pathname="" onNavigate={close} />}>
        <ActiveNavSections onNavigate={close} />
      </Suspense>
      <div className="mt-auto space-y-0.5 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" /> View website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 bg-brand-900 lg:block">{nav}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand-900">
            <button
              className="absolute top-4 right-3 rounded-lg p-1.5 text-white/70 hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center border-b border-line bg-cream/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-sand" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <span className="ml-2 font-display font-semibold">Kapid Admin</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
