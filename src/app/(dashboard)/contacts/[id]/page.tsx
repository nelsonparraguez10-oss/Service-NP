import { Pencil, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

const mockContact = {
  id: 2, type: "client" as const,
  name: "Inmobiliaria Sur SpA", rut: "77.123.456-3",
  businessLine: "Inmobiliaria y construcción",
  address: "Av. Libertador Bernardo O'Higgins 1234", district: "Rancagua", region: "O'Higgins",
  contact: "María González", email: "mgonzalez@sur.cl", phone: "+56 9 8765 4321",
  paymentMethod: "Crédito 30 días",
  notes: "Cliente prioritario. Siempre pide factura electrónica.",
  lastDocuments: [
    { number: "COT-0044", type: "Cotización", date: "2026-05-05", total: 2100000 },
    { number: "COT-0042", type: "Cotización", date: "2026-04-28", total: 1750000 },
    { number: "OT-0087",  type: "OT",         date: "2026-04-28", total: 3200000 },
  ],
};

import { formatCLP } from "@/lib/utils/format";

export default function ContactDetailPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/contacts" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          ← Clientes y Proveedores
        </ButtonLink>
        <ButtonLink href={`/contacts/${mockContact.id}/edit`} variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </ButtonLink>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{mockContact.name}</h2>
            <p className="text-[13px] font-mono text-muted-foreground mt-0.5">{mockContact.rut}</p>
            {mockContact.businessLine && (
              <p className="text-[12px] text-muted-foreground mt-0.5">{mockContact.businessLine}</p>
            )}
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
            mockContact.type === "client"   ? "border-blue-500/20 bg-blue-500/10 text-blue-400" :
            mockContact.type === "supplier" ? "border-violet-500/20 bg-violet-500/10 text-violet-400" :
                                              "border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}>
            {{ client: "Cliente", supplier: "Proveedor", both: "Cliente y Proveedor" }[mockContact.type]}
          </span>
        </div>

        <div className="h-px bg-border" />

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Contacto</p>
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-foreground">{mockContact.contact}</p>
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {mockContact.email}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {mockContact.phone}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Dirección</p>
            <div className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>{mockContact.address}<br />{mockContact.district}, {mockContact.region}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Forma de pago</p>
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mt-2">
              <CreditCard className="h-3.5 w-3.5" />
              {mockContact.paymentMethod}
            </div>
          </div>
          {mockContact.notes && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Notas</p>
              <p className="text-[12px] text-muted-foreground mt-2">{mockContact.notes}</p>
            </div>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Recent documents */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Documentos recientes</p>
          <div className="space-y-2">
            {mockContact.lastDocuments.map(doc => (
              <div key={doc.number} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                <div>
                  <span className="text-[12px] font-medium text-foreground">{doc.number}</span>
                  <span className="ml-2 text-[11px] text-muted-foreground">{doc.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-muted-foreground">{doc.date}</span>
                  <span className="text-[12px] font-medium text-foreground">{formatCLP(doc.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}