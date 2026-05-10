import { Plus, Search, Tag, ToggleRight, Pencil } from "lucide-react";
import { formatCLP } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  code: string;
  name: string;
  description: string;
  unit: string;
  defaultUnitPrice: number;
  taxable: boolean;
  isActive: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  services: Service[];
}

const catalog: ServiceCategory[] = [
  {
    id: 1,
    name: "Sanitización y Aseo Industrial",
    services: [
      { id: 1,  code: "SAN-001", name: "Sanitización de instalaciones",       description: "Limpieza y desinfección profunda de instalaciones industriales",   unit: "M²",  defaultUnitPrice: 1200,    taxable: true,  isActive: true  },
      { id: 2,  code: "SAN-002", name: "Aseo de faena diario",                description: "Servicio de aseo continuo en faenas mineras",                      unit: "DÍA", defaultUnitPrice: 180000,  taxable: true,  isActive: true  },
      { id: 3,  code: "SAN-003", name: "Sanitización post-obra",              description: "Limpieza y retiro de escombros al término de obra",                 unit: "UN",  defaultUnitPrice: 95000,   taxable: true,  isActive: true  },
    ],
  },
  {
    id: 2,
    name: "Baños Portátiles",
    services: [
      { id: 4,  code: "BAN-001", name: "Arriendo baño portátil estándar",     description: "Baño portátil individual con mantención incluida",                 unit: "DÍA", defaultUnitPrice: 8500,    taxable: true,  isActive: true  },
      { id: 5,  code: "BAN-002", name: "Arriendo baño portátil premium",      description: "Baño portátil con lavamanos y espejo incluido",                    unit: "DÍA", defaultUnitPrice: 12000,   taxable: true,  isActive: true  },
      { id: 6,  code: "BAN-003", name: "Mantención baño portátil",            description: "Vaciado, limpieza y reposición de insumos",                        unit: "UN",  defaultUnitPrice: 25000,   taxable: true,  isActive: true  },
      { id: 7,  code: "BAN-004", name: "Traslado baño portátil",              description: "Retiro e instalación en nuevo destino",                            unit: "UN",  defaultUnitPrice: 45000,   taxable: true,  isActive: false },
    ],
  },
  {
    id: 3,
    name: "Mantención Industrial",
    services: [
      { id: 8,  code: "MAN-001", name: "Mantención eléctrica preventiva",     description: "Revisión y mantención de tableros e instalaciones eléctricas",     unit: "HR",  defaultUnitPrice: 35000,   taxable: true,  isActive: true  },
      { id: 9,  code: "MAN-002", name: "Soldadura industrial",                description: "Trabajos de soldadura MIG/TIG en estructuras metálicas",           unit: "HR",  defaultUnitPrice: 42000,   taxable: true,  isActive: true  },
      { id: 10, code: "MAN-003", name: "Mantención de duchas y vestuarios",   description: "Revisión, reparación y limpieza de instalaciones sanitarias",      unit: "UN",  defaultUnitPrice: 85000,   taxable: true,  isActive: true  },
    ],
  },
  {
    id: 4,
    name: "Transporte y Logística",
    services: [
      { id: 11, code: "TRS-001", name: "Flete material pesado",               description: "Transporte de materiales e insumos en camión hasta faena",         unit: "KM",  defaultUnitPrice: 850,     taxable: true,  isActive: true  },
      { id: 12, code: "TRS-002", name: "Servicio de camioneta",               description: "Traslado de personal y equipos livianos",                          unit: "DÍA", defaultUnitPrice: 95000,   taxable: true,  isActive: true  },
    ],
  },
];

const allServices = catalog.flatMap(c => c.services);
const activeCount  = allServices.filter(s => s.isActive).length;

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-5">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Total servicios</p>
            <p className="text-[15px] font-semibold text-foreground">{allServices.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Activos</p>
            <p className="text-[15px] font-semibold text-emerald-400">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Categorías</p>
            <p className="text-[15px] font-semibold text-foreground">{catalog.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Buscar servicio..."
              className="h-8 w-52 rounded-xl border border-white/[0.08] bg-white/[0.04] pl-8 pr-3 text-[12px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-white/[0.16] focus:bg-white/[0.06] transition-all"
            />
          </div>
          <ButtonLink href="/services/new" variant="default" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Nuevo Servicio
          </ButtonLink>
        </div>
      </div>

      {/* Catalog grouped by category */}
      <div className="space-y-6">
        {catalog.map(category => (
          <div key={category.id} className="space-y-2">
            {/* Category header */}
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground/60" />
              <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {category.name}
              </h2>
              <span className="text-[10px] text-muted-foreground/40">
                ({category.services.filter(s => s.isActive).length}/{category.services.length})
              </span>
            </div>

            {/* Services table */}
            <div className="rounded-2xl border border-white/[0.07] bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Código", "Servicio", "Descripción", "Unidad", "Precio unitario", "IVA", "Estado", ""].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {category.services.map(svc => (
                    <tr
                      key={svc.id}
                      className={cn(
                        "hover:bg-white/[0.02] transition-colors",
                        !svc.isActive && "opacity-50"
                      )}
                    >
                      <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{svc.code}</td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-foreground">{svc.name}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground max-w-[240px] truncate">
                        {svc.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {svc.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-foreground">
                        {formatCLP(svc.defaultUnitPrice)}
                      </td>
                      <td className="px-4 py-3">
                        {svc.taxable
                          ? <span className="text-[10px] font-medium text-blue-400">19%</span>
                          : <span className="text-[10px] font-medium text-muted-foreground">Exento</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          svc.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-white/[0.04] text-muted-foreground border-white/[0.08]"
                        )}>
                          <ToggleRight className="h-3 w-3" />
                          {svc.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ButtonLink href={`/services/${svc.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </ButtonLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
