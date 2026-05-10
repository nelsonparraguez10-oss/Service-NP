import { Plus, Filter, Pencil } from "lucide-react";
import { formatCLP } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button-link";

type ExpenseType     = "fixed" | "variable";
type ExpenseCategory = "rent" | "salaries" | "utilities" | "materials" | "subcontracts" | "transport" | "tools" | "other";

interface Expense {
  id: string;
  date: string;
  description: string;
  type: ExpenseType;
  category: ExpenseCategory;
  amount: number;
  otId?: string;
  hasDoc: boolean;
  isPaid: boolean;
}

const categoryLabel: Record<ExpenseCategory, string> = {
  rent:          "Arriendo",
  salaries:      "Sueldos",
  utilities:     "Servicios básicos",
  materials:     "Materiales",
  subcontracts:  "Subcontratos",
  transport:     "Traslados",
  tools:         "Herramientas",
  other:         "Otros",
};

const mockExpenses: Expense[] = [
  { id: "EXP-2026-041", date: "2026-05-08", description: "Arriendo bodega Quilicura",        type: "fixed",    category: "rent",         amount: 480000,  hasDoc: true,  isPaid: true  },
  { id: "EXP-2026-040", date: "2026-05-07", description: "Materiales OT-2026-031",           type: "variable", category: "materials",    amount: 890000,  otId: "OT-2026-031", hasDoc: true,  isPaid: true  },
  { id: "EXP-2026-039", date: "2026-05-06", description: "Subcontrato soldador OT-030",      type: "variable", category: "subcontracts", amount: 350000,  otId: "OT-2026-030", hasDoc: false, isPaid: false },
  { id: "EXP-2026-038", date: "2026-05-05", description: "Combustible camioneta",            type: "variable", category: "transport",    amount: 120000,  hasDoc: false, isPaid: true  },
  { id: "EXP-2026-037", date: "2026-05-04", description: "Electricidad oficina central",     type: "fixed",    category: "utilities",    amount: 68000,   hasDoc: true,  isPaid: true  },
  { id: "EXP-2026-036", date: "2026-05-03", description: "Herramientas OT-2026-028",         type: "variable", category: "tools",        amount: 210000,  otId: "OT-2026-028", hasDoc: false, isPaid: true  },
  { id: "EXP-2026-035", date: "2026-05-02", description: "Internet + telefonía",             type: "fixed",    category: "utilities",    amount: 45000,   hasDoc: true,  isPaid: true  },
  { id: "EXP-2026-034", date: "2026-05-01", description: "Materiales instalación eléctrica", type: "variable", category: "materials",    amount: 460000,  otId: "OT-2026-029", hasDoc: true,  isPaid: false },
];

function TypeBadge({ type }: { type: ExpenseType }) {
  return type === "fixed"
    ? <span className="rounded-md border border-violet-400/20 bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400">Fijo</span>
    : <span className="rounded-md border border-orange-400/20 bg-orange-400/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">Variable</span>;
}

function DocBadge({ hasDoc }: { hasDoc: boolean }) {
  return hasDoc
    ? <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">Con respaldo</span>
    : <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">Sin respaldo</span>;
}

function PaidBadge({ isPaid }: { isPaid: boolean }) {
  return isPaid
    ? <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">Pagado</span>
    : <span className="rounded-md border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">Pendiente</span>;
}

export default function ExpensesPage() {
  const total    = mockExpenses.reduce((s, e) => s + e.amount, 0);
  const totalFixed    = mockExpenses.filter(e => e.type === "fixed").reduce((s, e) => s + e.amount, 0);
  const totalVariable = mockExpenses.filter(e => e.type === "variable").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-6 space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Total mes</p>
            <p className="text-[15px] font-semibold text-foreground">{formatCLP(total)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Fijos</p>
            <p className="text-[15px] font-semibold text-violet-400">{formatCLP(totalFixed)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-card px-4 py-2 text-center">
            <p className="text-[10px] text-muted-foreground">Variables</p>
            <p className="text-[15px] font-semibold text-orange-400">{formatCLP(totalVariable)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
          <ButtonLink href="/finances/expenses/new" variant="default" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Nuevo Gasto
          </ButtonLink>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["ID", "Fecha", "Descripción", "Tipo", "Categoría", "OT", "Monto", "Respaldo", "Estado", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {mockExpenses.map(exp => (
              <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{exp.id}</td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">{exp.date}</td>
                <td className="px-4 py-3 text-[12px] text-foreground max-w-[200px] truncate">{exp.description}</td>
                <td className="px-4 py-3"><TypeBadge type={exp.type} /></td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">{categoryLabel[exp.category]}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{exp.otId ?? "—"}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground">{formatCLP(exp.amount)}</td>
                <td className="px-4 py-3"><DocBadge hasDoc={exp.hasDoc} /></td>
                <td className="px-4 py-3"><PaidBadge isPaid={exp.isPaid} /></td>
                <td className="px-4 py-3">
                  <ButtonLink href={`/finances/expenses/${exp.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
