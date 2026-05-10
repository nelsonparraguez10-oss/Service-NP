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

export default function NewContactPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [type,         setType]          = useState<ContactType>("client");
  const [name,         setName]          = useState("");
  const [rut,          setRut]           = useState("");
  const [businessLine, setBusinessLine]  = useState("");
  const [address,      setAddress]       = useState("");
  const [district,     setDistrict]      = useState("");
  const [region,       setRegion]        = useState("");
  const [contact,      setContact]       = useState("");
  const [email,        setEmail]         = useState("");
  const [phone,        setPhone]         = useState("");
  const [paymentMethod,setPaymentMethod] = useState("Transferencia");
  const [notes,        setNotes]         = useState("");

  function validate() {
    const e: FieldErrors = {};
    const nameErr    = required(name);      if (nameErr)    e.name    = nameErr;
    const rutErr     = validRut(rut);       if (rutErr)     e.rut     = rutErr;
    const contactErr = required(contact);   if (contactErr) e.contact = contactErr;
    const emailErr   = validEmail(email);   if (emailErr)   e.email   = emailErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;
  const clearError = (key: string) => setErrors(p => ({ ...p, [key]: "" }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/contacts" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Clientes y Proveedores
        </ButtonLink>
        <SaveButton status={status} onClick={() => trigger(validate)} label="Crear contacto" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Nuevo contacto</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Completa los datos del cliente o proveedor</p>
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
              <Input value={name} onChange={e => { setName(e.target.value); clearError("name"); }}
                placeholder="Empresa Ejemplo SpA"
                className={`h-9 text-[13px] ${errors.name ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.name} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">RUT <Req /></Label>
              <Input value={rut} onChange={e => { setRut(e.target.value); clearError("rut"); }}
                placeholder="76.543.210-K"
                className={`h-9 text-[13px] font-mono ${errors.rut ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.rut} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Giro / Rubro</Label>
              <Input value={businessLine} onChange={e => setBusinessLine(e.target.value)} placeholder="Construcción, minería..." className="h-9 text-[13px]" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Dirección</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, número, piso..." className="h-9 text-[13px]" />
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
              <Input value={contact} onChange={e => { setContact(e.target.value); clearError("contact"); }}
                placeholder="Juan Pérez"
                className={`h-9 text-[13px] ${errors.contact ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.contact} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Teléfono</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+56 9 1234 5678" className="h-9 text-[13px]" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); }}
                placeholder="contacto@empresa.cl"
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
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear contacto" />
        </div>
      </div>
    </div>
  );
}
