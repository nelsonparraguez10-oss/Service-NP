"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const titles: Record<string, string> = {
  "/":                            "Dashboard",
  "/quotes":                      "Cotizaciones",
  "/work-orders":                 "Órdenes de Trabajo",
  "/purchase-orders":             "Órdenes de Compra",
  "/contacts":                    "Clientes y Proveedores",
  "/services":                    "Catálogo de Servicios",
  "/resources":                   "Recursos",
  "/finances":                    "Dashboard Financiero",
  "/finances/expenses":           "Control de Gastos",
  "/finances/supplier-invoices":  "Facturas Recibidas",
  "/finances/sales-invoices":     "Facturas Emitidas",
  "/settings":                    "Configuración",
};

function getTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname];
  for (const [key, value] of Object.entries(titles)) {
    if (key !== "/" && pathname.startsWith(key)) return value;
  }
  return "Panel de Gestión";
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-background/80 backdrop-blur-xl px-6">
      <h1 className="text-[14px] font-semibold tracking-tight text-foreground">{getTitle(pathname)}</h1>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-7 w-48 pl-8 text-xs bg-white/[0.06] border-white/[0.08] focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-muted-foreground/60"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 relative hover:bg-white/[0.08]">
          <Bell className="h-[15px] w-[15px] text-muted-foreground" />
          <span className="absolute top-1 right-1.5 h-[5px] w-[5px] rounded-full bg-blue-500" />
        </Button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold">
          NP
        </div>
      </div>
    </header>
  );
}
