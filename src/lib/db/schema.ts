// =============================================================================
// DRIZZLE ORM SCHEMA — Servicios NP (completo)
// =============================================================================

import {
  pgTable, serial, varchar, text, numeric, integer,
  boolean, timestamp, date, pgEnum, jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// ENUMS
// ---------------------------------------------------------------------------

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash", "check", "transfer", "credit",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "draft", "pending_approval", "approved", "rejected", "invoiced", "cancelled",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "operator", "vehicle", "equipment",
]);

export const currencyEnum = pgEnum("currency", ["CLP", "USD", "EUR"]);

export const contactTypeEnum = pgEnum("contact_type", [
  "client", "supplier", "both",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending", "paid", "overdue", "cancelled",
]);

export const expenseTypeEnum = pgEnum("expense_type", [
  "fixed",    // Fijo: arriendo, sueldos base, seguros
  "variable", // Variable: insumos, combustible, viáticos
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "rent", "salary", "insurance", "utilities",           // Fijos
  "supplies", "fuel", "travel", "subcontracting", "maintenance", "other", // Variables
]);

// ---------------------------------------------------------------------------
// 1. COMPANY SETTINGS
// ---------------------------------------------------------------------------

export const companySettings = pgTable("company_settings", {
  id:           serial("id").primaryKey(),

  legalName:    varchar("legal_name", { length: 255 }).notNull(),
  rut:          varchar("rut", { length: 20 }).notNull(),
  address:      text("address").notNull(),
  district:     varchar("district", { length: 100 }),
  region:       varchar("region", { length: 100 }),
  businessLine: varchar("business_line", { length: 255 }),
  email:        varchar("email", { length: 255 }),
  phone:        varchar("phone", { length: 50 }),
  website:      varchar("website", { length: 255 }),
  logoUrl:      text("logo_url"),

  bankAccounts: jsonb("bank_accounts").notNull().default("[]"),
  // [{ bank, accountType, accountNumber, accountHolder, rut, email }]

  pdfFooterNote:             text("pdf_footer_note"),
  defaultValidityDays:       integer("default_validity_days").default(14),
  quoteNumberPrefix:         varchar("quote_number_prefix", { length: 10 }).default("COT-"),
  woNumberPrefix:            varchar("wo_number_prefix",    { length: 10 }).default("OT-"),
  poNumberPrefix:            varchar("po_number_prefix",    { length: 10 }).default("OC-"),
  invoiceNumberPrefix:       varchar("invoice_number_prefix",{ length: 10 }).default("FAC-"),
  defaultTermsAndConditions: text("default_terms_and_conditions"),

  // Semáforo de rentabilidad — umbrales en %
  // { green: 30, yellow: 15 }  →  ≥30 verde · ≥15 amarillo · <15 rojo
  profitabilityThresholds: jsonb("profitability_thresholds")
    .notNull()
    .default('{"green": 30, "yellow": 15}'),

  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// 2. SERVICE CATALOG
// ---------------------------------------------------------------------------

export const serviceCategories = pgTable("service_categories", {
  id:          serial("id").primaryKey(),
  name:        varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive:    boolean("is_active").notNull().default(true),
});

export const services = pgTable("services", {
  id:               serial("id").primaryKey(),
  categoryId:       integer("category_id").references(() => serviceCategories.id),
  code:             varchar("code", { length: 50 }),
  name:             varchar("name", { length: 255 }).notNull(),
  description:      text("description"),
  unit:             varchar("unit", { length: 50 }).notNull().default("UN"),
  defaultUnitPrice: numeric("default_unit_price", { precision: 14, scale: 2 }).notNull().default("0"),
  taxable:          boolean("taxable").notNull().default(true),
  isActive:         boolean("is_active").notNull().default(true),
  createdAt:        timestamp("created_at").defaultNow(),
  updatedAt:        timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// 3. CONTACTS (Clients & Suppliers)
// ---------------------------------------------------------------------------

export const contacts = pgTable("contacts", {
  id:                   serial("id").primaryKey(),
  type:                 contactTypeEnum("type").notNull().default("client"),
  name:                 varchar("name", { length: 255 }).notNull(),
  rut:                  varchar("rut", { length: 20 }).notNull(),
  address:              text("address"),
  district:             varchar("district", { length: 100 }),
  region:               varchar("region", { length: 100 }),
  businessLine:         varchar("business_line", { length: 255 }),
  contactPerson:        varchar("contact_person", { length: 255 }),
  phone:                varchar("phone", { length: 50 }),
  email:                varchar("email", { length: 255 }),
  defaultPaymentMethod: paymentMethodEnum("default_payment_method").default("transfer"),
  creditDays:           integer("credit_days").default(0),
  notes:                text("notes"),
  isActive:             boolean("is_active").notNull().default(true),
  createdAt:            timestamp("created_at").defaultNow(),
  updatedAt:            timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// 4. QUOTES (Cotizaciones)
// ---------------------------------------------------------------------------

export const quotes = pgTable("quotes", {
  id:              serial("id").primaryKey(),
  quoteNumber:     varchar("quote_number", { length: 30 }).notNull(),
  clientId:        integer("client_id").notNull().references(() => contacts.id),
  issueDate:       date("issue_date").notNull(),
  validityDate:    date("validity_date"),
  status:          documentStatusEnum("status").notNull().default("draft"),
  netAmount:       numeric("net_amount",    { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:       numeric("tax_amount",    { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount:     numeric("total_amount",  { precision: 14, scale: 2 }).notNull().default("0"),
  estimatedCost:   numeric("estimated_cost",{ precision: 14, scale: 2 }).notNull().default("0"),
  // ↑ suma de expenses.quote_id — margen esperado = (net - estimatedCost) / net
  observations:       text("observations"),
  termsAndConditions: text("terms_and_conditions"),
  internalNotes:      text("internal_notes"),
  approvedBy:      varchar("approved_by", { length: 255 }),
  approvedAt:      timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdBy:       varchar("created_by", { length: 255 }),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow(),
});

export const quoteLines = pgTable("quote_lines", {
  id:          serial("id").primaryKey(),
  quoteId:     integer("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  serviceId:   integer("service_id").references(() => services.id),
  position:    integer("position").notNull().default(0),
  description: text("description").notNull(),
  unit:        varchar("unit", { length: 50 }).notNull().default("UN"),
  quantity:    numeric("quantity",   { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice:   numeric("unit_price", { precision: 14, scale: 2 }).notNull().default("0"),
  discount:    numeric("discount",   { precision: 5,  scale: 2 }).notNull().default("0"),
  lineTotal:   numeric("line_total", { precision: 14, scale: 2 }).notNull().default("0"),
  taxable:     boolean("taxable").notNull().default(true),
});

// ---------------------------------------------------------------------------
// 5. WORK ORDERS (Órdenes de Trabajo)
// ---------------------------------------------------------------------------

export const workOrders = pgTable("work_orders", {
  id:             serial("id").primaryKey(),
  woNumber:       varchar("wo_number", { length: 30 }).notNull(),
  quoteId:        integer("quote_id").references(() => quotes.id),
  clientId:       integer("client_id").notNull().references(() => contacts.id),
  requestDate:    date("request_date").notNull(),
  serviceDate:    date("service_date").notNull(),
  serviceEndDate: date("service_end_date"),
  status:         documentStatusEnum("status").notNull().default("draft"),
  netAmount:      numeric("net_amount",      { precision: 14, scale: 2 }).notNull().default("0"),
  discountAmount: numeric("discount_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:      numeric("tax_amount",      { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount:    numeric("total_amount",    { precision: 14, scale: 2 }).notNull().default("0"),
  salesObservations:      text("sales_observations"),
  financeObservations:    text("finance_observations"),
  accountingObservations: text("accounting_observations"),
  ackName:         varchar("ack_name",     { length: 255 }),
  ackRut:          varchar("ack_rut",      { length: 20 }),
  ackDate:         date("ack_date"),
  ackLocation:     varchar("ack_location", { length: 255 }),
  ackSignatureUrl: text("ack_signature_url"),
  createdBy:       varchar("created_by", { length: 255 }),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow(),
});

export const workOrderLines = pgTable("work_order_lines", {
  id:          serial("id").primaryKey(),
  workOrderId: integer("work_order_id").notNull().references(() => workOrders.id, { onDelete: "cascade" }),
  serviceId:   integer("service_id").references(() => services.id),
  position:    integer("position").notNull().default(0),
  description: text("description").notNull(),
  unit:        varchar("unit", { length: 50 }).notNull().default("UN"),
  quantity:    numeric("quantity",   { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice:   numeric("unit_price", { precision: 14, scale: 2 }).notNull().default("0"),
  discount:    numeric("discount",   { precision: 5,  scale: 2 }).notNull().default("0"),
  lineTotal:   numeric("line_total", { precision: 14, scale: 2 }).notNull().default("0"),
  taxable:     boolean("taxable").notNull().default(true),
});

// ---------------------------------------------------------------------------
// 6. RESOURCES
// ---------------------------------------------------------------------------

export const resources = pgTable("resources", {
  id:           serial("id").primaryKey(),
  type:         resourceTypeEnum("type").notNull(),
  name:         varchar("name", { length: 255 }).notNull(),
  identifier:   varchar("identifier", { length: 100 }),
  description:  text("description"),
  licensePlate: varchar("license_plate", { length: 20 }),
  vehicleModel: varchar("vehicle_model", { length: 100 }),
  isActive:     boolean("is_active").notNull().default(true),
  createdAt:    timestamp("created_at").defaultNow(),
});

export const workOrderResources = pgTable("work_order_resources", {
  id:           serial("id").primaryKey(),
  workOrderId:  integer("work_order_id").notNull().references(() => workOrders.id, { onDelete: "cascade" }),
  resourceId:   integer("resource_id").notNull().references(() => resources.id),
  assignedFrom: timestamp("assigned_from"),
  assignedTo:   timestamp("assigned_to"),
  notes:        text("notes"),
});

// ---------------------------------------------------------------------------
// 7. PURCHASE ORDERS
// ---------------------------------------------------------------------------

export const purchaseOrders = pgTable("purchase_orders", {
  id:               serial("id").primaryKey(),
  poNumber:         varchar("po_number", { length: 30 }).notNull(),
  supplierId:       integer("supplier_id").notNull().references(() => contacts.id),
  workOrderId:      integer("work_order_id").references(() => workOrders.id),
  issueDate:        date("issue_date").notNull(),
  deliveryDate:     date("delivery_date"),
  validityDate:     date("validity_date"),
  currency:         currencyEnum("currency").notNull().default("CLP"),
  requestedBy:      varchar("requested_by", { length: 255 }),
  department:       varchar("department",   { length: 100 }),
  deliveryLocation: text("delivery_location"),
  billingName:      varchar("billing_name",  { length: 255 }),
  billingRut:       varchar("billing_rut",   { length: 20 }),
  billingAddress:   text("billing_address"),
  status:           documentStatusEnum("status").notNull().default("draft"),
  netAmount:        numeric("net_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:        numeric("tax_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount:      numeric("total_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  notes:            text("notes"),
  attachmentUrl:    text("attachment_url"),
  attachmentName:   varchar("attachment_name", { length: 255 }),
  createdBy:        varchar("created_by", { length: 255 }),
  createdAt:        timestamp("created_at").defaultNow(),
  updatedAt:        timestamp("updated_at").defaultNow(),
});

export const purchaseOrderLines = pgTable("purchase_order_lines", {
  id:              serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  serviceId:       integer("service_id").references(() => services.id),
  position:        integer("position").notNull().default(0),
  description:     text("description").notNull(),
  unit:            varchar("unit", { length: 50 }).notNull().default("UN"),
  quantity:        numeric("quantity",   { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice:       numeric("unit_price", { precision: 14, scale: 2 }).notNull().default("0"),
  discount:        numeric("discount",   { precision: 5,  scale: 2 }).notNull().default("0"),
  lineTotal:       numeric("line_total", { precision: 14, scale: 2 }).notNull().default("0"),
});

// ---------------------------------------------------------------------------
// 8. FACTURAS EMITIDAS — IVA DÉBITO
// ---------------------------------------------------------------------------

export const salesInvoices = pgTable("sales_invoices", {
  id:           serial("id").primaryKey(),
  folio:        varchar("folio", { length: 30 }).notNull(),
  clientId:     integer("client_id").notNull().references(() => contacts.id),
  workOrderId:  integer("work_order_id").references(() => workOrders.id),
  quoteId:      integer("quote_id").references(() => quotes.id),
  issueDate:    date("issue_date").notNull(),
  dueDate:      date("due_date"),
  netAmount:    numeric("net_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:    numeric("tax_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount:  numeric("total_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  paymentStatus:         invoiceStatusEnum("payment_status").notNull().default("pending"),
  paymentMethod:         paymentMethodEnum("payment_method"),
  paidAt:                timestamp("paid_at"),
  clientPoNumber:        varchar("client_po_number", { length: 50 }),
  clientPoAttachmentUrl: text("client_po_attachment_url"),
  notes:        text("notes"),
  createdBy:    varchar("created_by", { length: 255 }),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// 9. FACTURAS RECIBIDAS — IVA CRÉDITO
// ---------------------------------------------------------------------------

export const supplierInvoices = pgTable("supplier_invoices", {
  id:              serial("id").primaryKey(),
  folio:           varchar("folio", { length: 30 }).notNull(),
  supplierId:      integer("supplier_id").references(() => contacts.id),
  supplierRut:     varchar("supplier_rut", { length: 20 }),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),
  issueDate:       date("issue_date").notNull(),
  dueDate:         date("due_date"),
  netAmount:       numeric("net_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:       numeric("tax_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount:     numeric("total_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  paymentStatus:   invoiceStatusEnum("payment_status").notNull().default("pending"),
  paidAt:          timestamp("paid_at"),
  attachmentUrl:   text("attachment_url"),
  attachmentName:  varchar("attachment_name", { length: 255 }),
  description:     text("description"),
  createdBy:       varchar("created_by", { length: 255 }),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// 10. GASTOS (Expenses)
// ---------------------------------------------------------------------------

export const expenses = pgTable("expenses", {
  id:          serial("id").primaryKey(),
  type:        expenseTypeEnum("type").notNull(),
  category:    expenseCategoryEnum("category").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  netAmount:   numeric("net_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount:   numeric("tax_amount",   { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  // Trazabilidad
  quoteId:           integer("quote_id").references(() => quotes.id),           // costo estimado
  workOrderId:       integer("work_order_id").references(() => workOrders.id),  // costo real
  supplierInvoiceId: integer("supplier_invoice_id").references(() => supplierInvoices.id),
  isPaid:    boolean("is_paid").notNull().default(false),
  paidAt:    timestamp("paid_at"),
  notes:     text("notes"),
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ---------------------------------------------------------------------------
// RELATIONS
// ---------------------------------------------------------------------------

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  client:        one(contacts,  { fields: [quotes.clientId], references: [contacts.id] }),
  lines:         many(quoteLines),
  workOrders:    many(workOrders),
  salesInvoices: many(salesInvoices),
  expenses:      many(expenses),
}));

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  quote:          one(quotes,   { fields: [workOrders.quoteId],  references: [quotes.id] }),
  client:         one(contacts, { fields: [workOrders.clientId], references: [contacts.id] }),
  lines:          many(workOrderLines),
  resources:      many(workOrderResources),
  purchaseOrders: many(purchaseOrders),
  salesInvoices:  many(salesInvoices),
  expenses:       many(expenses),
}));

export const salesInvoicesRelations = relations(salesInvoices, ({ one }) => ({
  client:    one(contacts,   { fields: [salesInvoices.clientId],    references: [contacts.id] }),
  workOrder: one(workOrders, { fields: [salesInvoices.workOrderId], references: [workOrders.id] }),
  quote:     one(quotes,     { fields: [salesInvoices.quoteId],     references: [quotes.id] }),
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

export const resourcesRelations = relations(resources, ({ many }) => ({
  assignments: many(workOrderResources),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  supplier:         one(contacts,   { fields: [purchaseOrders.supplierId],  references: [contacts.id] }),
  workOrder:        one(workOrders, { fields: [purchaseOrders.workOrderId], references: [workOrders.id] }),
  lines:            many(purchaseOrderLines),
  supplierInvoices: many(supplierInvoices),
}));
