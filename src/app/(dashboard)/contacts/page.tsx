import { Plus, Building2, User, Pencil } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const clients = [
  { id: 1, name: "Constructora ABC Ltda.", rut: "76.543.210-K", contact: "Juan Pérez", email: "jperez@abc.cl", phone: "+56 9 1234 5678", paymentMethod: "Transferencia", district: "Santiago" },
  { id: 2, name: "Inmobiliaria Sur SpA", rut: "77.123.456-3", contact: "María González", email: "mgonzalez@sur.cl", phone: "+56 9 8765 4321", paymentMethod: "Crédito 30 días", district: "Rancagua" },
  { id: 3, name: "Minera Norte SA", rut: "90.876.543-2", contact: "Carlos Ríos", email: "crios@nortemina.cl", phone: "+56 9 5555 6666", paymentMethod: "Transferencia", district: "Copiapó" },
  { id: 4, name: "Municipalidad de Rancagua", rut: "69.190.200-0", contact: "Secretaría", email: "secretaria@muni.cl", phone: "+56 72 222 3333", paymentMethod: "Cheque", district: "Rancagua" },
];

const suppliers = [
  { id: 1, name: "Proveedor Químicos Sur", rut: "78.456.789-1", contact: "Luis Morales", email: "lmorales@quimicossur.cl", phone: "+56 9 9999 0000", paymentMethod: "Contado", district: "Santiago" },
  { id: 2, name: "Transportes Flores", rut: "76.111.222-3", contact: "Ana Flores", email: "aflores@transflores.cl", phone: "+56 9 7777 8888", paymentMethod: "Transferencia", district: "Maipú" },
];

function ContactTable({ data }: { data: typeof clients }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {["Nombre / Razón Social", "RUT", "Contacto", "Email", "Forma de Pago", "Comuna", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-[12px]">{c.rut}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.contact}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{c.paymentMethod}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{c.district}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 justify-end">
                  <ButtonLink href={`/contacts/${c.id}`} variant="ghost" size="sm" className="h-7 text-[11px]">
                    Ver
                  </ButtonLink>
                  <ButtonLink href={`/contacts/${c.id}/edit`} variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </ButtonLink>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          {clients.length} clientes · {suppliers.length} proveedores
        </p>
        <ButtonLink href="/contacts/new" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" />
          Nuevo contacto
        </ButtonLink>
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="h-8 rounded-xl bg-muted p-0.5">
          <TabsTrigger value="clients" className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-background">
            <Building2 className="h-3.5 w-3.5" />
            Clientes ({clients.length})
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-background">
            <User className="h-3.5 w-3.5" />
            Proveedores ({suppliers.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="mt-4">
          <ContactTable data={clients} />
        </TabsContent>
        <TabsContent value="suppliers" className="mt-4">
          <ContactTable data={suppliers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
