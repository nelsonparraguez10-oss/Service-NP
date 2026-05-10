import { cn } from "@/lib/utils";

type Status = "draft" | "pending_approval" | "approved" | "rejected" | "invoiced" | "cancelled";

const config: Record<Status, { label: string; className: string }> = {
  draft:            { label: "Borrador",    className: "bg-white/[0.07] text-white/50 border-white/[0.08]" },
  pending_approval: { label: "En revisión", className: "bg-amber-500/10  text-amber-400  border-amber-500/20" },
  approved:         { label: "Aprobado",    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  rejected:         { label: "Rechazado",   className: "bg-red-500/10    text-red-400    border-red-500/20" },
  invoiced:         { label: "Facturado",   className: "bg-blue-500/10   text-blue-400   border-blue-500/20" },
  cancelled:        { label: "Cancelado",   className: "bg-white/[0.05]  text-white/30   border-white/[0.06]" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status] ?? config.draft;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
      className
    )}>
      {label}
    </span>
  );
}
