import { formatCLP, calcIVA } from "@/lib/utils/format";

interface TotalsBlockProps {
  net: number;
  discount?: number;
  showDiscount?: boolean;
}

export function TotalsBlock({ net, discount = 0, showDiscount = false }: TotalsBlockProps) {
  const discountedNet = net - discount;
  const iva   = calcIVA(discountedNet);
  const total = discountedNet + iva;

  return (
    <div className="w-full max-w-xs ml-auto rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <div className="space-y-0 text-[13px]">
        <Row label="Neto"     value={formatCLP(net)} />
        {showDiscount && discount > 0 && (
          <Row label="Descuento" value={`- ${formatCLP(discount)}`} className="text-red-400" />
        )}
        <Row label="Sub Total" value={formatCLP(discountedNet)} />
        <Row label="IVA 19%"   value={formatCLP(iva)} />
        <div className="flex justify-between bg-white/[0.07] px-4 py-3 border-t border-white/[0.08]">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-semibold text-[15px] text-foreground">{formatCLP(total)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between px-4 py-2 border-b border-white/[0.05] ${className ?? ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground/80">{value}</span>
    </div>
  );
}
