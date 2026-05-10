"use client";

import { Plus, Eye, Download, Truck, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusBadgeDropdown, type DocStatus } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockWOs: {
  id: number; number: string; quoteRef: string; client: string;
  requestDate: string; serviceDate: string; operator: string; vehicle: string;
  total: number; status: DocStatus;
}[] = [
  { id: 1, number: "OT-0088", quoteRef: "COT-0043", client: "Minera Norte SA",    requestDate: "2026-05-02", serviceDate: "2026-05-08", operator: "Carlos Mendoza", vehicle: "BCRZ-14", total: 9600000, status: "approved"        },
  { id: 2, number: "OT-0087", quoteRef: "COT-0041", client: "Inmobiliaria Sur",   requestDate: "2026-04-28", serviceDate: "2026-05-10", operator: "Pedro Soto",    vehicle: "FJKP-88", total: 3200000, status: "pending_approval" },
  { id: 3, number: "OT-0086", quoteRef: "COT-0040", client: "Constructora ABC",   requestDate: "2026-04-20", serviceDate: "2026-04-25", operator: "Carlos Mendoza", vehicle: "BCRZ-14", total: 5100000, status: "invoiced"        },
];

export default function WorkOrdersPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{mockWOs.length} órdenes de trabajo</p>
        <ButtonLink href="/work-orders/new" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" />
          Nueva OT
        </ButtonLink>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["N° OT", "Cotización origen", "Cliente", "F. Servicio", "Operario / Vehículo", "Total", "Estado", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockWOs.map(wo => (
              <tr key={wo.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{wo.number}</td>
                <td className="px-4 py-3 text-muted-foreground text-[12px]">{wo.quoteRef}</td>
                <td className="px-4 py-3 text-muted-foreground">{wo.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{wo.serviceDate}</td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[12px]"><User className="h-3 w-3 text-muted-foreground" /><span>{wo.operator}</span></div>
                    <div className="flex items-center gap-1 text-[12px] text-muted-foreground"><Truck className="h-3 w-3" /><span>{wo.vehicle}</span></div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{formatCLP(wo.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadgeDropdown docType="work_order" status={wo.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <ButtonLink href={`/work-orders/${wo.id}`} variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </ButtonLink>
                    <ButtonLink href={`/work-orders/${wo.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
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
