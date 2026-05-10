"use client";

import { Pencil, Download, Paperclip } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusChanger } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockPO = {
  id: 1, number: "OC-0012", woRef: "OT-0088",
  supplier: "Ferretería Industrial S.A.", supplierRut: "76.123.456-7",
  issueDate: "2026-05-03", deliveryDate: "2026-05-07",
  hasAttachment: true,
  notes: "Entregar en bodega central, preguntar por encargado Martínez.",
  items: [
    { description: "Tornillería M8 (caja x 100)",          unit: "CJ", quantity: 5,  unitPrice: 8500  },
    { description: "Sellador industrial 600ml",             unit: "UN", quantity: 12, unitPrice: 18000 },
    { description: "Guantes nitrilo talla M (caja x 100)", unit: "CJ", quantity: 3,  unitPrice: 22000 },
  ],
};

export default function PurchaseOrderDetailPage() {
  const net   = mockPO.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const iva   = Math.round(net * 0.19);
  const total = net + iva;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <ButtonLink href="/purchase-orders" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          ← Órdenes de Compra
        </ButtonLink>
        <div className="flex gap-2">
          <ButtonLink href={`/purchase-orders/${mockPO.id}/edit`} variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
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
      <StatusChanger docType="purchase_order" initialStatus="draft" />

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">{mockPO.number}</h2>
              {mockPO.hasAttachment && <Paperclip className="h-4 w-4 text-muted-foreground" />}
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Vinculada a{" "}
              <ButtonLink href="/work-orders/1" variant="link" className="h-auto p-0 text-[12px] text-blue-400">{mockPO.woRef}</ButtonLink>
              {" · "}Emisión {mockPO.issueDate} · Entrega {mockPO.deliveryDate}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Proveedor</p>
            <p className="text-[13px] font-semibold text-foreground">{mockPO.supplier}</p>
            <p className="text-[12px] text-muted-foreground font-mono">{mockPO.supplierRut}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Fechas</p>
            <p className="text-[12px] text-muted-foreground">Emisión: <span className="text-foreground">{mockPO.issueDate}</span></p>
            <p className="text-[12px] text-muted-foreground">Entrega: <span className="text-foreground">{mockPO.deliveryDate}</span></p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Ítems</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Descripción", "Unidad", "Cantidad", "P. Unitario", "Total"].map(h => (
                  <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 pr-4 last:text-right last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {mockPO.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 pr-4 text-[13px] text-foreground">{item.description}</td>
                  <td className="py-3 pr-4 text-[12px] text-muted-foreground">{item.unit}</td>
                  <td className="py-3 pr-4 text-[12px] text-muted-foreground">{item.quantity}</td>
                  <td className="py-3 pr-4 text-[12px] text-muted-foreground">{formatCLP(item.unitPrice)}</td>
                  <td className="py-3 text-[13px] font-medium text-foreground text-right">{formatCLP(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
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

        {mockPO.notes && (
          <>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">Notas al proveedor</p>
              <p className="text-[12px] text-muted-foreground">{mockPO.notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
