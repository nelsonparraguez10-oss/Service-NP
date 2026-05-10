import { View, Text } from "@react-pdf/renderer";
import { shared, colors } from "./styles";

export interface PdfLineItem {
  position?: number;
  description: string;
  unit: string;
  quantity: string | number;
  unitPrice: string | number;
  discount?: string | number;
  lineTotal: string | number;
}

function fmt(n: string | number): string {
  const num = typeof n === "string" ? parseFloat(n) : n;
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(num);
}

function fmtQty(n: string | number): string {
  return parseFloat(String(n)).toLocaleString("es-CL", { maximumFractionDigits: 2 });
}

const cols = {
  pos:   { width: "5%",  align: "center" as const },
  desc:  { width: "42%", align: "left"   as const },
  unit:  { width: "8%",  align: "center" as const },
  qty:   { width: "9%",  align: "center" as const },
  price: { width: "16%", align: "right"  as const },
  disc:  { width: "6%",  align: "center" as const },
  total: { width: "14%", align: "right"  as const },
};

export function PdfLineItems({ items }: { items: PdfLineItem[] }) {
  return (
    <View style={{ marginBottom: 8 }}>
      {/* Header */}
      <View style={shared.tableHeader}>
        <Text style={[shared.tableHeaderCell, { width: cols.pos.width, textAlign: cols.pos.align }]}>#</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.desc.width }]}>Descripción</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.unit.width, textAlign: cols.unit.align }]}>Un.</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.qty.width, textAlign: cols.qty.align }]}>Cant.</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.price.width, textAlign: cols.price.align }]}>P. Unit.</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.disc.width, textAlign: cols.disc.align }]}>Desc.</Text>
        <Text style={[shared.tableHeaderCell, { width: cols.total.width, textAlign: cols.total.align }]}>Total</Text>
      </View>

      {/* Rows */}
      {items.map((item, i) => (
        <View key={i} style={[shared.tableRow, i % 2 === 0 ? {} : { backgroundColor: "#FAFAFA" }]}>
          <Text style={[shared.tableCell, { width: cols.pos.width, textAlign: cols.pos.align, color: colors.lightGray }]}>
            {item.position ?? i + 1}
          </Text>
          <Text style={[shared.tableCell, { width: cols.desc.width }]}>{item.description}</Text>
          <Text style={[shared.tableCell, { width: cols.unit.width, textAlign: cols.unit.align }]}>{item.unit}</Text>
          <Text style={[shared.tableCell, { width: cols.qty.width, textAlign: cols.qty.align }]}>{fmtQty(item.quantity)}</Text>
          <Text style={[shared.tableCell, { width: cols.price.width, textAlign: cols.price.align }]}>{fmt(item.unitPrice)}</Text>
          <Text style={[shared.tableCell, { width: cols.disc.width, textAlign: cols.disc.align, color: colors.lightGray }]}>
            {item.discount ? `${item.discount}%` : "—"}
          </Text>
          <Text style={[shared.tableCellBold, { width: cols.total.width, textAlign: cols.total.align }]}>{fmt(item.lineTotal)}</Text>
        </View>
      ))}
    </View>
  );
}
