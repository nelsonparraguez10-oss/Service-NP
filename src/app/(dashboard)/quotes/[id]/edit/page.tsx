"use client";

import { useState } from "react";
import { ArrowLeft, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { SaveButton } from "@/components/ui/save-button";
import { QuotePdf } from "@/components/pdf/QuotePdf";
import { downloadAsPdf } from "@/lib/pdf/download";
import { mockCompany } from "@/lib/pdf/mockCompany";
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

const mockQuote = {
  number: "COT-0044", client: "Inmobiliaria Sur", date: "2026-05-05", validity: "2026-05-19",
  status: "pending_approval" as const, notes: "Incluir acceso a pisos superiores sin ascensor.",
  terms: "Pago a 30 días. Factura electrónica.",
  items: [
    { id: "1", description: "Sanitización instalaciones", unit: "M²",  quantity: 200, unitPrice: 1200,  discount: 0 },
    { id: "2", description: "Aseo de faena diario",       unit: "DÍA", quantity: 3,   unitPrice: 180000, discount: 5 },
  ] satisfies LineItem[],
};

export default function EditQuotePage() {
  const { status, trigger } = useSave();
  const [errors, setErrors] = useState<FieldErrors>({});

  const [items,    setItems]    = useState<LineItem[]>(mockQuote.items);
  const [client,   setClient]   = useState(mockQuote.client);
  const [date,     setDate]     = useState(mockQuote.date);
  const [validity, setValidity] = useState(mockQuote.validity);
  const [notes,    setNotes]    = useState(mockQuote.notes);
  const [terms,    setTerms]    = useState(mockQuote.terms);

  const net = calcNetFromLines(items);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handlePdf() {
    setIsGenerating(true);
    try {
      await downloadAsPdf(
        <QuotePdf
          company={mockCompany}
          quote={{
            quoteNumber: mockQuote.number,
            issueDate: date,
            validityDate: validity,
            client: { name: client, rut: "" },
            lines: items.map((item, i) => ({
              position: i + 1,
              description: item.description,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              lineTotal: item.quantity * item.unitPrice * (1 - item.discount / 100),
            })),
            netAmount: net,
            observations: notes || undefined,
            termsAndConditions: terms || undefined,
          }}
        />,
        `${mockQuote.number}.pdf`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function validate() {
    const e: FieldErrors = {};
    const clientErr   = required(client);              if (clientErr)   e.client   = clientErr;
    const dateErr     = validDate(date);               if (dateErr)     e.date     = dateErr;
    const validityErr = validDate(validity);           if (validityErr) e.validity = validityErr;
    const afterErr    = dateAfter(date, validity);     if (afterErr)    e.validity = afterErr;
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
        <ButtonLink href="/quotes" variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Cotizaciones
        </ButtonLink>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]"
            onClick={handlePdf} disabled={isGenerating}
          >
            <Download className="h-3.5 w-3.5" />
            {isGenerating ? "Generando..." : "Exportar PDF"}
          </Button>
          <SaveButton status={status} onClick={() => trigger(validate)} />
          <Button size="sm" className="h-8 gap-1.5 text-[12px]">
            <Send className="h-3.5 w-3.5" />
            Enviar a aprobación
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{mockQuote.number}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Editando cotización</p>
          </div>
          <StatusBadge status={mockQuote.status} />
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
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha emisión <Req /></Label>
            <Input type="date" value={date} onChange={e => { setDate(e.target.value); clearError("date"); }}
              className={`h-9 text-[13px] ${errors.date ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.date} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Válido hasta <Req /></Label>
            <Input type="date" value={validity} onChange={e => { setValidity(e.target.value); clearError("validity"); }}
              className={`h-9 text-[13px] ${errors.validity ? "border-red-400/50" : ""}`} />
            <FieldError msg={errors.validity} />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Detalle de servicios</h3>
          <LineItemsTable items={items} onChange={setItems} />
          <FieldError msg={errors.items} />
        </div>

        <TotalsBlock net={net} />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Observaciones</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Términos y condiciones</Label>
            <Textarea value={terms} onChange={e => setTerms(e.target.value)} className="text-[13px] min-h-[80px] resize-none" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveButton status={status} onClick={() => trigger(validate)} />
        </div>
      </div>
    </div>
  );
}
