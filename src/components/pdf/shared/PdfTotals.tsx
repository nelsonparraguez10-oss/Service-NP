import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts } from "./styles";

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  box: {
    width: "38%",
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.black,
  },
  label: { fontSize: 8, color: colors.gray },
  value: { fontSize: 8, color: colors.darkGray, fontFamily: fonts.bold },
  totalLabel: { fontSize: 9, color: colors.white, fontFamily: fonts.bold },
  totalValue: { fontSize: 9, color: colors.white, fontFamily: fonts.bold },
  discountValue: { fontSize: 8, color: "#DC2626", fontFamily: fonts.bold },
});

function fmt(n: number): string {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(n);
}

interface Props {
  net: number;
  discount?: number;
}

export function PdfTotals({ net, discount = 0 }: Props) {
  const discountedNet = net - discount;
  const iva = Math.round(discountedNet * 0.19);
  const total = discountedNet + iva;

  return (
    <View style={s.container}>
      <View style={s.box}>
        <View style={s.row}>
          <Text style={s.label}>Neto</Text>
          <Text style={s.value}>{fmt(net)}</Text>
        </View>
        {discount > 0 && (
          <View style={s.row}>
            <Text style={s.label}>Descuento</Text>
            <Text style={s.discountValue}>- {fmt(discount)}</Text>
          </View>
        )}
        <View style={s.row}>
          <Text style={s.label}>Sub Total</Text>
          <Text style={s.value}>{fmt(discountedNet)}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>IVA 19%</Text>
          <Text style={s.value}>{fmt(iva)}</Text>
        </View>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>TOTAL</Text>
          <Text style={s.totalValue}>{fmt(total)}</Text>
        </View>
      </View>
    </View>
  );
}
