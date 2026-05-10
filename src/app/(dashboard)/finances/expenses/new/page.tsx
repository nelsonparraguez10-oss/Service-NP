"use client";

import { useState } from "react";
import { ArrowLeft, Paperclip } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SaveButton } from "@/components/ui/save-button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSave } from "@/lib/hooks/useSave";
import { required, validAmount, validDate, type FieldErrors } from "@/lib/utils/validate";

type ExpenseType     = "fixed" | "variable";
type ExpenseCategory = "rent" | "salaries" | "utilities" | "materials" | "subcontracts" | "transport" | "tools" | "other";

const categoryOptions: { value: ExpenseCategory; label: string; type: ExpenseType }[] = [
  { value: "rent",         label: "Arriendo",         type: "fixed"    },
  { value: "salaries",     label: "Sueldos",           type: "fixed"    },
  { value: "utilities",    label: "Servicios básicos", type: "fixed"    },
  { value: "materials",    label: "Materiales",        type: "variable" },
  { value: "subcontracts", label: "Subcontratos",      type: "variable" },
  { value: "transport",    label: "Traslados",         type: "variable" },
  { value: "tools",        label: "Herramientas",      type: "variable" },
  { value: "other",        label: "Otros",             type: "variable" },
];

export default function NewExpensePage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [type,        setType]        = useState<ExpenseType>("variable");
  const [category,    setCategory]    = useState<ExpenseCategory>("materials");
  const [date,        setDate]        = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount,      setAmount]      = useState("");
  const [supplier,    setSupplier]    = useState("");
  const [otId,        setOtId]        = useState("");
  const [notes,       setNotes]       = useState("");
  const [isPaid,      setIsPaid]      = useState(false);

  const filteredCategories = categoryOptions.filter(c => c.type === type);

  function validate() {
    const e: FieldErrors = {};
    const dateErr   = validDate(date);       if (dateErr)   e.date        = dateErr;
    const descErr   = required(description); if (descErr)   e.description = descErr;
    const amountErr = validAmount(amount, 1);if (amountErr) e.amount      = amountErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;
  const clearError = (key: string) => setErrors(p => ({ ...p, [key]: "" }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/finances/expenses" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Control de Gastos
        </ButtonLink>
        <SaveButton status={status} onClick={() => trigger(validate)} label="Registrar gasto" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Nuevo gasto</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">El ID se generará al guardar</p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Tipo de gasto</Label>
          <div className="flex gap-2">
            {(["fixed", "variable"] as ExpenseType[]).map(t => (
              <button key={t} onClick={() => { setType(t); setCategory(categoryOptions.find(c => c.type === t)?.value ?? "other"); }}
                className={`rounded-xl border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  type === t
                    ? t === "fixed" ? "border-violet-400/30 bg-violet-400/10 text-violet-400"
                                    : "border-orange-400/30 bg-orange-400/10 text-orange-400"
                    : "border-white/[0.07] bg-transparent text-muted-foreground hover:bg-white/[0.05]"}`}>
                {t === "fixed" ? "Fijo" : "Variable"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Categoría</Label>
            <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring">
              {filteredCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha <Req /></Label>
            <Input type="date" value={date} onChange={e => { setDate(e.target.value); clearError("date"); }}
              className={`h-9 text-[13px] ${errors.date ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.date} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Descripción <Req /></Label>
            <Input value={description} onChange={e => { setDescription(e.target.value); clearError("description"); }}
              placeholder="Detalle del gasto..." className={`h-9 text-[13px] ${errors.description ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.description} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Monto (CLP) <Req /></Label>
            <Input type="number" value={amount} onChange={e => { setAmount(e.target.value); clearError("amount"); }}
              placeholder="0" min={0} className={`h-9 text-[13px] ${errors.amount ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.amount} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Proveedor</Label>
            <Input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nombre del proveedor" className="h-9 text-[13px]" />
          </div>
          {type === "variable" && (
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">OT asociada (opcional)</Label>
              <Input value={otId} onChange={e => setOtId(e.target.value)} placeholder="OT-2026-XXX" className="h-9 text-[13px] font-mono" />
            </div>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notas</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Observaciones, detalle de la compra..." className="text-[13px] min-h-[80px] resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Respaldo documental</Label>
            <label className="flex h-[80px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] text-[11px] text-muted-foreground hover:border-white/[0.20] hover:bg-white/[0.04] transition-all">
              <Paperclip className="h-4 w-4" />
              Subir factura / boleta
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
            </label>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)}
            className="h-4 w-4 rounded border-white/[0.20] accent-emerald-500" />
          <span className="text-[13px] text-foreground">Marcar como pagado</span>
        </label>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} label="Registrar gasto" />
        </div>
      </div>
    </div>
  );
}
