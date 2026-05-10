"use client";

import { formatCLP } from "@/lib/utils/format";

interface OTRow {
  id: string;
  client: string;
  invoiced: number;
  realCost: number;
}

const mockData: OTRow[] = [
  { id: "OT-2026-031", client: "Minera Collahuasi",    invoiced: 4800000, realCost: 2900000 },
  { id: "OT-2026-030", client: "Codelco Chuquicamata", invoiced: 7200000, realCost: 6100000 },
  { id: "OT-2026-029", client: "Anglo American",       invoiced: 3100000, realCost: 1650000 },
  { id: "OT-2026-028", client: "Antofagasta Minerals",  invoiced: 9500000, realCost: 7600000 },
  { id: "OT-2026-027", client: "Teck Carmen de Andacollo", invoiced: 2800000, realCost: 2100000 },
  { id: "OT-2026-026", client: "Minera Los Pelambres", invoiced: 5600000, realCost: 2800000 },
  { id: "OT-2026-025", client: "Collahuasi",           invoiced: 1900000, realCost: 1720000 },
  { id: "OT-2026-024", client: "SQM",                  invoiced: 6300000, realCost: 3400000 },
];

const GREEN_THRESHOLD  = 30;
const YELLOW_THRESHOLD = 15;

function Semaphore({ margin }: { margin: number }) {
  const color =
    margin >= GREEN_THRESHOLD  ? "bg-emerald-400" :
    margin >= YELLOW_THRESHOLD ? "bg-amber-400"   :
                                  "bg-red-400";
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

function DeviationPill({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <span className={`text-[11px] font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {positive ? "+" : ""}{pct.toFixed(1)}%
    </span>
  );
}

export function ProfitabilityTable() {
  const rows = mockData.map(row => {
    const margin = row.invoiced > 0 ? ((row.invoiced - row.realCost) / row.invoiced) * 100 : 0;
    const avgMargin = 38;
    const deviation = margin - avgMargin;
    return { ...row, margin, deviation };
  });

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">Rentabilidad por OT</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Últimas 8 órdenes de trabajo</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />≥{GREEN_THRESHOLD}%</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />≥{YELLOW_THRESHOLD}%</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />&lt;{YELLOW_THRESHOLD}%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["OT", "Cliente", "Facturado", "Costo Real", "Margen", "Desviación", ""].map(h => (
                <th key={h} className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 pr-4 last:pr-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map(row => (
              <tr key={row.id} className="group">
                <td className="py-2.5 pr-4 text-[11px] font-mono text-muted-foreground">{row.id}</td>
                <td className="py-2.5 pr-4 text-[12px] text-foreground max-w-[140px] truncate">{row.client}</td>
                <td className="py-2.5 pr-4 text-[12px] font-medium text-foreground">{formatCLP(row.invoiced)}</td>
                <td className="py-2.5 pr-4 text-[12px] text-muted-foreground">{formatCLP(row.realCost)}</td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-14 rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          row.margin >= GREEN_THRESHOLD ? "bg-emerald-400/70" :
                          row.margin >= YELLOW_THRESHOLD ? "bg-amber-400/70" : "bg-red-400/70"
                        }`}
                        style={{ width: `${Math.min(row.margin, 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground">{row.margin.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4"><DeviationPill pct={row.deviation} /></td>
                <td className="py-2.5"><Semaphore margin={row.margin} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
