import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts, shared } from "./styles";

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  box: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    padding: "6pt 8pt",
  },
  boxTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  rowLabel: {
    fontSize: 7.5,
    color: colors.lightGray,
    width: 55,
  },
  rowValue: {
    fontSize: 8,
    color: colors.darkGray,
    flex: 1,
  },
  rowValueBold: {
    fontSize: 8,
    fontFamily: fonts.bold,
    color: colors.black,
    flex: 1,
  },
});

interface ClientData {
  name: string;
  rut: string;
  address?: string;
  district?: string;
  businessLine?: string;
  contact?: string;
  email?: string;
  phone?: string;
}

interface DateData {
  issueDate: string;
  validityDate?: string;
  serviceDate?: string;
  requestDate?: string;
}

interface Props {
  client: ClientData;
  dates: DateData;
  paymentMethod?: string;
}

function Field({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  if (!value) return null;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={bold ? s.rowValueBold : s.rowValue}>{value}</Text>
    </View>
  );
}

export function PdfClientBlock({ client, dates, paymentMethod }: Props) {
  return (
    <View style={s.container}>
      <View style={s.box}>
        <Text style={s.boxTitle}>Datos del cliente</Text>
        <Field label="Razón Social" value={client.name} bold />
        <Field label="RUT" value={client.rut} />
        <Field label="Dirección" value={client.address} />
        <Field label="Comuna" value={client.district} />
        <Field label="Giro" value={client.businessLine} />
        <Field label="Contacto" value={client.contact} />
        <Field label="Email" value={client.email} />
      </View>
      <View style={[s.box, { flex: 0.6 }]}>
        <Text style={s.boxTitle}>Condiciones</Text>
        <Field label="F. Emisión" value={dates.issueDate} />
        {dates.validityDate && <Field label="Validez" value={dates.validityDate} />}
        {dates.serviceDate && <Field label="F. Servicio" value={dates.serviceDate} />}
        {dates.requestDate && <Field label="F. Solicitud" value={dates.requestDate} />}
        {paymentMethod && <Field label="Forma pago" value={paymentMethod} />}
      </View>
    </View>
  );
}
