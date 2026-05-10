import { z } from "zod";

export const bankAccountSchema = z.object({
  id: z.string().uuid().optional(), // client-side ID for list keying
  bank: z.string().min(1, "Nombre del banco requerido"),
  accountType: z.string().min(1, "Tipo de cuenta requerido"),
  // e.g. "Cuenta Vista", "Cuenta Corriente", "CuentaRUT"
  accountNumber: z.string().min(1, "Número de cuenta requerido"),
  accountHolder: z.string().min(1, "Titular requerido"),
  rut: z.string().min(1, "RUT requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  legalName: z.string().min(1, "Razón social requerida"),
  rut: z
    .string()
    .min(1, "RUT requerido")
    .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, "Formato RUT inválido (ej: 12.345.678-9)"),

  address: z.string().min(1, "Dirección requerida"),
  district: z.string().optional(),
  region: z.string().optional(),
  businessLine: z.string().optional(),

  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),

  logoUrl: z.string().optional(),
  pdfFooterNote: z.string().optional(),

  bankAccounts: z.array(bankAccountSchema).default([]),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type BankAccount = z.infer<typeof bankAccountSchema>;

// Tipo enriquecido que incluye el id de BD (para el servicio)
export type CompanySettings = SettingsInput & { id: number; updatedAt: Date };
