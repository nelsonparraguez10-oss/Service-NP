"use client";

import { Plus, Download, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusBadgeDropdown, type DocStatus } from "@/components/documents/StatusChanger";
import { formatCLP } from "@/lib/utils/format";

const mockQuotes: { id: number; number: string; client: string; date: string; validity: string; total: number; status: DocStatus }[] = [
  { id: 1, number: "COT-0045", client: "Constructora ABC",           date: "2026-05-07", validity: "2026-05-21", total: 4850000, status: "approved"         },
  { id: 2, number: "COT-0044", client: "Inmobiliaria Sur",           date: "2026-05-05", validity: "2026-05-19", total: 2100000, status: "pending_approval"  },
  { id: 3, number: "COT-0043", client: "Minera Norte SA",            date: "2026-05-02", validity: "2026-05-16", total: 9600000, status: "approved"          },
  { id: 4, number: "COT-0042", client: "Municipalidad de Rancagua",  date: "2026-04-28", validity: "2026-05-12", total: 1750000, status: "draft"             },
  { id: 5, number: "COT-0041", client: "Empresa Logística XP",       date: "2026-04-25", validity: "2026-05-09", total: 3200000, status: "rejected"          },
];

export default function QuotesPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{mockQuotes.length} cotizaciones registradas</p>
        <ButtonLink href="/quotes/new" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" />
          Nueva cotización
        </ButtonLink>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["N° Cotización", "Cliente", "Fecha emisión", "Validez", "Total", "Estado", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockQuotes.map(q => (
              <tr key={q.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{q.number}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{q.validity}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCLP(q.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadgeDropdown docType="quote" status={q.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <ButtonLink href={`/quotes/${q.id}`} variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </ButtonLink>
                    <ButtonLink href={`/quotes/${q.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
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
