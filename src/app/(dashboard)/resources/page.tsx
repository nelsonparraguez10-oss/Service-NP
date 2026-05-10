import { Plus, Truck, User, Wrench, Pencil } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ResourceStatus = "available" | "busy";

const vehicles = [
  { id: 1, name: "Camión Peugeot Boxer",      identifier: "BCRZ-14", status: "available" as ResourceStatus, currentWO: null,      until: null },
  { id: 2, name: "Camión Mercedes Sprinter",  identifier: "FJKP-88", status: "busy"      as ResourceStatus, currentWO: "OT-0087", until: "2026-05-10" },
];
const operators = [
  { id: 1, name: "Carlos Mendoza", identifier: "12.345.678-9", status: "available" as ResourceStatus, currentWO: null,      until: null },
  { id: 2, name: "Pedro Soto",     identifier: "15.432.987-K", status: "busy"      as ResourceStatus, currentWO: "OT-0087", until: "2026-05-10" },
  { id: 3, name: "Jorge Vidal",    identifier: "18.765.432-1", status: "available" as ResourceStatus, currentWO: null,      until: null },
];
const equipment = [
  { id: 1, name: "Baño Portátil #04", identifier: "BPT-004", status: "available" as ResourceStatus, currentWO: null,      until: null },
  { id: 2, name: "Baño Portátil #07", identifier: "BPT-007", status: "busy"      as ResourceStatus, currentWO: "OT-0088", until: "2026-05-15" },
  { id: 3, name: "Baño Portátil #09", identifier: "BPT-009", status: "available" as ResourceStatus, currentWO: null,      until: null },
];

function ResourceGrid({ data }: { data: typeof vehicles }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((r) => (
        <div key={r.id} className="rounded-2xl border border-white/[0.07] bg-card p-4 space-y-3 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-150">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-foreground">{r.name}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{r.identifier}</p>
            </div>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              r.status === "available"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10  text-amber-400  border-amber-500/20"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full",
                r.status === "available" ? "bg-emerald-400" : "bg-amber-400"
              )} />
              {r.status === "available" ? "Disponible" : "Ocupado"}
            </span>
          </div>
          {r.currentWO && (
            <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-[12px]">
              <span className="text-muted-foreground">OT asignada: </span>
              <ButtonLink href={`/work-orders/${r.currentWO}`} variant="link" className="h-auto p-0 text-[12px] font-medium text-blue-400">
                {r.currentWO}
              </ButtonLink>
              <span className="text-muted-foreground ml-1">· hasta {r.until}</span>
            </div>
          )}
          <div className="flex justify-end pt-1">
            <ButtonLink href={`/resources/${r.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
              <Pencil className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryBar({ resources }: { resources: Array<{ status: ResourceStatus }> }) {
  const available = resources.filter(r => r.status === "available").length;
  const pct = Math.round((available / resources.length) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] text-muted-foreground shrink-0">{available}/{resources.length} disponibles</span>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {vehicles.length + operators.length + equipment.length} recursos registrados
        </p>
        <ButtonLink href="/resources/new" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" />
          Nuevo recurso
        </ButtonLink>
      </div>

      <Tabs defaultValue="operators">
        <TabsList className="h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] p-0.5">
          <TabsTrigger value="operators" className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-white/[0.10] data-[state=active]:text-foreground text-muted-foreground">
            <User className="h-3.5 w-3.5" /> Operarios ({operators.length})
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-white/[0.10] data-[state=active]:text-foreground text-muted-foreground">
            <Truck className="h-3.5 w-3.5" /> Flota ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="equipment" className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-white/[0.10] data-[state=active]:text-foreground text-muted-foreground">
            <Wrench className="h-3.5 w-3.5" /> Equipos ({equipment.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="operators"  className="mt-4 space-y-3"><SummaryBar resources={operators} /><ResourceGrid data={operators} /></TabsContent>
        <TabsContent value="vehicles"   className="mt-4 space-y-3"><SummaryBar resources={vehicles} /><ResourceGrid data={vehicles} /></TabsContent>
        <TabsContent value="equipment"  className="mt-4 space-y-3"><SummaryBar resources={equipment} /><ResourceGrid data={equipment} /></TabsContent>
      </Tabs>
    </div>
  );
}
