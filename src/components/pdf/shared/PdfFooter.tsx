import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts } from "./styles";
import type { PdfCompanyContext } from "@/lib/services/settings.service";

const s = StyleSheet.create({
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  bankTitle: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  bankGrid: {
    flexDirection: "row",
    gap: 10,
  },
  bankItem: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 3,
    padding: "4pt 6pt",
  },
  bankName: {
    fontSize: 7.5,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 2,
  },
  bankDetail: {
    fontSize: 7,
    color: colors.gray,
    marginBottom: 1,
  },
  note: {
    fontSize: 7,
    color: colors.lightGray,
    textAlign: "center",
    marginTop: 8,
  },
  pageNumber: {
    fontSize: 7,
    color: colors.lightGray,
    textAlign: "right",
    marginTop: 4,
  },
});

export function PdfFooter({ company }: { company: PdfCompanyContext }) {
  return (
    <View style={s.footer} fixed>
      {company.bankAccounts.length > 0 && (
        <>
          <Text style={s.bankTitle}>Datos de pago</Text>
          <View style={s.bankGrid}>
            {company.bankAccounts.map((acc, i) => (
              <View key={i} style={s.bankItem}>
                <Text style={s.bankName}>{acc.bank} · {acc.accountType}</Text>
                <Text style={s.bankDetail}>N° {acc.accountNumber}</Text>
                <Text style={s.bankDetail}>{acc.accountHolder} · RUT {acc.rut}</Text>
                {acc.email && <Text style={s.bankDetail}>{acc.email}</Text>}
              </View>
            ))}
          </View>
        </>
      )}
      {company.pdfFooterNote && (
        <Text style={s.note}>{company.pdfFooterNote}</Text>
      )}
    </View>
  );
}
