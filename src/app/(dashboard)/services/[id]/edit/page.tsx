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
import { required, validAmount, type FieldErrors } from "@/lib/utils/validate";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

const categories = ["Sanitización y Aseo Industrial", "Baños Portátiles", "Mantención Industrial", "Transporte y Logística"];
const units = ["UN", "M²", "ML", "HR", "DÍA", "KM", "KG", "GL"];

const mockService = {
  id: 2, code: "SAN-002", name: "Aseo de faena diario",
  category: "Sanitización y Aseo Industrial",
  description: "Servicio de aseo continuo en faenas mineras",
  unit: "DÍA", defaultUnitPrice: 180000, taxable: true, isActive: true,
};

export default function EditServicePage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [code,        setCode]        = useState(mockService.code);
  const [name,        setName]        = useState(mockService.name);
  const [category,    setCategory]    = useState(mockService.category);
  const [description, setDescription] = useState(mockService.description);
  const [unit,        setUnit]        = useState(mockService.unit);
  const [price,       setPrice]       = useState(String(mockService.defaultUnitPrice));
  const [taxable,     setTaxable]     = useState(mockService.taxable);
  const [isActive,    setIsActive]    = useState(mockService.isActive);

  function validate() {
    const e: FieldErrors = {};
    const codeErr  = required(code);  if (codeErr)  e.code  = codeErr;
    const nameErr  = required(name);  if (nameErr)  e.name  = nameErr;
    const priceErr = validAmount(price, 0); if (priceErr) e.price = priceErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;

  const clearError = (key: string) => setErrors(p => ({ ...p, [key]: "" }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/services" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Catálogo de Servicios
        </ButtonLink>
        <SaveButton status={status} onClick={() => trigger(validate)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">{mockService.code}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Editando servicio</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Código <Req /></Label>
            <Input value={code} onChange={e => { setCode(e.target.value); clearError("code"); }}
              className={`h-9 text-[13px] font-mono ${errors.code ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.code} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Categoría</Label>
            <Select value={category} onValueChange={v => setCategory(v ?? "")}>
              <SelectTrigger className="h-9 w-full text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectGroup></SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Nombre del servicio <Req /></Label>
            <Input value={name} onChange={e => { setName(e.target.value); clearError("name"); }}
              className={`h-9 text-[13px] ${errors.name ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.name} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Descripción</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="text-[13px] min-h-[72px] resize-none" />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Unidad</Label>
            <Select value={unit} onValueChange={v => setUnit(v ?? "UN")}>
              <SelectTrigger className="h-9 w-full text-[13px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectGroup>
                {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectGroup></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Precio unitario (CLP) <Req /></Label>
            <Input type="number" value={price} onChange={e => { setPrice(e.target.value); clearError("price"); }} min={0}
              className={`h-9 text-[13px] ${errors.price ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.price} />
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={taxable} onChange={e => setTaxable(e.target.checked)}
              className="h-4 w-4 rounded border-white/[0.20] accent-blue-500" />
            <span className="text-[13px] text-foreground">Afecto a IVA (19%)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-white/[0.20] accent-emerald-500" />
            <span className="text-[13px] text-foreground">Servicio activo</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
