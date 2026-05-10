import { Plus, Filter, Download } from "lucide-react";
import { formatCLP } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button-link";

type PaymentStatus = "pending" | "paid" | "overdue" | "partial";
type PaymentMethod = "transfer" | "cash" | "check" | "credit";

interface SalesInvoice {
  id: string;
  folio: string;
  client: string;
  date: string;
  dueDate: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  workOrderId?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

const mockInvoices: SalesInvoice[] = [
  { id: "INV-2026-024", folio: "24", client: "Minera Collahuasi",     date: "2026-05-07", dueDate: "2026-06-06", netAmount: 4033613, taxAmount: 766387, totalAmount: 4800000, workOrderId: "OT-2026-031", paymentStatus: "pending",  },
  { id: "INV-2026-023", folio: "23", client: "Anglo American",        date: "2026-05-04", dueDate: "2026-06-03", netAmount: 2605042, taxAmount: 494958, totalAmount: 3100000, workOrderId: "OT-2026-029", paymentStatus: "pending",  },
  { id: "INV-2026-022", folio: "22", client: "Codelco Chuquicamata",  date: "2026-04-30", dueDate: "2026-05-30", netAmount: 6050420, taxAmount: 1149580,totalAmount: 7200000, workOrderId: "OT-2026-030", paymentStatus: "paid",     paymentMethod: "transfer" },
  { id: "INV-2026-021", folio: "21", client: "SQM",                   date: "2026-04-25", dueDate: "2026-05-25", netAmount: 5294118, taxAmount: 1005882,totalAmount: 6300000, workOrderId: "OT-2026-024", paymentStatus: "paid",     paymentMethod: "transfer" },
  { id: "INV-2026-020", folio: "20", client: "Antofagasta Minerals",  date: "2026-04-18", dueDate: "2026-05-18", netAmount: 7983193, taxAmount: 1516807,totalAmount: 9500000, workOrderId: "OT-2026-028", paymentStatus: "overdue",  },
  { id: "INV-2026-019", folio: "19", client: "Minera Los Pelambres",  date: "2026-04-14", dueDate: "2026-05-14", netAmount: 4705882, taxAmount: 894118, totalAmount: 5600000, workOrderId: "OT-2026-026", paymentStatus: "overdue",  },
  { id: "INV-2026-018", folio: "18", client: "Teck Carmen de Andacollo", date: "2026-04-10", dueDate: "2026-05-10", netAmount: 2352941, taxAmount: 447059, totalAmount: 2800000, workOrderId: "OT-2026-027", paymentStatus: "overdue", },
];

const statusConfig: Record<PaymentStatus, { label: string; classes: string }> = {
  pending: { label: "Pendiente", classes: "border-amber-500/20 bg-amber-500/10 text-amber-400" },
  paid:    { label: "Pagada",    classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" },
  overdue: { label: "Vencida",   classes: "border-red-500/20 bg-red-500/10 text-red-400" },
  partial: { label: "Parcial",   classes: "border-blue-500/20 bg-blue-500/10 text-blue-400" },
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  transfer: "Transferencia",
  cash:     "Efectivo",
  check:    "Cheque",
  credit:   "Crédito",
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export default function SalesInvoicesPage() {
  const totalIva    = mockInvoices.reduce((s, i) => s + i.taxAmount,   0);
  const totalNet    = mockInvoices.reduce((s, i) => s + i.netAmount,   0);
  const totalAmount = mockInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const overdue     = mockInvoices.filter(i => i.paymentStatus === "overdue").length;
  const pending     = mockInvoices.filter(i => i.paymentStatus === "pending").length;

  return (
    <div className="p-6 space-y-5">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Total emitido</p>
            <p className="text-[15px] font-semibold text-foreground">{formatCLP(totalAmount)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">IVA Débito</p>
            <p className="text-[15px] font-semibold text-blue-400">{formatCLP(totalIva)}</p>
          </div>
          {overdue > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-center">
              <p className="text-[10px] text-red-400/70">Vencidas</p>
              <p className="text-[15px] font-semibold text-red-400">{overdue}</p>
            </div>
          )}
          {pending > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center">
              <p className="text-[10px] text-amber-400/70">Por cobrar</p>
              <p className="text-[15px] font-semibold text-amber-400">
                {formatCLP(mockInvoices.filter(i => i.paymentStatus === "pending").reduce((s, i) => s + i.totalAmount, 0))}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" />
            Exportar
          </button>
          <ButtonLink href="/finances/sales-invoices/new" variant="default" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Nueva Factura
          </ButtonLink>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Folio", "Cliente", "Fecha", "Vencimiento", "Neto", "IVA Débito", "Total", "OT", "Forma Pago", "Estado"].map(h => (
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
                <td className="px-4 py-3 text-[12px] text-foreground max-w-[160px] truncate">{inv.client}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{inv.date}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{inv.dueDate}</td>
                <td className="px-4 py-3 text-[12px] text-foreground">{formatCLP(inv.netAmount)}</td>
                <td className="px-4 py-3 text-[12px] text-blue-400">{formatCLP(inv.taxAmount)}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground">{formatCLP(inv.totalAmount)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{inv.workOrderId ?? "—"}</td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">
                  {inv.paymentMethod ? paymentMethodLabel[inv.paymentMethod] : "—"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={inv.paymentStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
