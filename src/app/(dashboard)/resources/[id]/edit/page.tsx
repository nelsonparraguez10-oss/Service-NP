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

type ResourceType   = "operator" | "vehicle" | "equipment";
type ResourceStatus = "available" | "busy";

const mockResource = {
  id: 2, type: "operator" as ResourceType, name: "Pedro Soto",
  identifier: "15.432.987-K", status: "busy" as ResourceStatus,
  currentWO: "OT-0087", phone: "+56 9 6543 2109",
  email: "psoto@serviciosnp.cl",
  notes: "Certificado en trabajos en altura. Licencia clase B.",
};

const typeLabels: Record<ResourceType, string> = { operator: "Operario", vehicle: "Vehículo", equipment: "Equipo" };

export default function EditResourcePage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [type,       setType]       = useState<ResourceType>(mockResource.type);
  const [name,       setName]       = useState(mockResource.name);
  const [identifier, setIdentifier] = useState(mockResource.identifier);
  const [resStatus,  setResStatus]  = useState<ResourceStatus>(mockResource.status);
  const [phone,      setPhone]      = useState(mockResource.phone);
  const [email,      setEmail]      = useState(mockResource.email);
  const [notes,      setNotes]      = useState(mockResource.notes);

  function validate() {
    const e: FieldErrors = {};
    const nameErr = required(name); if (nameErr) e.name = nameErr;
    const idErr   = type === "operator" ? validRut(identifier) : required(identifier);
    if (idErr) e.identifier = idErr;
    if (type === "operator") {
      const emailErr = validEmail(email); if (emailErr) e.email = emailErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;
  const clearError = (key: string) => setErrors(p => ({ ...p, [key]: "" }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/resources" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Recursos
        </ButtonLink>
        <SaveButton status={status} onClick={() => trigger(validate)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">{mockResource.name}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5 font-mono">{mockResource.identifier}</p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Tipo de recurso</Label>
          <div className="flex gap-2">
            {(["operator", "vehicle", "equipment"] as ResourceType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`rounded-xl border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  type === t ? "border-white/[0.20] bg-white/[0.10] text-foreground"
                             : "border-white/[0.07] bg-transparent text-muted-foreground hover:bg-white/[0.05]"}`}>
                {typeLabels[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {type === "operator" ? "Nombre completo" : type === "vehicle" ? "Descripción del vehículo" : "Nombre del equipo"} <Req />
            </Label>
            <Input value={name} onChange={e => { setName(e.target.value); clearError("name"); }}
              className={`h-9 text-[13px] ${errors.name ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.name} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {type === "operator" ? "RUT" : type === "vehicle" ? "Patente" : "Identificador"} <Req />
            </Label>
            <Input value={identifier} onChange={e => { setIdentifier(e.target.value); clearError("identifier"); }}
              className={`h-9 text-[13px] font-mono ${errors.identifier ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.identifier} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Estado</Label>
            <select value={resStatus} onChange={e => setResStatus(e.target.value as ResourceStatus)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring">
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
            </select>
          </div>

          {type === "operator" && (<>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Teléfono</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-9 text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); }}
                className={`h-9 text-[13px] ${errors.email ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.email} />
            </div>
          </>)}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notas / Certificaciones</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
        </div>

        {mockResource.currentWO && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-[12px]">
            <p className="text-amber-400 font-medium">Recurso actualmente asignado</p>
            <p className="text-muted-foreground mt-0.5">
              OT en curso: <span className="text-foreground font-medium">{mockResource.currentWO}</span> — el estado se actualizará al completar la OT.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
