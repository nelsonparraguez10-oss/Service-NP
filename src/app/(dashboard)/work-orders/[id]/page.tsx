"use client";

import { Pencil, Download, User, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusChanger } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockWO = {
  id: 1, number: "OT-0088", quoteRef: "COT-0043",
  client: "Minera Norte SA", clientRut: "90.876.543-2",
  requestDate: "2026-05-02", serviceDate: "2026-05-08",
  operator: "Carlos Mendoza", vehicle: "BCRZ-14",
  notes: "Acceso por portería norte. Contacto en faena: Rodrigo Pérez +56 9 8765 4321.",
  items: [
    { description: "Sanitización de instalaciones", unit: "M²",  quantity: 800, unitPrice: 1200,  discount: 0 },
    { description: "Aseo de faena diario x 5 días", unit: "DÍA", quantity: 5,   unitPrice: 180000, discount: 0 },
    { description: "Traslado equipos",              unit: "UN",  quantity: 1,   unitPrice: 45000,  discount: 0 },
  ],
};

export default function WorkOrderDetailPage() {
  const net   = mockWO.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const iva   = Math.round(net * 0.19);
  const total = net + iva;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <ButtonLink href="/work-orders" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          ← Órdenes de Trabajo
        </ButtonLink>
        <div className="flex gap-2">
          <ButtonLink href={`/work-orders/${mockWO.id}/edit`} variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
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
      <StatusChanger docType="work_order" initialStatus="approved" />

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{mockWO.number}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Originada en{" "}
            <ButtonLink href="/quotes/1" variant="link" className="h-auto p-0 text-[12px] text-blue-400">{mockWO.quoteRef}</ButtonLink>
            {" · "}Servicio: {mockWO.serviceDate}
          </p>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Cliente</p>
            <p className="text-[13px] font-semibold text-foreground">{mockWO.client}</p>
            <p className="text-[12px] text-muted-foreground font-mono">{mockWO.clientRut}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Operario</p>
            <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /><p className="text-[13px] text-foreground">{mockWO.operator}</p></div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Vehículo</p>
            <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-muted-foreground" /><p className="text-[13px] text-foreground font-mono">{mockWO.vehicle}</p></div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Detalle de trabajos</p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Descripción", "Unidad", "Cantidad", "P. Unitario", "Total"].map(h => (
                  <th key={h} className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 pr-4 last:text-right last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {mockWO.items.map((item, i) => (
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

        {mockWO.notes && (
          <>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">Instrucciones en terreno</p>
              <p className="text-[12px] text-muted-foreground">{mockWO.notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
