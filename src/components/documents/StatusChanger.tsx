"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type DocStatus = "draft" | "pending_approval" | "approved" | "rejected" | "invoiced" | "cancelled";
export type DocType   = "quote" | "work_order" | "purchase_order";

// ── Labels & Colors ──────────────────────────────────────────────────────────

const statusMeta: Record<DocStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:            { label: "Borrador",    color: "text-white/50",   bg: "bg-white/[0.06]",   border: "border-white/[0.10]"   },
  pending_approval: { label: "En revisión", color: "text-amber-400",  bg: "bg-amber-400/10",   border: "border-amber-400/20"   },
  approved:         { label: "Aprobado",    color: "text-emerald-400",bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  rejected:         { label: "Rechazado",   color: "text-red-400",    bg: "bg-red-400/10",     border: "border-red-400/20"     },
  invoiced:         { label: "Facturado",   color: "text-blue-400",   bg: "bg-blue-400/10",    border: "border-blue-400/20"    },
  cancelled:        { label: "Cancelado",   color: "text-white/25",   bg: "bg-white/[0.03]",   border: "border-white/[0.06]"   },
};

// ── Transitions ───────────────────────────────────────────────────────────────

type Transition = { to: DocStatus; label: string; style: "primary" | "danger" | "ghost" };

const transitions: Record<DocType, Partial<Record<DocStatus, Transition[]>>> = {
  quote: {
    draft:            [{ to: "pending_approval", label: "Enviar a revisión",  style: "primary" }, { to: "cancelled",   label: "Cancelar",       style: "danger"  }],
    pending_approval: [{ to: "approved",         label: "Aprobar",            style: "primary" }, { to: "rejected",    label: "Rechazar",        style: "danger"  }, { to: "draft", label: "Devolver a borrador", style: "ghost" }],
    approved:         [{ to: "invoiced",         label: "Marcar como facturada", style: "primary" }, { to: "cancelled", label: "Cancelar",       style: "danger"  }],
    rejected:         [{ to: "draft",            label: "Reabrir como borrador", style: "ghost"  }, { to: "cancelled", label: "Cancelar",        style: "danger"  }],
    invoiced:         [],
    cancelled:        [{ to: "draft",            label: "Reactivar",          style: "ghost"   }],
  },
  work_order: {
    draft:            [{ to: "pending_approval", label: "Enviar a revisión",  style: "primary" }, { to: "cancelled",   label: "Cancelar",       style: "danger"  }],
    pending_approval: [{ to: "approved",         label: "Aprobar OT",         style: "primary" }, { to: "draft",       label: "Devolver",        style: "ghost"   }],
    approved:         [{ to: "invoiced",         label: "Marcar como facturada", style: "primary" }, { to: "cancelled", label: "Cancelar",       style: "danger"  }],
    rejected:         [{ to: "draft",            label: "Reabrir",            style: "ghost"   }],
    invoiced:         [],
    cancelled:        [{ to: "draft",            label: "Reactivar",          style: "ghost"   }],
  },
  purchase_order: {
    draft:            [{ to: "pending_approval", label: "Enviar a revisión",  style: "primary" }, { to: "cancelled",   label: "Cancelar",       style: "danger"  }],
    pending_approval: [{ to: "approved",         label: "Aprobar OC",         style: "primary" }, { to: "draft",       label: "Devolver",        style: "ghost"   }],
    approved:         [{ to: "invoiced",         label: "Registrar recepción",style: "primary" }, { to: "cancelled",   label: "Cancelar",       style: "danger"  }],
    rejected:         [{ to: "draft",            label: "Reabrir",            style: "ghost"   }],
    invoiced:         [],
    cancelled:        [{ to: "draft",            label: "Reactivar",          style: "ghost"   }],
  },
};

// ── Pipeline steps (main track) ───────────────────────────────────────────────

const pipeline: DocStatus[] = ["draft", "pending_approval", "approved", "invoiced"];

function pipelineIndex(status: DocStatus): number {
  const idx = pipeline.indexOf(status);
  return idx === -1 ? -1 : idx; // -1 = off-track (rejected/cancelled)
}

// ── Component ─────────────────────────────────────────────────────────────────

interface StatusChangerProps {
  docType:          DocType;
  initialStatus:    DocStatus;
  onStatusChange?:  (next: DocStatus) => void;
}

export function StatusChanger({ docType, initialStatus, onStatusChange }: StatusChangerProps) {
  const [status, setStatus] = useState<DocStatus>(initialStatus);
  const [confirming, setConfirming] = useState<DocStatus | null>(null);

  const meta    = statusMeta[status];
  const steps   = transitions[docType][status] ?? [];
  const curIdx  = pipelineIndex(status);

  function apply(next: DocStatus) {
    setStatus(next);
    setConfirming(null);
    onStatusChange?.(next);
  }

  const btnStyle = (style: Transition["style"]) => cn(
    "rounded-xl border px-3 py-1.5 text-[12px] font-medium transition-all",
    style === "primary" && "border-white/[0.16] bg-white/[0.10] text-foreground hover:bg-white/[0.16]",
    style === "danger"  && "border-red-400/20  bg-red-400/[0.07]  text-red-400  hover:bg-red-400/[0.14]",
    style === "ghost"   && "border-white/[0.08] bg-transparent text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
  );

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-foreground">Estado del documento</p>
        <span className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide",
          meta.bg, meta.border, meta.color
        )}>
          {meta.label}
        </span>
      </div>

      {/* Pipeline */}
      <div className="flex items-center gap-0">
        {pipeline.map((step, i) => {
          const stepMeta = statusMeta[step];
          const done     = curIdx > i;
          const current  = curIdx === i;
          const isOffTrack = status === "rejected" || status === "cancelled";
          const active   = done || current;

          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                  done    && "border-emerald-500 bg-emerald-500",
                  current && !isOffTrack && `${meta.border} ${meta.bg}`,
                  current && isOffTrack  && "border-red-400/40 bg-red-400/10",
                  !active && "border-white/[0.12] bg-transparent",
                )}>
                  {done
                    ? <Check className="h-3 w-3 text-white" />
                    : <span className={cn("h-1.5 w-1.5 rounded-full",
                        current && !isOffTrack ? meta.color.replace("text-", "bg-") : "bg-white/20"
                      )} />
                  }
                </div>
                <span className={cn(
                  "text-[9px] font-medium whitespace-nowrap",
                  active ? (isOffTrack && current ? "text-red-400" : meta.color) : "text-muted-foreground/40"
                )}>
                  {stepMeta.label}
                </span>
              </div>
              {i < pipeline.length - 1 && (
                <div className={cn(
                  "h-px flex-1 mx-1 mb-4 transition-all",
                  done ? "bg-emerald-500/50" : "bg-white/[0.08]"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Off-track indicator */}
      {(status === "rejected" || status === "cancelled") && (
        <div className={cn(
          "rounded-xl border px-3 py-2 text-[11px]",
          status === "rejected" ? "border-red-400/20 bg-red-400/[0.07] text-red-400" : "border-white/[0.08] bg-white/[0.03] text-muted-foreground"
        )}>
          {status === "rejected" ? "Documento rechazado — puede reabrirse como borrador." : "Documento cancelado."}
        </div>
      )}

      {/* Action buttons */}
      {steps.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Acciones disponibles</p>
          <div className="flex flex-wrap gap-2">
            {steps.map(t => {
              const isConfirming = confirming === t.to;
              const needsConfirm = t.style === "danger";
              return (
                <div key={t.to} className="flex items-center gap-1">
                  <button
                    onClick={() => needsConfirm && !isConfirming ? setConfirming(t.to) : apply(t.to)}
                    className={btnStyle(t.style)}
                  >
                    {isConfirming ? "¿Confirmar?" : t.label}
                  </button>
                  {isConfirming && (
                    <button onClick={() => setConfirming(null)} className="rounded-xl border border-white/[0.08] bg-transparent px-2 py-1.5 text-[12px] text-muted-foreground hover:bg-white/[0.06]">
                      No
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {steps.length === 0 && status === "invoiced" && (
        <p className="text-[11px] text-muted-foreground/60">Documento en estado final. No hay más transiciones disponibles.</p>
      )}
    </div>
  );
}

// ── Inline badge for list pages ───────────────────────────────────────────────

interface StatusBadgeDropdownProps {
  docType:       DocType;
  status:        DocStatus;
  onStatusChange?: (next: DocStatus) => void;
}

export function StatusBadgeDropdown({ docType, status: initialStatus, onStatusChange }: StatusBadgeDropdownProps) {
  const [status, setStatus] = useState<DocStatus>(initialStatus);
  const [open,   setOpen]   = useState(false);

  const meta  = statusMeta[status];
  const steps = transitions[docType][status] ?? [];

  function apply(next: DocStatus) {
    setStatus(next);
    setOpen(false);
    onStatusChange?.(next);
  }

  if (steps.length === 0) {
    return (
      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", meta.bg, meta.border, meta.color)}>
        {meta.label}
      </span>
    );
  }

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(p => !p)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold cursor-pointer transition-opacity hover:opacity-80",
          meta.bg, meta.border, meta.color
        )}
      >
        {meta.label}
        <ChevronRight className={cn("h-2.5 w-2.5 transition-transform", open && "rotate-90")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-7 z-20 min-w-[160px] rounded-xl border border-white/[0.10] bg-[#1c1c1e] p-1 shadow-2xl backdrop-blur-xl">
            {steps.map(t => (
              <button key={t.to} onClick={() => apply(t.to)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors text-left",
                  t.style === "danger" ? "text-red-400 hover:bg-red-400/10" : "text-foreground hover:bg-white/[0.08]"
                )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta[t.to].bg.replace("/10", "/80").replace("bg-", "bg-"))} />
                {t.label}
                <span className={cn("ml-auto text-[10px]", statusMeta[t.to].color)}>{statusMeta[t.to].label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
