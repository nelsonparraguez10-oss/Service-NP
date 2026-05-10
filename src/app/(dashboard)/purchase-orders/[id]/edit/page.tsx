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
import { StatusBadge } from "@/components/documents/StatusBadge";
import { calcNetFromLines } from "@/lib/utils/format";
import { useSave } from "@/lib/hooks/useSave";
import { required, validDate, dateAfter, type FieldErrors } from "@/lib/utils/validate";

const mockPO = {
  number: "OC-0011", woRef: "OT-0087", supplier: "Transportes Flores",
  issueDate: "2026-04-29", deliveryDate: "2026-05-05",
  status: "pending_approval" as const,
  notes: "Coordinar entrega en bodega central. Preguntar por encargado Martínez.",
  hasAttachment: false,
  items: [
    { id: "1", description: "Flete material pesado — OT-0087",     unit: "KM",  quantity: 120, unitPrice: 850,   discount: 0 },
    { id: "2", description: "Servicio de camioneta — traslado",     unit: "DÍA", quantity: 2,   unitPrice: 95000, discount: 0 },
  ] satisfies LineItem[],
};

const suppliers = ["Transportes Flores", "Proveedor Químicos Sur", "Ferretería Industrial S.A.", "Suministros Mineros Ltda."];

export default function EditPurchaseOrderPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [items,        setItems]        = useState<LineItem[]>(mockPO.items);
  const [supplier,     setSupplier]     = useState(mockPO.supplier);
  const [issueDate,    setIssueDate]    = useState(mockPO.issueDate);
  const [deliveryDate, setDeliveryDate] = useState(mockPO.deliveryDate);
  const [notes,        setNotes]        = useState(mockPO.notes);

  const net = calcNetFromLines(items);

  function validate() {
    const e: FieldErrors = {};
    const supErr  = required(supplier);     if (supErr)  e.supplier     = supErr;
    const issErr  = validDate(issueDate);   if (issErr)  e.issueDate    = issErr;
    const delErr  = validDate(deliveryDate);if (delErr)  e.deliveryDate = delErr;
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
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{mockPO.number}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Vinculada a OT <span className="text-foreground font-medium">{mockPO.woRef}</span>
            </p>
          </div>
          <StatusBadge status={mockPO.status} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Proveedor <Req /></Label>
            <select value={supplier} onChange={e => { setSupplier(e.target.value); clearError("supplier"); }}
              className={`h-9 w-full rounded-md border bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.supplier ? "border-red-400/50" : "border-input"}`}>
              <option value="">— Seleccionar —</option>
              {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
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
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">OT vinculada</Label>
          <Input value={mockPO.woRef} readOnly className="h-9 text-[13px] max-w-xs opacity-50 cursor-not-allowed" />
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
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Adjunto (factura / guía)</Label>
            <label className="flex h-[80px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] text-[11px] text-muted-foreground hover:border-white/[0.20] hover:bg-white/[0.04] transition-all">
              <Paperclip className="h-4 w-4" />
              {mockPO.hasAttachment ? "Reemplazar archivo adjunto" : "Subir archivo adjunto"}
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
