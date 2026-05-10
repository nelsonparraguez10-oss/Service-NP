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
import { StatusBadge } from "@/components/documents/StatusBadge";
import { calcNetFromLines } from "@/lib/utils/format";
import { useSave } from "@/lib/hooks/useSave";
import { required, validDate, type FieldErrors } from "@/lib/utils/validate";

const mockWO = {
  number: "OT-0087", quoteRef: "COT-0041", client: "Inmobiliaria Sur",
  requestDate: "2026-04-28", serviceDate: "2026-05-10",
  operator: "Pedro Soto", vehicle: "FJKP-88", status: "pending_approval" as const,
  notes: "Acceso por portería norte. Contacto en faena: Rodrigo Pérez +56 9 8765 4321.",
  items: [
    { id: "1", description: "Sanitización instalaciones", unit: "M²",  quantity: 150, unitPrice: 1200,  discount: 0 },
    { id: "2", description: "Traslado equipos",           unit: "UN",  quantity: 1,   unitPrice: 45000,  discount: 0 },
  ] satisfies LineItem[],
};

const operators = ["Carlos Mendoza", "Pedro Soto", "Jorge Vidal"];
const vehicles  = ["BCRZ-14", "FJKP-88"];

export default function EditWorkOrderPage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [items,       setItems]       = useState<LineItem[]>(mockWO.items);
  const [client,      setClient]      = useState(mockWO.client);
  const [serviceDate, setServiceDate] = useState(mockWO.serviceDate);
  const [operator,    setOperator]    = useState(mockWO.operator);
  const [vehicle,     setVehicle]     = useState(mockWO.vehicle);
  const [notes,       setNotes]       = useState(mockWO.notes);

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
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{mockWO.number}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Originada en <span className="text-foreground font-medium">{mockWO.quoteRef}</span>
            </p>
          </div>
          <StatusBadge status={mockWO.status} />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Cliente <Req /></Label>
            <Input value={client} onChange={e => { setClient(e.target.value); clearError("client"); }}
              className={`h-9 text-[13px] ${errors.client ? "border-red-400/50" : ""}`} />
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
            <Input value={mockWO.quoteRef} readOnly className="h-9 text-[13px] opacity-50 cursor-not-allowed" />
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
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
