// =============================================================================
// SCHEMA FINANCIERO — Extensión del schema base
// Entidades: Gastos, Facturas Recibidas, Facturas Emitidas
// =============================================================================

import {
  pgTable, serial, varchar, text, numeric, integer,
  boolean, timestamp, date, pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Importadas del schema base (referencia)
import { contacts, quotes, workOrders, purchaseOrders } from "./schema";

// ---------------------------------------------------------------------------
// ENUMS NUEVOS
// ---------------------------------------------------------------------------

export const expenseTypeEnum = pgEnum("expense_type", [
  "fixed",    // Fijo: arriendo, sueldos base, seguros, servicios básicos
  "variable", // Variable: insumos, combustible, viáticos, subcontratación
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  // Fijos
  "rent",           // Arriendo oficina/bodega
  "salary",         // Sueldos base
  "insurance",      // Seguros
  "utilities",      // Servicios básicos (luz, agua, internet)
  // Variables
  "supplies",       // Insumos de servicio
  "fuel",           // Combustible
  "travel",         // Viáticos y transporte
  "subcontracting", // Subcontratación
  "maintenance",    // Mantención de flota/equipos
  "other",          // Otro
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending",  // Pendiente de pago
  "paid",     // Pagado
  "overdue",  // Vencido
  "cancelled",
]);

// ---------------------------------------------------------------------------
// FACTURAS EMITIDAS (Sales Invoices) — reemplaza la tabla `invoices` anterior
// Alimenta el IVA DÉBITO
// ---------------------------------------------------------------------------

export const salesInvoices = pgTable("sales_invoices", {
  id:           serial("id").primaryKey(),
  folio:        varchar("folio", { length: 30 }).notNull(),       // N° Folio SII

  clientId:     integer("client_id").notNull().references(() => contacts.id),
  workOrderId:  integer("work_order_id").references(() => workOrders.id),
  quoteId:      integer("quote_id").references(() => quotes.id),

  issueDate:    date("issue_date").notNull(),
  dueDate:      date("due_date"),

  // Montos — siempre almacenados, nunca recalculados post-emisión
  netAmount:    numeric("net_amount",  { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:    numeric("tax_amount",  { precision: 14, scale: 2 }).notNull().default("0"), // IVA DÉBITO
  totalAmount:  numeric("total_amount",{ precision: 14, scale: 2 }).notNull().default("0"),

  paymentStatus: invoiceStatusEnum("payment_status").notNull().default("pending"),
  paidAt:       timestamp("paid_at"),

  // OC del cliente recibida (adjunto)
  clientPoNumber:      varchar("client_po_number", { length: 50 }),
  clientPoAttachmentUrl: text("client_po_attachment_url"),

  notes:        text("notes"),
  createdBy:    varchar("created_by", { length: 255 }),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// FACTURAS RECIBIDAS (Supplier Invoices)
// Alimenta el IVA CRÉDITO y respalda gastos variables
// ---------------------------------------------------------------------------

export const supplierInvoices = pgTable("supplier_invoices", {
  id:              serial("id").primaryKey(),
  folio:           varchar("folio", { length: 30 }).notNull(),
  supplierRut:     varchar("supplier_rut", { length: 20 }),
  supplierId:      integer("supplier_id").references(() => contacts.id),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),

  issueDate:   date("issue_date").notNull(),
  dueDate:     date("due_date"),

  // Montos
  netAmount:   numeric("net_amount",  { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:   numeric("tax_amount",  { precision: 14, scale: 2 }).notNull().default("0"), // IVA CRÉDITO
  totalAmount: numeric("total_amount",{ precision: 14, scale: 2 }).notNull().default("0"),

  paymentStatus: invoiceStatusEnum("payment_status").notNull().default("pending"),
  paidAt:      timestamp("paid_at"),

  // Adjunto del PDF/XML recibido
  attachmentUrl:  text("attachment_url"),
  attachmentName: varchar("attachment_name", { length: 255 }),

  description: text("description"),
  createdBy:   varchar("created_by", { length: 255 }),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// GASTOS (Expenses)
// Núcleo del control de costos — cruza con Cotizaciones (esperado) y OTs (real)
// ---------------------------------------------------------------------------

export const expenses = pgTable("expenses", {
  id:          serial("id").primaryKey(),

  type:        expenseTypeEnum("type").notNull(),       // fixed | variable
  category:    expenseCategoryEnum("category").notNull(),
  description: varchar("description", { length: 255 }).notNull(),

  expenseDate: date("expense_date").notNull(),

  // Montos
  netAmount:   numeric("net_amount",  { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:   numeric("tax_amount",  { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount",{ precision: 14, scale: 2 }).notNull().default("0"),

  // ─── Trazabilidad operativa ───────────────────────────────────────────────
  // Para gastos proyectados al cotizar (presupuesto esperado)
  quoteId:          integer("quote_id").references(() => quotes.id),
  // Para gastos reales al ejecutar (costo real de la OT)
  workOrderId:      integer("work_order_id").references(() => workOrders.id),
  // Respaldo documental: factura de proveedor
  supplierInvoiceId:integer("supplier_invoice_id").references(() => supplierInvoices.id),

  // ─── Metadatos ────────────────────────────────────────────────────────────
  isPaid:      boolean("is_paid").notNull().default(false),
  paidAt:      timestamp("paid_at"),
  notes:       text("notes"),

  createdBy:   varchar("created_by", { length: 255 }),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// RELATIONS
// ---------------------------------------------------------------------------

export const salesInvoicesRelations = relations(salesInvoices, ({ one }) => ({
  client:    one(contacts,    { fields: [salesInvoices.clientId],    references: [contacts.id] }),
  workOrder: one(workOrders,  { fields: [salesInvoices.workOrderId], references: [workOrders.id] }),
  quote:     one(quotes,      { fields: [salesInvoices.quoteId],     references: [quotes.id] }),
}));

export const supplierInvoicesRelations = relations(supplierInvoices, ({ one, many }) => ({
  supplier:      one(contacts,       { fields: [supplierInvoices.supplierId],      references: [contacts.id] }),
  purchaseOrder: one(purchaseOrders, { fields: [supplierInvoices.purchaseOrderId], references: [purchaseOrders.id] }),
  expenses:      many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  quote:           one(quotes,           { fields: [expenses.quoteId],           references: [quotes.id] }),
  workOrder:       one(workOrders,       { fields: [expenses.workOrderId],        references: [workOrders.id] }),
  supplierInvoice: one(supplierInvoices, { fields: [expenses.supplierInvoiceId], references: [supplierInvoices.id] }),
}));
