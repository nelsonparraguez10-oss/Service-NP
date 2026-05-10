import { AlertTriangle, FileX, Clock } from "lucide-react";

interface Alert {
  type: "overdue" | "missing-doc" | "due-soon";
  message: string;
  detail: string;
}

const mockAlerts: Alert[] = [
  { type: "overdue",     message: "Factura vencida",       detail: "INV-2026-018 · Codelco · $3.420.000 · 12 días" },
  { type: "overdue",     message: "Factura vencida",       detail: "INV-2026-015 · Anglo American · $1.890.000 · 23 días" },
  { type: "missing-doc", message: "Sin respaldo documental", detail: "Gasto OT-2026-028 · $480.000 · combustible" },
  { type: "missing-doc", message: "Sin respaldo documental", detail: "Gasto OT-2026-026 · $210.000 · herramientas" },
  { type: "due-soon",    message: "IVA próximo a vencer",  detail: "Mayo 2026 · $1.254.000 · vence 12/06/2026" },
];

const alertConfig = {
  overdue:       { icon: Clock,         bg: "bg-red-400/10",    border: "border-red-400/20",    text: "text-red-400",    dot: "bg-red-400"    },
  "missing-doc": { icon: FileX,         bg: "bg-amber-400/10",  border: "border-amber-400/20",  text: "text-amber-400",  dot: "bg-amber-400"  },
  "due-soon":    { icon: AlertTriangle, bg: "bg-blue-400/10",   border: "border-blue-400/20",   text: "text-blue-400",   dot: "bg-blue-400"   },
};

export function AlertsStrip() {
  if (mockAlerts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">Alertas</h3>
        <span className="text-[10px] font-semibold text-muted-foreground bg-white/[0.06] rounded-full px-2 py-0.5">
          {mockAlerts.length}
        </span>
      </div>

      <div className="space-y-2">
        {mockAlerts.map((alert, i) => {
          const cfg = alertConfig[alert.type];
          const Icon = cfg.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border ${cfg.border} ${cfg.bg} px-3 py-2.5`}
            >
              <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${cfg.text}`} />
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold ${cfg.text}`}>{alert.message}</p>
                <p className="text-[10px] text-muted-foreground truncate">{alert.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
