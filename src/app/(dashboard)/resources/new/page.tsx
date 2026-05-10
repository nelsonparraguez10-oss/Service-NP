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

type ResourceType = "operator" | "vehicle" | "equipment";
const typeLabels: Record<ResourceType, string> = { operator: "Operario", vehicle: "Vehículo", equipment: "Equipo" };

export default function NewResourcePage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [type,       setType]       = useState<ResourceType>("operator");
  const [name,       setName]       = useState("");
  const [identifier, setIdentifier] = useState("");
  const [phone,      setPhone]      = useState("");
  const [email,      setEmail]      = useState("");
  const [notes,      setNotes]      = useState("");

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
        <SaveButton status={status} onClick={() => trigger(validate)} label="Crear recurso" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Nuevo recurso</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Registra un operario, vehículo o equipo</p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Tipo de recurso</Label>
          <div className="flex gap-2">
            {(["operator", "vehicle", "equipment"] as ResourceType[]).map(t => (
              <button key={t} onClick={() => { setType(t); setIdentifier(""); setErrors({}); }}
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
              placeholder={type === "operator" ? "Juan Pérez" : type === "vehicle" ? "Camión Mercedes Sprinter" : "Baño Portátil #01"}
              className={`h-9 text-[13px] ${errors.name ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.name} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {type === "operator" ? "RUT" : type === "vehicle" ? "Patente" : "Identificador"} <Req />
            </Label>
            <Input value={identifier} onChange={e => { setIdentifier(e.target.value); clearError("identifier"); }}
              placeholder={type === "operator" ? "12.345.678-9" : type === "vehicle" ? "BCRZ-14" : "EQ-001"}
              className={`h-9 text-[13px] font-mono ${errors.identifier ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.identifier} />
          </div>

          {type === "operator" && (<>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Teléfono</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+56 9 1234 5678" className="h-9 text-[13px]" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); }}
                placeholder="operario@serviciosnp.cl"
                className={`h-9 text-[13px] ${errors.email ? "border-red-400/50" : ""}`} />
              <FieldError msg={errors.email} />
            </div>
          </>)}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notas / Certificaciones</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={type === "operator" ? "Certificaciones, licencias, observaciones..." : "Características, mantenimientos, observaciones..."}
            className="text-[13px] min-h-[80px] resize-none" />
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear recurso" />
        </div>
      </div>
    </div>
  );
}
