"use client";

import { Pencil, Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusChanger } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockQuote = {
  id: 1, number: "COT-0044", client: "Inmobiliaria Sur SpA",
  clientRut: "77.123.456-3", clientContact: "María González", clientEmail: "mgonzalez@sur.cl",
  date: "2026-05-05", validity: "2026-05-19",
  notes: "Incluir acceso a pisos superiores sin ascensor.",
  terms: "Pago a 30 días. Factura electrónica.",
  items: [
    { description: "Sanitización instalaciones", unit: "M²",  quantity: 200, unitPrice: 1200,  discount: 0 },
    { description: "Aseo de faena diario",       unit: "DÍA", quantity: 3,   unitPrice: 180000, discount: 5 },
  ],
};

export default function QuoteDetailPage() {
  const net   = mockQuote.items.reduce((s, i) => s + i.quantity * i.unitPrice * (1 - i.discount / 100), 0);
  const iva   = Math.round(net * 0.19);
  const total = net + iva;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <ButtonLink href="/quotes" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          ← Cotizaciones
        </ButtonLink>
        <div className="flex gap-2">
          <ButtonLink href={`/quotes/${mockQuote.id}/edit`} variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </ButtonLink>
          <ButtonLink href="#" variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Download className="h-3.5 w-3.5" />
            PDF
          </ButtonLink>
        </div>
      </div>

      {/* Status changer */}
      <StatusChanger docType="quote" initialStatus="pending_approval" />

      {/* Document card */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{mockQuote.number}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Emitida el {mockQuote.date} · Válida hasta {mockQuote.validity}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Cliente</p>
            <p className="text-[13px] font-semibold text-foreground">{mockQuote.client}</p>
            <p className="text-[12px] text-muted-foreground font-mono">{mockQuote.clientRut}</p>
            <p className="text-[12px] text-muted-foreground">{mockQuote.clientContact}</p>
            <p className="text-[12px] text-muted-foreground">{mockQuote.clientEmail}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Detalle de servicios</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Descripción", "Unidad", "Cantidad", "P. Unitario", "Descuento", "Total"].map(h => (
                  <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 pr-4 last:text-right last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {mockQuote.items.map((item, i) => {
                const lineTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                return (
                  <tr key={i}>
                    <td className="py-3 pr-4 text-[13px] text-foreground">{item.description}</td>
                    <td className="py-3 pr-4 text-[12px] text-muted-foreground">{item.unit}</td>
                    <td className="py-3 pr-4 text-[12px] text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 pr-4 text-[12px] text-muted-foreground">{formatCLP(item.unitPrice)}</td>
                    <td className="py-3 pr-4 text-[12px] text-muted-foreground">{item.discount}%</td>
                    <td className="py-3 text-[13px] font-medium text-foreground text-right">{formatCLP(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">Neto</span><span className="text-foreground">{formatCLP(net)}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">IVA (19%)</span><span className="text-foreground">{formatCLP(iva)}</span></div>
            <div className="h-px bg-white/[0.08]" />
            <div className="flex justify-between text-[14px] font-semibold"><span className="text-foreground">Total</span><span className="text-foreground">{formatCLP(total)}</span></div>
          </div>
        </div>

        {(mockQuote.notes || mockQuote.terms) && (
          <>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-6">
              {mockQuote.notes && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">Observaciones</p>
                  <p className="text-[12px] text-muted-foreground">{mockQuote.notes}</p>
                </div>
              )}
              {mockQuote.terms && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">Términos y condiciones</p>
                  <p className="text-[12px] text-muted-foreground">{mockQuote.terms}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
