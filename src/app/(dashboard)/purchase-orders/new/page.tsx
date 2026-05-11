"use client";

import { useState } from "react";
import { ArrowLeft, Download, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { SaveButton } from "@/components/ui/save-button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { LineItemsTable, type LineItem } from "@/components/documents/LineItemsTable";
import { TotalsBlock } from "@/components/documents/TotalsBlock";
import { calcNetFromLines } from "@/lib/utils/format";
import { useSave } from "@/lib/hooks/useSave";
import { required, validDate, dateAfter, type FieldErrors } from "@/lib/utils/validate";
import { ContactCombobox } from "@/components/ui/contact-combobox";
import { suppliers } from "@/lib/data/contacts";

export default function NewPurchaseOrderPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [items,        setItems]        = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", unit: "UN", quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  const [supplier,     setSupplier]     = useState("");
  const [woRef,        setWoRef]        = useState("");
  const [issueDate,    setIssueDate]    = useState(new Date().toISOString().slice(0, 10));
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes,        setNotes]        = useState("");

  const net = calcNetFromLines(items);

  function validate() {
    const e: FieldErrors = {};
    const supErr   = required(supplier);      if (supErr)   e.supplier     = supErr;
    const issErr   = validDate(issueDate);    if (issErr)   e.issueDate    = issErr;
    const delErr   = validDate(deliveryDate); if (delErr)   e.deliveryDate = delErr;
    const afterErr = dateAfter(issueDate, deliveryDate); if (afterErr) e.deliveryDate = afterErr;
    if (items.length === 0) e.items = "Agrega al menos un ítem";
    const emptyItem = items.find(i => !i.description.trim());
    if (emptyItem) e.items = "Todos los ítems deben tener descripción";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const Req = () => <span className="text-red-400 ml-0.5">*</span>;
  const clearError = (key: string) => setErrors(p => ({ ...p, [key]: "" }));

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <ButtonLink href="/purchase-orders" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Órdenes de Compra
        </ButtonLink>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Download className="h-3.5 w-3.5" />
            Exportar PDF
          </Button>
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear OC" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Nueva Orden de Compra</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">El número se generará al guardar</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Proveedor <Req /></Label>
            <ContactCombobox
              options={suppliers}
              value={supplier}
              onChange={v => { setSupplier(v); clearError("supplier"); }}
              placeholder="Buscar proveedor..."
              hasError={!!errors.supplier}
            />
            <FieldError msg={errors.supplier} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha emisión <Req /></Label>
            <Input type="date" value={issueDate} onChange={e => { setIssueDate(e.target.value); clearError("issueDate"); }}
              className={`h-9 text-[13px] ${errors.issueDate ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.issueDate} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha entrega <Req /></Label>
            <Input type="date" value={deliveryDate} onChange={e => { setDeliveryDate(e.target.value); clearError("deliveryDate"); }}
              className={`h-9 text-[13px] ${errors.deliveryDate ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.deliveryDate} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">OT vinculada (opcional)</Label>
          <Input value={woRef} onChange={e => setWoRef(e.target.value)} placeholder="OT-XXXX" className="h-9 text-[13px] max-w-xs font-mono" />
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Ítems a comprar</h3>
          <LineItemsTable items={items} onChange={setItems} />
          <FieldError msg={errors.items} />
        </div>

        <TotalsBlock net={net} />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notas al proveedor</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Instrucciones de entrega, embalaje, contacto..."
              className="text-[13px] min-h-[80px] resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Adjunto (opcional)</Label>
            <label className="flex h-[80px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] text-[11px] text-muted-foreground hover:border-white/[0.20] hover:bg-white/[0.04] transition-all">
              <Paperclip className="h-4 w-4" />
              Subir archivo adjunto
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear OC" />
        </div>
      </div>
    </div>
  );
}
