"use client";

import { Truck, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const resources = [
  { name: "Camión BCRZ-14",          type: "vehicle",   status: "available", until: null },
  { name: "Camión FJKP-88",          type: "vehicle",   status: "busy",      until: "12 May" },
  { name: "Carlos Mendoza",          type: "operator",  status: "available", until: null },
  { name: "Pedro Soto",              type: "operator",  status: "busy",      until: "10 May" },
  { name: "Baño Portátil #04",       type: "equipment", status: "available", until: null },
  { name: "Baño Portátil #07",       type: "equipment", status: "busy",      until: "15 May" },
];

const typeIcon = { vehicle: Truck, operator: User, equipment: Wrench };
const typeLabel = { vehicle: "Vehículo", operator: "Operario", equipment: "Equipo" };

export function ResourceAvailability() {
  const available = resources.filter(r => r.status === "available").length;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Disponibilidad de recursos</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {available}/{resources.length} disponibles ahora
          </p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {resources.map((r) => {
          const Icon = typeIcon[r.type as keyof typeof typeIcon];
          return (
            <li key={r.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.04] border border-white/[0.05]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.07]">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate text-foreground">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{typeLabel[r.type as keyof typeof typeLabel]}</p>
              </div>
              <div className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                r.status === "available"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  r.status === "available" ? "bg-emerald-400" : "bg-amber-400"
                )} />
                {r.status === "available" ? "Disponible" : `Ocupado · ${r.until}`}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
