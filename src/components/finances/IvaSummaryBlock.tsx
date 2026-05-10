import { formatCLP } from "@/lib/utils/format";

interface IvaSummaryBlockProps {
  debito: number;
  credito: number;
  period: string;
  dueDate: string;
}

export function IvaSummaryBlock({ debito, credito, period, dueDate }: IvaSummaryBlockProps) {
  const toPay = debito - credito;
  const max = debito;
  const pctDebito  = 100;
  const pctCredito = max > 0 ? Math.round((credito / max) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5 space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold text-foreground">Resumen IVA</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Período {period}</p>
      </div>

      <div className="space-y-3">
        {/* Débito */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">IVA Débito <span className="text-[10px]">(ventas)</span></span>
            <span className="font-semibold text-foreground">{formatCLP(debito)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
            <div className="h-full rounded-full bg-blue-400/70" style={{ width: `${pctDebito}%` }} />
          </div>
        </div>

        {/* Crédito */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">IVA Crédito <span className="text-[10px]">(compras)</span></span>
            <span className="font-semibold text-emerald-400">- {formatCLP(credito)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-400/60" style={{ width: `${pctCredito}%` }} />
          </div>
        </div>

        <div className="h-px bg-white/[0.07]" />

        {/* A pagar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-foreground">IVA a Pagar</p>
            <p className="text-[10px] text-muted-foreground">Vence {dueDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-semibold text-amber-400">{formatCLP(toPay)}</p>
            <p className="text-[10px] text-muted-foreground">{Math.round((toPay / debito) * 100)}% del débito</p>
          </div>
        </div>
      </div>
    </div>
  );
}
