import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { formatCLP } from "@/lib/utils/format";
import { CashFlowChart }      from "@/components/finances/CashFlowChart";
import { IvaSummaryBlock }     from "@/components/finances/IvaSummaryBlock";
import { ProfitabilityTable }  from "@/components/finances/ProfitabilityTable";
import { ExpensesSplitBar }    from "@/components/finances/ExpensesSplitBar";
import { AlertsStrip }         from "@/components/finances/AlertsStrip";

interface KpiProps {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  iconColor: string;
}

function FinKpi({ label, value, sub, trend, trendValue, icon: Icon, iconColor }: KpiProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="text-[22px] font-semibold tracking-tight text-foreground leading-none">{value}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {trend && trendValue && (
            <span className={`flex items-center gap-0.5 text-[11px] font-medium ${
              trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"
            }`}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
              {trendValue}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">{sub}</span>
        </div>
      </div>
    </div>
  );
}

export default function FinancesPage() {
  return (
    <div className="p-6 space-y-6">

      {/* ZONA A — KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <FinKpi
          label="Ingresos del Mes"
          value={formatCLP(7200000)}
          sub="vs mes anterior"
          trend="up"
          trendValue="+8.4%"
          icon={DollarSign}
          iconColor="text-blue-400"
        />
        <FinKpi
          label="Gastos del Mes"
          value={formatCLP(4800000)}
          sub="vs mes anterior"
          trend="down"
          trendValue="+14.3%"
          icon={TrendingDown}
          iconColor="text-red-400"
        />
        <FinKpi
          label="Resultado Neto"
          value={formatCLP(2400000)}
          sub="margen 33.3%"
          trend="up"
          trendValue="+2.1%"
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />
        <FinKpi
          label="Margen Promedio OT"
          value="38.2%"
          sub="últimas 8 OTs"
          trend="up"
          trendValue="+1.8pp"
          icon={Percent}
          iconColor="text-amber-400"
        />
      </div>

      {/* ZONA B — Flujo de Caja + IVA */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <IvaSummaryBlock
          debito={1368000}
          credito={114000}
          period="Mayo 2026"
          dueDate="12/06/2026"
        />
      </div>

      {/* ZONA C — Rentabilidad por OT */}
      <ProfitabilityTable />

      {/* ZONA D — Split de Gastos + Alertas */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ExpensesSplitBar
          fixed={1920000}
          variable={2880000}
          period="Mayo 2026"
        />
        <AlertsStrip />
      </div>

    </div>
  );
}
