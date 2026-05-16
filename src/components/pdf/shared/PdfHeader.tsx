import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { colors, fonts } from "./styles";
import type { PdfCompanyContext } from "@/lib/services/settings.service";

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 36,
    objectFit: "contain",
  },
  companyBlock: {
    marginLeft: 10,
    flex: 1,
  },
  companyName: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.black,
  },
  companyDetail: {
    fontSize: 8,
    color: colors.gray,
    marginTop: 1,
  },
  docBlock: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
    letterSpacing: 0.5,
  },
  docNumber: {
    fontSize: 9,
    color: colors.gray,
    marginTop: 2,
  },
});

interface Props {
  company: PdfCompanyContext;
  docTitle: string;
  docNumber: string;
}

export function PdfHeader({ company, docTitle, docNumber }: Props) {
  const logoUrl = typeof window !== "undefined"
    ? `${window.location.origin}/logo.png`
    : `${process.env.NEXT_PUBLIC_APP_URL ?? "https://novai-engineering.vercel.app"}/logo.png`;

  return (
    <View style={s.header}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", flex: 1 }}>
        <Image style={s.logo} src={logoUrl} />
        <View style={s.companyBlock}>
          <Text style={s.companyName}>{company.legalName}</Text>
          <Text style={s.companyDetail}>RUT {company.rut}</Text>
          {company.businessLine && (
            <Text style={s.companyDetail}>{company.businessLine}</Text>
          )}
          <Text style={s.companyDetail}>{company.address}{company.district ? `, ${company.district}` : ""}</Text>
          {company.phone && <Text style={s.companyDetail}>{company.phone} · {company.email}</Text>}
        </View>
      </View>
      <View style={s.docBlock}>
        <Text style={s.docTitle}>{docTitle}</Text>
        <Text style={s.docNumber}>N° {docNumber}</Text>
      </View>
    </View>
  );
}
