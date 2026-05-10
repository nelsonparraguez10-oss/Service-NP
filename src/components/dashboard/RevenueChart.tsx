"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatCLP } from "@/lib/utils/format";

const data = [
  { month: "Ene", cotizado: 4200000, facturado: 3800000 },
  { month: "Feb", cotizado: 5800000, facturado: 4200000 },
  { month: "Mar", cotizado: 5100000, facturado: 5600000 },
  { month: "Abr", cotizado: 7200000, facturado: 6100000 },
  { month: "May", cotizado: 6800000, facturado: 7400000 },
  { month: "Jun", cotizado: 8900000, facturado: 7200000 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/[0.10] bg-[#1c1c1e]/95 p-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-[12px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">
            {p.name === "cotizado" ? "Cotizado" : "Facturado"}:
          </span>
          <span className="font-semibold text-foreground">{formatCLP(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Ingresos del año</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Cotizado vs. Facturado — 2026</p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="text-muted-foreground">Cotizado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-muted-foreground">Facturado</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCotizado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="rgba(255,255,255,0.15)" stopOpacity={1} />
              <stop offset="95%" stopColor="rgba(255,255,255,0)"    stopOpacity={1} />
            </linearGradient>
            <linearGradient id="gradFacturado" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="rgba(10,132,255,0.25)"  stopOpacity={1} />
              <stop offset="95%" stopColor="rgba(10,132,255,0)"     stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="cotizado"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth={1.5}
            fill="url(#gradCotizado)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="facturado"
            stroke="#0A84FF"
            strokeWidth={2}
            fill="url(#gradFacturado)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
