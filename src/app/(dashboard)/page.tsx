import { FileText, ClipboardList, DollarSign, Users } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ConversionFunnel } from "@/components/dashboard/ConversionFunnel";
import { ResourceAvailability } from "@/components/dashboard/ResourceAvailability";

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-7xl">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard title="Cotizaciones abiertas" value="24"   subtitle="Este mes"            trend={{ value: 12, label: "vs mes anterior" }} icon={FileText} />
        <KpiCard title="OTs en progreso"        value="18"   subtitle="7 cierran esta semana" trend={{ value: 5,  label: "vs mes anterior" }} icon={ClipboardList} />
        <KpiCard title="Facturación mensual"    value="$7,4M" subtitle="CLP neto"            trend={{ value: 8,  label: "vs mes anterior" }} icon={DollarSign} />
        <KpiCard title="Clientes activos"       value="41"   subtitle="3 nuevos este mes"   trend={{ value: 3,  label: "vs mes anterior" }} icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <ConversionFunnel />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ResourceAvailability />

        {/* Actividad reciente */}
        <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
          <h3 className="text-[13px] font-semibold text-foreground mb-4">Actividad reciente</h3>
          <ul className="space-y-3">
            {[
              { action: "Cotización aprobada", doc: "COT-0045", client: "Constructora ABC",        time: "Hace 20 min", color: "bg-emerald-400" },
              { action: "OT creada",           doc: "OT-0088",  client: "Inmobiliaria Sur",        time: "Hace 1 h",    color: "bg-blue-400" },
              { action: "Factura emitida",      doc: "FAC-0031", client: "Minera Norte",           time: "Hace 3 h",    color: "bg-blue-500" },
              { action: "Nueva cotización",     doc: "COT-0046", client: "Municipalidad Rancagua", time: "Hoy 09:14",   color: "bg-white/30" },
              { action: "OC recibida",          doc: "OC-0012",  client: "Constructora ABC",       time: "Ayer 17:30",  color: "bg-amber-400" },
            ].map((item) => (
              <li key={item.doc} className="flex items-start gap-3">
                <span className={`mt-[5px] h-1.5 w-1.5 rounded-full shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-foreground/90">
                    <span className="font-medium">{item.action}</span>
                    <span className="text-muted-foreground"> · {item.doc} — {item.client}</span>
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
