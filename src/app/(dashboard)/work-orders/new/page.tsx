"use client";

import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
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
import { required, validDate, type FieldErrors } from "@/lib/utils/validate";
import { ContactCombobox } from "@/components/ui/contact-combobox";
import { clients } from "@/lib/data/contacts";

const operators = ["Carlos Mendoza", "Pedro Soto", "Jorge Vidal"];
const vehicles  = ["BCRZ-14", "FJKP-88"];

export default function NewWorkOrderPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [items,       setItems]       = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", unit: "UN", quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  const [client,      setClient]      = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [quoteRef,    setQuoteRef]    = useState("");
  const [operator,    setOperator]    = useState("");
  const [vehicle,     setVehicle]     = useState("");
  const [notes,       setNotes]       = useState("");

  const net = calcNetFromLines(items);

  function validate() {
    const e: FieldErrors = {};
    const clientErr = required(client);       if (clientErr)      e.client      = clientErr;
    const dateErr   = validDate(serviceDate); if (dateErr)        e.serviceDate = dateErr;
    if (!operator)  e.operator = "Selecciona un operario";
    if (!vehicle)   e.vehicle  = "Selecciona un vehículo";
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
        <ButtonLink href="/work-orders" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Órdenes de Trabajo
        </ButtonLink>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
            <Download className="h-3.5 w-3.5" />
            Exportar PDF
          </Button>
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear OT" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Nueva Orden de Trabajo</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">El número se generará al guardar</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Cliente <Req /></Label>
            <ContactCombobox
              options={clients}
              value={client}
              onChange={v => { setClient(v); clearError("client"); }}
              placeholder="Buscar cliente..."
              hasError={!!errors.client}
            />
            <FieldError msg={errors.client} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha de servicio <Req /></Label>
            <Input type="date" value={serviceDate} onChange={e => { setServiceDate(e.target.value); clearError("serviceDate"); }}
              className={`h-9 text-[13px] ${errors.serviceDate ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.serviceDate} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Cotización origen</Label>
            <Input value={quoteRef} onChange={e => setQuoteRef(e.target.value)} placeholder="COT-XXXX (opcional)" className="h-9 text-[13px] font-mono" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Asignación de recursos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Operario <Req /></Label>
              <select value={operator} onChange={e => { setOperator(e.target.value); clearError("operator"); }}
                className={`h-9 w-full rounded-md border bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.operator ? "border-red-400/50" : "border-input"}`}>
                <option value="">— Seleccionar —</option>
                {operators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
              <FieldError msg={errors.operator} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Vehículo <Req /></Label>
              <select value={vehicle} onChange={e => { setVehicle(e.target.value); clearError("vehicle"); }}
                className={`h-9 w-full rounded-md border bg-transparent px-3 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-ring ${errors.vehicle ? "border-red-400/50" : "border-input"}`}>
                <option value="">— Seleccionar —</option>
                {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <FieldError msg={errors.vehicle} />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Detalle de trabajos</h3>
          <LineItemsTable items={items} onChange={setItems} />
          <FieldError msg={errors.items} />
        </div>

        <TotalsBlock net={net} />

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Instrucciones / Notas en terreno</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Acceso a la faena, contacto en terreno, instrucciones especiales..."
            className="text-[13px] min-h-[80px] resize-none" />
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} label="Crear OT" />
        </div>
      </div>
    </div>
  );
}
