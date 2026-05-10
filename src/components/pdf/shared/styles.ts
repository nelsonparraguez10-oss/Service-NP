import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  black: "#111111",
  darkGray: "#333333",
  gray: "#666666",
  lightGray: "#999999",
  border: "#E5E5E5",
  bg: "#F8F8F8",
  white: "#FFFFFF",
  accent: "#111111",
};

export const fonts = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  mono: "Courier",
};

export const shared = StyleSheet.create({
  page: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.darkGray,
    padding: "32pt 36pt",
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 7,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    color: colors.darkGray,
  },
  boldValue: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 6,
    minHeight: 18,
  },
  tableCell: {
    fontSize: 8.5,
    color: colors.darkGray,
  },
  tableCellBold: {
    fontSize: 8.5,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
