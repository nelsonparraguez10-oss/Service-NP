import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader } from "./shared/PdfHeader";
import { PdfClientBlock } from "./shared/PdfClientBlock";
import { PdfLineItems, type PdfLineItem } from "./shared/PdfLineItems";
import { PdfTotals } from "./shared/PdfTotals";
import { PdfFooter } from "./shared/PdfFooter";
import { shared, colors, fonts } from "./shared/styles";
import type { PdfCompanyContext } from "@/lib/services/settings.service";

interface QuotePdfProps {
  company: PdfCompanyContext;
  quote: {
    quoteNumber: string;
    issueDate: string;
    validityDate?: string;
    client: {
      name: string; rut: string; address?: string; district?: string;
      businessLine?: string; contact?: string; email?: string;
    };
    paymentMethod?: string;
    lines: PdfLineItem[];
    netAmount: number;
    discountAmount?: number;
    observations?: string;
    termsAndConditions?: string;
  };
}

const s = StyleSheet.create({
  obsSection: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  obsBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "6pt 8pt",
  },
  obsTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  obsText: {
    fontSize: 8,
    color: colors.darkGray,
    lineHeight: 1.4,
  },
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
  ackGrid: {
    flexDirection: "row",
    gap: 20,
  },
  ackField: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 4,
  },
  ackLabel: {
    fontSize: 7,
    color: colors.lightGray,
    marginTop: 3,
  },
});

export function QuotePdf({ company, quote }: QuotePdfProps) {
  return (
    <Document
      title={`Cotización ${quote.quoteNumber}`}
      author={company.legalName}
      creator="Servicios NP — Sistema de Gestión"
    >
      <Page size="A4" style={shared.page}>
        <PdfHeader
          company={company}
          docTitle="COTIZACIÓN"
          docNumber={quote.quoteNumber}
        />

        <PdfClientBlock
          client={quote.client}
          dates={{ issueDate: quote.issueDate, validityDate: quote.validityDate }}
          paymentMethod={quote.paymentMethod}
        />

        <PdfLineItems items={quote.lines} />

        <PdfTotals net={quote.netAmount} discount={quote.discountAmount} />

        {(quote.observations || quote.termsAndConditions) && (
          <View style={s.obsSection}>
            {quote.observations && (
              <View style={s.obsBox}>
                <Text style={s.obsTitle}>Observaciones</Text>
                <Text style={s.obsText}>{quote.observations}</Text>
              </View>
            )}
            {quote.termsAndConditions && (
              <View style={s.obsBox}>
                <Text style={s.obsTitle}>Términos y condiciones</Text>
                <Text style={s.obsText}>{quote.termsAndConditions}</Text>
              </View>
            )}
          </View>
        )}

        {/* Acuse de Recibo */}
        <View style={s.ackSection}>
          <Text style={s.ackTitle}>Acuse de Recibo — Conforme</Text>
          <View style={s.ackGrid}>
            {["Nombre y Apellido", "RUT", "Fecha", "Firma"].map((label) => (
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
