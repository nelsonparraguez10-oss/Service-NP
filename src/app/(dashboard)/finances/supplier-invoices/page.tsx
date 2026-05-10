import { Plus, Filter } from "lucide-react";
import { formatCLP } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button-link";

type PaymentStatus = "pending" | "paid" | "overdue";

interface SupplierInvoice {
  id: string;
  folio: string;
  supplier: string;
  supplierRut: string;
  date: string;
  dueDate: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  purchaseOrderId?: string;
  paymentStatus: PaymentStatus;
  hasAttachment: boolean;
}

const mockInvoices: SupplierInvoice[] = [
  { id: "SI-2026-012", folio: "7841",  supplier: "Ferretería Industrial S.A.", supplierRut: "76.123.456-7", date: "2026-05-06", dueDate: "2026-06-05", netAmount: 748739, taxAmount: 142260, totalAmount: 890999, purchaseOrderId: "OC-2026-018", paymentStatus: "pending",  hasAttachment: true  },
  { id: "SI-2026-011", folio: "3312",  supplier: "Electricidad y Más Ltda.",   supplierRut: "77.654.321-2", date: "2026-05-04", dueDate: "2026-06-03", netAmount: 294118, taxAmount: 55882,  totalAmount: 350000, purchaseOrderId: "OC-2026-017", paymentStatus: "pending",  hasAttachment: true  },
  { id: "SI-2026-010", folio: "9201",  supplier: "Transportes del Norte SpA",  supplierRut: "79.321.654-K", date: "2026-05-02", dueDate: "2026-06-01", netAmount: 100840, taxAmount: 19160,  totalAmount: 120000, paymentStatus: "paid",     hasAttachment: true  },
  { id: "SI-2026-009", folio: "5540",  supplier: "Suministros Mineros Ltda.",  supplierRut: "76.987.123-4", date: "2026-04-28", dueDate: "2026-05-27", netAmount: 369748, taxAmount: 70252,  totalAmount: 440000, purchaseOrderId: "OC-2026-015", paymentStatus: "overdue",  hasAttachment: false },
  { id: "SI-2026-008", folio: "2198",  supplier: "Proveedor Técnico Sur",      supplierRut: "78.456.789-1", date: "2026-04-22", dueDate: "2026-05-22", netAmount: 176471, taxAmount: 33529,  totalAmount: 210000, paymentStatus: "overdue",  hasAttachment: false },
  { id: "SI-2026-007", folio: "6634",  supplier: "Materiales Express E.I.R.L.",supplierRut: "76.543.210-8", date: "2026-04-18", dueDate: "2026-05-18", netAmount: 386555, taxAmount: 73445,  totalAmount: 460000, purchaseOrderId: "OC-2026-013", paymentStatus: "paid",     hasAttachment: true  },
];

const statusConfig: Record<PaymentStatus, { label: string; classes: string }> = {
  pending: { label: "Pendiente", classes: "border-amber-500/20 bg-amber-500/10 text-amber-400" },
  paid:    { label: "Pagada",    classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
  overdue: { label: "Vencida",   classes: "border-red-500/20 bg-red-500/10 text-red-400" },
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export default function SupplierInvoicesPage() {
  const totalIva  = mockInvoices.reduce((s, i) => s + i.taxAmount,   0);
  const totalNet  = mockInvoices.reduce((s, i) => s + i.netAmount,   0);
  const overdue   = mockInvoices.filter(i => i.paymentStatus === "overdue").length;

  return (
    <div className="p-6 space-y-5">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Neto total</p>
            <p className="text-[15px] font-semibold text-foreground">{formatCLP(totalNet)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">IVA Crédito</p>
            <p className="text-[15px] font-semibold text-emerald-400">{formatCLP(totalIva)}</p>
          </div>
          {overdue > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-center">
              <p className="text-[10px] text-red-400/70">Vencidas</p>
              <p className="text-[15px] font-semibold text-red-400">{overdue}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
          <ButtonLink href="/finances/supplier-invoices/new" variant="default" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Registrar Factura
          </ButtonLink>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Folio", "Proveedor", "RUT", "Fecha", "Vencimiento", "Neto", "IVA", "Total", "OC", "Estado"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {mockInvoices.map(inv => (
              <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{inv.folio}</td>
                <td className="px-4 py-3 text-[12px] text-foreground max-w-[160px] truncate">{inv.supplier}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{inv.supplierRut}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{inv.dueDate}</td>
                <td className="px-4 py-3 text-[12px] text-foreground">{formatCLP(inv.netAmount)}</td>
                <td className="px-4 py-3 text-[12px] text-emerald-400">{formatCLP(inv.taxAmount)}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground">{formatCLP(inv.totalAmount)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{inv.purchaseOrderId ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.paymentStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
