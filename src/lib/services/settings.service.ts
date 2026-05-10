/**
 * Settings Service
 *
 * Single source of truth for company configuration.
 * All PDF generation modules consume data exclusively through this service
 * to guarantee consistency across all document types.
 *
 * Pattern: Singleton row — the `company_settings` table always has exactly
 * one row (id = 1). On first boot, the seed creates it with placeholder data.
 */

import { db } from "@/lib/db";
import { companySettings } from "@/lib/db/schema";
import { settingsSchema, type CompanySettings, type SettingsInput } from "@/lib/validations/settings.schema";
import { eq } from "drizzle-orm";

const SETTINGS_ROW_ID = 1;

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------

/**
 * Returns current company settings.
 * Throws if the settings row hasn't been seeded yet — callers should handle
 * this only during initial setup; all other flows assume it exists.
 */
export async function getSettings(): Promise<CompanySettings> {
  const row = await db
    .select()
    .from(companySettings)
    .where(eq(companySettings.id, SETTINGS_ROW_ID))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    throw new Error(
      "Company settings not found. Run the database seed to create the initial row."
    );
  }

  return {
    id: row.id,
    legalName: row.legalName,
    rut: row.rut,
    address: row.address,
    district: row.district ?? undefined,
    region: row.region ?? undefined,
    businessLine: row.businessLine ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    logoUrl: row.logoUrl ?? undefined,
    pdfFooterNote: row.pdfFooterNote ?? undefined,
    bankAccounts: (row.bankAccounts as CompanySettings["bankAccounts"]) ?? [],
    updatedAt: row.updatedAt ?? new Date(),
  };
}

// ---------------------------------------------------------------------------
// WRITE
// ---------------------------------------------------------------------------

/**
 * Persists company settings. Validates input via Zod before writing.
 * Uses upsert semantics: creates row with id=1 on first save, updates thereafter.
 */
export async function saveSettings(input: SettingsInput): Promise<CompanySettings> {
  // Validate — will throw ZodError with structured messages on invalid data
  const validated = settingsSchema.parse(input);

  const payload = {
    legalName: validated.legalName,
    rut: validated.rut,
    address: validated.address,
    district: validated.district ?? null,
    region: validated.region ?? null,
    businessLine: validated.businessLine ?? null,
    email: validated.email || null,
    phone: validated.phone ?? null,
    website: validated.website || null,
    logoUrl: validated.logoUrl ?? null,
    pdfFooterNote: validated.pdfFooterNote ?? null,
    bankAccounts: validated.bankAccounts,
    updatedAt: new Date(),
  };

  await db
    .insert(companySettings)
    .values({ id: SETTINGS_ROW_ID, ...payload })
    .onConflictDoUpdate({
      target: companySettings.id,
      set: payload,
    });

  return getSettings();
}

// ---------------------------------------------------------------------------
// PDF INJECTION — convenience type consumed by all PDF templates
// ---------------------------------------------------------------------------

/**
 * Subset of company settings used by PDF header/footer components.
 * Keeping a narrow type prevents PDF templates from depending on
 * fields that don't belong in documents.
 */
export type PdfCompanyContext = {
  legalName: string;
  rut: string;
  address: string;
  district?: string;
  region?: string;
  businessLine?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  pdfFooterNote?: string;
  bankAccounts: CompanySettings["bankAccounts"];
};

/**
 * Returns only the fields needed to render PDF headers and footers.
 * Called by pdf.service.ts before rendering any document template.
 */
export async function getPdfContext(): Promise<PdfCompanyContext> {
  const s = await getSettings();
  return {
    legalName: s.legalName,
    rut: s.rut,
    address: s.address,
    district: s.district,
    region: s.region,
    businessLine: s.businessLine,
    email: s.email,
    phone: s.phone,
    logoUrl: s.logoUrl,
    pdfFooterNote: s.pdfFooterNote,
    bankAccounts: s.bankAccounts,
  };
}
