"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { formatCLP } from "@/lib/utils/format";

const data = [
  { month: "Ene", ingresos: 3800000, egresos: 2100000 },
  { month: "Feb", ingresos: 4200000, egresos: 2800000 },
  { month: "Mar", ingresos: 5600000, egresos: 3100000 },
  { month: "Abr", ingresos: 6100000, egresos: 3600000 },
  { month: "May", ingresos: 7400000, egresos: 4200000 },
  { month: "Jun", ingresos: 7200000, egresos: 4800000 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const ing = payload.find((p: any) => p.dataKey === "ingresos")?.value ?? 0;
  const egr = payload.find((p: any) => p.dataKey === "egresos")?.value ?? 0;
  const net = ing - egr;
  return (
    <div className="rounded-xl border border-white/[0.10] bg-[#1c1c1e]/95 p-3 shadow-2xl backdrop-blur-xl min-w-[160px]">
      <p className="mb-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" /><span className="text-[11px] text-muted-foreground">Ingresos</span></div>
          <span className="text-[11px] font-semibold text-foreground">{formatCLP(ing)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-400" /><span className="text-[11px] text-muted-foreground">Egresos</span></div>
          <span className="text-[11px] font-semibold text-foreground">{formatCLP(egr)}</span>
        </div>
        <div className="h-px bg-white/[0.08] my-1" />
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-muted-foreground">Neto</span>
          <span className={`text-[11px] font-semibold ${net >= 0 ? "text-emerald-400" : "text-red-400"}`}>{net >= 0 ? "+" : ""}{formatCLP(net)}</span>
        </div>
      </div>
    </div>
  );
}

export function CashFlowChart() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Flujo de Caja</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Ingresos cobrados vs. Egresos pagados — 2026</p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" /><span className="text-muted-foreground">Ingresos</span></div>
          <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-400/70" /><span className="text-muted-foreground">Egresos</span></div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="ingresos" fill="#0A84FF" radius={[4, 4, 0, 0]} maxBarSize={28} fillOpacity={0.85} />
          <Bar dataKey="egresos"  fill="#FF453A" radius={[4, 4, 0, 0]} maxBarSize={28} fillOpacity={0.70} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
