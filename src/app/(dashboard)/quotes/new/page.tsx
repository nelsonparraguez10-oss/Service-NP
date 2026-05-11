"use client";

import { useState } from "react";
import { ArrowLeft, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LineItemsTable, type LineItem } from "@/components/documents/LineItemsTable";
import { TotalsBlock } from "@/components/documents/TotalsBlock";
import { calcNetFromLines } from "@/lib/utils/format";
import { Separator } from "@/components/ui/separator";
import { ContactCombobox } from "@/components/ui/contact-combobox";
import { clients } from "@/lib/data/contacts";
import { QuotePdf } from "@/components/pdf/QuotePdf";
import { downloadAsPdf } from "@/lib/pdf/download";
import { mockCompany } from "@/lib/pdf/mockCompany";

export default function NewQuotePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [client, setClient] = useState("");
  const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [validity, setValidity] = useState("");
  const [notes,    setNotes]    = useState("");
  const [terms,    setTerms]    = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", unit: "UN", quantity: 1, unitPrice: 0, discount: 0 },
  ]);

  const net = calcNetFromLines(items);

  async function handlePdf() {
    setIsGenerating(true);
    try {
      await downloadAsPdf(
        <QuotePdf
          company={mockCompany}
          quote={{
            quoteNumber: "BORRADOR",
            issueDate: date,
            validityDate: validity || undefined,
            client: { name: client || "—", rut: "" },
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
        "COT-BORRADOR.pdf"
      );
    } finally {
      setIsGenerating(false);
    }
  }

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
          <Button size="sm" className="h-8 gap-1.5 text-[12px]">
            <Send className="h-3.5 w-3.5" />
            Enviar a aprobación
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Nueva Cotización</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">Borrador — se generará N° al guardar</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Fecha emisión</p>
            <p className="text-[13px] font-medium mt-0.5">
              {new Date().toLocaleDateString("es-CL")}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Cliente</Label>
            <ContactCombobox
              options={clients}
              value={client}
              onChange={setClient}
              placeholder="Buscar cliente..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Fecha emisión</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 text-[13px]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Válido hasta</Label>
            <Input type="date" value={validity} onChange={e => setValidity(e.target.value)} className="h-9 text-[13px]" />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Detalle de servicios
          </h3>
          <LineItemsTable items={items} onChange={setItems} />
        </div>

        <TotalsBlock net={net} />

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Observaciones</Label>
            <Textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Tareas de mantención, condiciones especiales..."
              className="text-[13px] min-h-[80px] resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Términos y condiciones</Label>
            <Textarea
              value={terms} onChange={e => setTerms(e.target.value)}
              placeholder="Forma de pago, condiciones de servicio..."
              className="text-[13px] min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button size="sm" className="h-8 text-[12px] px-5">
            Guardar borrador
          </Button>
        </div>
      </div>
    </div>
  );
}
