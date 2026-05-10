import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader } from "./shared/PdfHeader";
import { PdfLineItems, type PdfLineItem } from "./shared/PdfLineItems";
import { PdfTotals } from "./shared/PdfTotals";
import { PdfFooter } from "./shared/PdfFooter";
import { shared, colors, fonts } from "./shared/styles";
import type { PdfCompanyContext } from "@/lib/services/settings.service";

interface PurchaseOrderPdfProps {
  company: PdfCompanyContext;
  po: {
    poNumber: string;
    issueDate: string;
    deliveryDate?: string;
    validityDate?: string;
    currency: string;
    requestedBy?: string;
    department?: string;
    deliveryLocation?: string;
    supplier: { name: string; rut: string; address?: string; district?: string; contact?: string };
    billing: { name: string; rut: string; address?: string };
    lines: PdfLineItem[];
    netAmount: number;
    notes?: string;
  };
}

const s = StyleSheet.create({
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  metaBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "6pt 8pt",
  },
  metaTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  field: { flexDirection: "row", marginBottom: 2.5 },
  fieldLabel: { fontSize: 7.5, color: colors.lightGray, width: 60 },
  fieldValue: { fontSize: 8, color: colors.darkGray, flex: 1 },
  fieldValueBold: { fontSize: 8, fontFamily: fonts.bold, color: colors.black, flex: 1 },
  notes: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "6pt 8pt",
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  notesText: { fontSize: 8, color: colors.darkGray, lineHeight: 1.4 },
  ackSection: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "8pt 10pt",
    marginBottom: 12,
  },
  ackTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  ackGrid: { flexDirection: "row", gap: 20 },
  ackField: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    marginBottom: 4,
  },
  ackLabel: { fontSize: 7, color: colors.lightGray, marginTop: 3 },
});

function Field({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  if (!value) return null;
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={bold ? s.fieldValueBold : s.fieldValue}>{value}</Text>
    </View>
  );
}

export function PurchaseOrderPdf({ company, po }: PurchaseOrderPdfProps) {
  return (
    <Document
      title={`Orden de Compra ${po.poNumber}`}
      author={company.legalName}
      creator="Servicios NP — Sistema de Gestión"
    >
      <Page size="A4" style={shared.page}>
        <PdfHeader company={company} docTitle="ORDEN DE COMPRA" docNumber={po.poNumber} />

        {/* Proveedor + Meta */}
        <View style={s.metaRow}>
          <View style={s.metaBox}>
            <Text style={s.metaTitle}>Proveedor</Text>
            <Field label="Razón Social" value={po.supplier.name} bold />
            <Field label="RUT" value={po.supplier.rut} />
            <Field label="Dirección" value={po.supplier.address} />
            <Field label="Contacto" value={po.supplier.contact} />
          </View>
          <View style={[s.metaBox, { flex: 0.65 }]}>
            <Text style={s.metaTitle}>Detalles OC</Text>
            <Field label="F. Emisión" value={po.issueDate} />
            <Field label="F. Entrega" value={po.deliveryDate} />
            <Field label="Validez" value={po.validityDate} />
            <Field label="Moneda" value={po.currency} />
            <Field label="Solicitado" value={po.requestedBy} />
            <Field label="Área/Proyecto" value={po.department} />
          </View>
        </View>

        {/* Datos facturación destino */}
        <View style={[s.metaBox, { marginBottom: 12 }]}>
          <Text style={s.metaTitle}>Datos de facturación</Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Field label="Facturar a" value={po.billing.name} bold />
            <Field label="RUT" value={po.billing.rut} />
            <Field label="Dirección" value={po.billing.address} />
          </View>
          {po.deliveryLocation && <Field label="Lugar entrega" value={po.deliveryLocation} />}
        </View>

        <PdfLineItems items={po.lines} />
        <PdfTotals net={po.netAmount} />

        {po.notes && (
          <View style={s.notes}>
            <Text style={s.notesTitle}>Notas</Text>
            <Text style={s.notesText}>{po.notes}</Text>
          </View>
        )}

        {/* Acuse de Recibo */}
        <View style={s.ackSection}>
          <Text style={s.ackTitle}>Acuse de Recibo — Conforme con la entrega</Text>
          <View style={s.ackGrid}>
            {["Nombre y Apellido", "RUT", "Fecha recepción", "Firma"].map((label) => (
              <View key={label} style={s.ackField}>
                <Text style={s.ackLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <PdfFooter company={company} />
      </Page>
    </Document>
  );
}
