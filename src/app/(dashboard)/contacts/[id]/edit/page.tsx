"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SaveButton } from "@/components/ui/save-button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSave } from "@/lib/hooks/useSave";
import { required, validEmail, validRut, type FieldErrors } from "@/lib/utils/validate";

type ContactType = "client" | "supplier" | "both";

const mockContact = {
  id: 2,
  type: "client" as ContactType,
  name: "Inmobiliaria Sur SpA",
  rut: "77.123.456-3",
  businessLine: "Inmobiliaria y construcción",
  address: "Av. Libertador Bernardo O'Higgins 1234",
  district: "Rancagua",
  region: "O'Higgins",
  contact: "María González",
  email: "mgonzalez@sur.cl",
  phone: "+56 9 8765 4321",
  paymentMethod: "Crédito 30 días",
  notes: "Cliente prioritario. Siempre pide factura electrónica.",
};

export default function EditContactPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [type,         setType]          = useState<ContactType>(mockContact.type);
  const [name,         setName]          = useState(mockContact.name);
  const [rut,          setRut]           = useState(mockContact.rut);
  const [businessLine, setBusinessLine]  = useState(mockContact.businessLine);
  const [address,      setAddress]       = useState(mockContact.address);
  const [district,     setDistrict]      = useState(mockContact.district);
  const [region,       setRegion]        = useState(mockContact.region);
  const [contact,      setContact]       = useState(mockContact.contact);
  const [email,        setEmail]         = useState(mockContact.email);
  const [phone,        setPhone]         = useState(mockContact.phone);
  const [paymentMethod,setPaymentMethod] = useState(mockContact.paymentMethod);
  const [notes,        setNotes]         = useState(mockContact.notes);

  function validate() {
    const e: FieldErrors = {};
    const nameErr = required(name); if (nameErr) e.name = nameErr;
    const rutErr  = validRut(rut);  if (rutErr)  e.rut  = rutErr;
    const emailErr = validEmail(email); if (emailErr) e.email = emailErr;
    const contactErr = required(contact); if (contactErr) e.contact = contactErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/contacts" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Clientes y Proveedores
        </ButtonLink>
        <SaveButton status={status} onClick={() => trigger(validate)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">{mockContact.name}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Editando contacto</p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Tipo de contacto</Label>
          <div className="flex gap-2">
            {(["client", "supplier", "both"] as ContactType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`rounded-xl border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  type === t ? "border-white/[0.20] bg-white/[0.10] text-foreground"
                             : "border-white/[0.07] bg-transparent text-muted-foreground hover:bg-white/[0.05]"}`}>
                {{ client: "Cliente", supplier: "Proveedor", both: "Ambos" }[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Datos de empresa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Razón social <Req /></Label>
              <Input value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                className={`h-9 text-[13px] ${errors.name ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.name} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">RUT <Req /></Label>
              <Input value={rut} onChange={e => { setRut(e.target.value); if (errors.rut) setErrors(p => ({ ...p, rut: "" })); }}
                placeholder="76.543.210-K" className={`h-9 text-[13px] font-mono ${errors.rut ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.rut} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Giro / Rubro</Label>
              <Input value={businessLine} onChange={e => setBusinessLine(e.target.value)} className="h-9 text-[13px]" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Dirección</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Comuna</Label>
              <Input value={district} onChange={e => setDistrict(e.target.value)} className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Región</Label>
              <Input value={region} onChange={e => setRegion(e.target.value)} className="h-9 text-[13px]" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Contacto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nombre contacto <Req /></Label>
              <Input value={contact} onChange={e => { setContact(e.target.value); if (errors.contact) setErrors(p => ({ ...p, contact: "" })); }}
                className={`h-9 text-[13px] ${errors.contact ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.contact} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Teléfono</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-9 text-[13px]" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                className={`h-9 text-[13px] ${errors.email ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.email} />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Condiciones comerciales</h3>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Forma de pago</Label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring">
              {["Contado", "Transferencia", "Crédito 30 días", "Crédito 60 días", "Cheque"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notas internas</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
