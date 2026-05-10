"use client";

import { formatCLP } from "@/lib/utils/format";

interface ExpensesSplitBarProps {
  fixed: number;
  variable: number;
  period: string;
}

export function ExpensesSplitBar({ fixed, variable, period }: ExpensesSplitBarProps) {
  const total = fixed + variable;
  const pctFixed    = total > 0 ? Math.round((fixed    / total) * 100) : 0;
  const pctVariable = total > 0 ? Math.round((variable / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5 space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold text-foreground">Composición de Gastos</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Período {period}</p>
      </div>

      {/* Split bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
          <div
            className="h-full rounded-l-full bg-violet-400/70 transition-all duration-500"
            style={{ width: `${pctFixed}%` }}
          />
          <div
            className="h-full rounded-r-full bg-orange-400/70 transition-all duration-500"
            style={{ width: `${pctVariable}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Fijos {pctFixed}%</span>
          <span className="font-semibold text-foreground">{formatCLP(total)}</span>
          <span>Variables {pctVariable}%</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400/70" />
            <div>
              <p className="text-[12px] text-foreground font-medium">Gastos Fijos</p>
              <p className="text-[10px] text-muted-foreground">Arriendo, sueldos, servicios</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-foreground">{formatCLP(fixed)}</p>
            <p className="text-[10px] text-muted-foreground">{pctFixed}% del total</p>
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400/70" />
            <div>
              <p className="text-[12px] text-foreground font-medium">Gastos Variables</p>
              <p className="text-[10px] text-muted-foreground">Materiales, subcontratos, traslados</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-foreground">{formatCLP(variable)}</p>
            <p className="text-[10px] text-muted-foreground">{pctVariable}% del total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
