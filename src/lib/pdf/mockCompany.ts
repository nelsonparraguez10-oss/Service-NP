import type { PdfCompanyContext } from "@/lib/services/settings.service";

export const mockCompany: PdfCompanyContext = {
  legalName: "Servicios NP SpA",
  rut: "76.789.012-3",
  address: "Av. El Bosque Norte 500, Oficina 801",
  district: "Las Condes",
  region: "Región Metropolitana",
  businessLine: "Servicios Industriales y Sanitización",
  email: "contacto@serviciosnp.cl",
  phone: "+56 2 2345 6789",
  bankAccounts: [
    {
      bank: "Banco de Chile",
      accountType: "Cuenta Corriente",
      accountNumber: "00-123-45678-90",
      accountHolder: "Servicios NP SpA",
      rut: "76.789.012-3",
      email: "pagos@serviciosnp.cl",
    },
  ],
};
