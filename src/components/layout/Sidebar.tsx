"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, ClipboardList, ShoppingCart,
  Users, Layers, Truck, Settings, ChevronRight,
  BarChart3, Receipt, ArrowDownLeft, ArrowUpRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",                label: "Dashboard",              icon: LayoutDashboard },
  { href: "/quotes",          label: "Cotizaciones",           icon: FileText },
  { href: "/work-orders",     label: "Órdenes de Trabajo",    icon: ClipboardList },
  { href: "/purchase-orders", label: "Órdenes de Compra",     icon: ShoppingCart },
  { href: "/contacts",        label: "Clientes y Proveedores", icon: Users },
  { href: "/services",        label: "Catálogo de Servicios",  icon: Layers },
  { href: "/resources",       label: "Recursos",               icon: Truck },
];

const financeItems = [
  { href: "/finances",                    label: "Dashboard Financiero",  icon: BarChart3 },
  { href: "/finances/expenses",           label: "Gastos",                icon: ArrowUpRight },
  { href: "/finances/supplier-invoices",  label: "Facturas Recibidas",    icon: ArrowDownLeft },
  { href: "/finances/sales-invoices",     label: "Facturas Emitidas",     icon: Receipt },
];

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-white/[0.10] text-foreground"
          : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "h-[15px] w-[15px] shrink-0 transition-colors",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
      )} />
      <span className="flex-1 truncate">{label}</span>
      {active && <ChevronRight className="h-3 w-3 text-white/20" />}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.07] bg-sidebar overflow-y-auto">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-white/[0.07] px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="NovAI Engineering" width={148} height={40} style={{ objectFit: "contain" }} />
      </div>

      {/* Operaciones */}
      <nav className="px-2 pt-3 pb-1">
        <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
          Operaciones
        </p>
        <div className="space-y-0.5">
          {navItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>
      </nav>

      {/* Divisor */}
      <div className="mx-4 my-2 h-px bg-white/[0.07]" />

      {/* Finanzas */}
      <nav className="px-2 pb-3">
        <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
          Finanzas
        </p>
        <div className="space-y-0.5">
          {financeItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>
      </nav>

      {/* Settings + Logout al pie */}
      <div className="mt-auto border-t border-white/[0.07] px-2 py-3 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium transition-all duration-150",
            pathname === "/settings"
              ? "bg-white/[0.10] text-foreground"
              : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          )}
        >
          <Settings className="h-[15px] w-[15px]" />
          <span>Configuración</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-[13px] font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="h-[15px] w-[15px]" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
