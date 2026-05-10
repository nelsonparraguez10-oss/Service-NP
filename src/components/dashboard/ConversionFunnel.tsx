"use client";

import { FileText, ClipboardList, Receipt, ChevronRight } from "lucide-react";

const stages = [
  { label: "Cotizaciones", count: 24, sub: "este mes",   icon: FileText,     bg: "bg-white/[0.06]",  text: "text-foreground" },
  { label: "OTs Abiertas", count: 18, sub: "en progreso",icon: ClipboardList, bg: "bg-white/[0.09]",  text: "text-foreground" },
  { label: "Facturadas",   count: 11, sub: "este mes",   icon: Receipt,      bg: "bg-blue-500/20",   text: "text-blue-300" },
];

export function ConversionFunnel() {
  const rate = Math.round((11 / 24) * 100);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-foreground">Embudo operativo</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Conversión: <span className="font-semibold text-foreground">{rate}%</span>
        </p>
      </div>

      <div className="flex items-stretch gap-2">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2 flex-1">
            <div className={`flex-1 rounded-xl p-3.5 ${stage.bg} border border-white/[0.07]`}>
              <div className="flex items-center gap-1.5 mb-2">
                <stage.icon className={`h-3.5 w-3.5 ${stage.text} opacity-70`} />
                <span className={`text-[11px] font-medium ${stage.text} opacity-70`}>{stage.label}</span>
              </div>
              <span className={`text-2xl font-semibold ${stage.text}`}>{stage.count}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stage.sub}</p>
            </div>
            {i < stages.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 h-1 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}
