"use client";

import { Plus, Eye, Download, Paperclip, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusBadgeDropdown, type DocStatus } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockPOs: {
  id: number; number: string; supplier: string; woRef: string;
  issueDate: string; deliveryDate: string; total: number; status: DocStatus; hasAttachment: boolean;
}[] = [
  { id: 1, number: "OC-0012", supplier: "Proveedor Químicos Sur", woRef: "OT-0088", issueDate: "2026-05-03", deliveryDate: "2026-05-07", total: 850000, status: "approved",         hasAttachment: true  },
  { id: 2, number: "OC-0011", supplier: "Transportes Flores",     woRef: "OT-0087", issueDate: "2026-04-29", deliveryDate: "2026-05-05", total: 420000, status: "pending_approval", hasAttachment: false },
  { id: 3, number: "OC-0010", supplier: "Proveedor Químicos Sur", woRef: "OT-0086", issueDate: "2026-04-21", deliveryDate: "2026-04-24", total: 310000, status: "invoiced",         hasAttachment: true  },
];

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{mockPOs.length} órdenes de compra</p>
        <ButtonLink href="/purchase-orders/new" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" />
          Nueva OC
        </ButtonLink>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["N° OC", "Proveedor", "Ref. OT", "Fecha emisión", "Entrega", "Total", "Estado", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockPOs.map((po) => (
              <tr key={po.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{po.number}</span>
                    {po.hasAttachment && (
                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{po.supplier}</td>
                <td className="px-4 py-3 text-muted-foreground text-[12px]">{po.woRef}</td>
                <td className="px-4 py-3 text-muted-foreground">{po.issueDate}</td>
                <td className="px-4 py-3 text-muted-foreground">{po.deliveryDate}</td>
                <td className="px-4 py-3 font-medium">{formatCLP(po.total)}</td>
                <td className="px-4 py-3"><StatusBadgeDropdown docType="purchase_order" status={po.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <ButtonLink href={`/purchase-orders/${po.id}`} variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </ButtonLink>
                    <ButtonLink href={`/purchase-orders/${po.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
                      <Pencil className="h-3.5 w-3.5" />
                    </ButtonLink>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
