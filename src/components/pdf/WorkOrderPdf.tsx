import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PdfHeader } from "./shared/PdfHeader";
import { PdfClientBlock } from "./shared/PdfClientBlock";
import { PdfLineItems, type PdfLineItem } from "./shared/PdfLineItems";
import { PdfTotals } from "./shared/PdfTotals";
import { PdfFooter } from "./shared/PdfFooter";
import { shared, colors, fonts } from "./shared/styles";
import type { PdfCompanyContext } from "@/lib/services/settings.service";

interface WorkOrderPdfProps {
  company: PdfCompanyContext;
  wo: {
    woNumber: string;
    quoteRef?: string;
    requestDate: string;
    serviceDate: string;
    client: {
      name: string; rut: string; address?: string; district?: string;
      businessLine?: string; contact?: string;
    };
    resources: { operators: string[]; vehicles: string[]; equipment: string[] };
    lines: PdfLineItem[];
    netAmount: number;
    discountAmount?: number;
    salesObservations?: string;
    financeObservations?: string;
    accountingObservations?: string;
    ack?: { name?: string; rut?: string; date?: string; location?: string };
  };
}

const s = StyleSheet.create({
  resourcesSection: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "6pt 8pt",
  },
  resourceGroup: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  resourceItem: {
    fontSize: 8,
    color: colors.darkGray,
    marginBottom: 1.5,
  },
  obsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  obsBox: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "5pt 7pt",
  },
  obsTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  obsText: { fontSize: 8, color: colors.darkGray, lineHeight: 1.4 },
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
  ackGrid: { flexDirection: "row", gap: 14 },
  ackField: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    marginBottom: 4,
  },
  ackPreFill: { fontSize: 8.5, color: colors.darkGray, fontFamily: fonts.bold },
  ackLabel: { fontSize: 7, color: colors.lightGray, marginTop: 3 },
  quoteRef: {
    fontSize: 7.5,
    color: colors.gray,
    marginBottom: 12,
  },
});

export function WorkOrderPdf({ company, wo }: WorkOrderPdfProps) {
  return (
    <Document
      title={`Orden de Trabajo ${wo.woNumber}`}
      author={company.legalName}
      creator="Servicios NP — Sistema de Gestión"
    >
      <Page size="A4" style={shared.page}>
        <PdfHeader company={company} docTitle="ORDEN DE TRABAJO" docNumber={wo.woNumber} />

        {wo.quoteRef && (
          <Text style={s.quoteRef}>Originada desde cotización: {wo.quoteRef}</Text>
        )}

        <PdfClientBlock
          client={wo.client}
          dates={{ requestDate: wo.requestDate, serviceDate: wo.serviceDate, issueDate: wo.requestDate }}
        />

        {/* Recursos asignados */}
        <View style={s.resourcesSection}>
          <View style={s.resourceGroup}>
            <Text style={s.resourceTitle}>Operarios</Text>
            {wo.resources.operators.map((op, i) => (
              <Text key={i} style={s.resourceItem}>· {op}</Text>
            ))}
          </View>
          <View style={s.resourceGroup}>
            <Text style={s.resourceTitle}>Vehículos</Text>
            {wo.resources.vehicles.map((v, i) => (
              <Text key={i} style={s.resourceItem}>· {v}</Text>
            ))}
          </View>
          <View style={s.resourceGroup}>
            <Text style={s.resourceTitle}>Equipos</Text>
            {wo.resources.equipment.map((eq, i) => (
              <Text key={i} style={s.resourceItem}>· {eq}</Text>
            ))}
          </View>
        </View>

        <PdfLineItems items={wo.lines} />
        <PdfTotals net={wo.netAmount} discount={wo.discountAmount} />

        {/* Observaciones segmentadas */}
        <View style={s.obsRow}>
          {wo.salesObservations && (
            <View style={s.obsBox}>
              <Text style={s.obsTitle}>Ventas</Text>
              <Text style={s.obsText}>{wo.salesObservations}</Text>
            </View>
          )}
          {wo.financeObservations && (
            <View style={s.obsBox}>
              <Text style={s.obsTitle}>Finanzas</Text>
              <Text style={s.obsText}>{wo.financeObservations}</Text>
            </View>
          )}
          {wo.accountingObservations && (
            <View style={s.obsBox}>
              <Text style={s.obsTitle}>Contabilidad</Text>
              <Text style={s.obsText}>{wo.accountingObservations}</Text>
            </View>
          )}
        </View>

        {/* Acuse de Recibo */}
        <View style={s.ackSection}>
          <Text style={s.ackTitle}>Acuse de Recibo — Conforme con el servicio</Text>
          <View style={s.ackGrid}>
            {[
              { label: "Nombre y Apellido", value: wo.ack?.name },
              { label: "RUT", value: wo.ack?.rut },
              { label: "Recinto", value: wo.ack?.location },
              { label: "Fecha", value: wo.ack?.date },
              { label: "Firma", value: undefined },
            ].map(({ label, value }) => (
              <View key={label} style={s.ackField}>
                {value && <Text style={s.ackPreFill}>{value}</Text>}
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
