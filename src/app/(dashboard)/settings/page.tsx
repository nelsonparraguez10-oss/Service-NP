"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Building2, CreditCard, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface BankAccount {
  id: string; bank: string; accountType: string;
  accountNumber: string; accountHolder: string; rut: string; email: string;
}

interface ProfitabilityThresholds { green: number; yellow: number; }

const CATEGORY_LABELS: Record<string, string> = {
  rent: "Arriendo", salary: "Sueldos base", insurance: "Seguros", utilities: "Servicios básicos",
  supplies: "Insumos", fuel: "Combustible", travel: "Viáticos", subcontracting: "Subcontratación",
  maintenance: "Mantención", other: "Otro",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-semibold text-foreground">{children}</h3>
      <div className="mt-1 h-px bg-white/[0.07]" />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-widest text-muted-foreground/70">{label}</Label>
      {children}
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <Button size="sm" className="h-8 gap-1.5 text-[12px]" onClick={onClick} disabled={saving}>
      <Save className="h-3.5 w-3.5" />
      {saving ? "Guardando..." : "Guardar"}
    </Button>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [company, setCompany] = useState({
    legalName: "", rut: "", address: "", district: "",
    region: "", businessLine: "", email: "", phone: "",
  });
  const [pdfFooterNote, setPdfFooterNote] = useState("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [thresholds, setThresholds] = useState<ProfitabilityThresholds>({ green: 30, yellow: 15 });

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then((data: any) => {
        setCompany({
          legalName:    data.legalName    ?? "",
          rut:          data.rut          ?? "",
          address:      data.address      ?? "",
          district:     data.district     ?? "",
          region:       data.region       ?? "",
          businessLine: data.businessLine ?? "",
          email:        data.email        ?? "",
          phone:        data.phone        ?? "",
        });
        setPdfFooterNote(data.pdfFooterNote ?? "");
        setBankAccounts(
          (data.bankAccounts ?? []).map((a: any) => {
            const id: string = (a.id as string | undefined) ?? crypto.randomUUID();
            return {
              id,
              bank: a.bank ?? "",
              accountType: a.accountType ?? "",
              accountNumber: a.accountNumber ?? "",
              accountHolder: a.accountHolder ?? "",
              rut: a.rut ?? "",
              email: a.email ?? "",
            };
          })
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function save(extra?: Partial<typeof company & { pdfFooterNote: string; bankAccounts: BankAccount[] }>) {
    setSaving(true);
    try {
      const payload = {
        ...company,
        pdfFooterNote,
        bankAccounts: bankAccounts.map(({ id: _id, ...rest }) => rest),
        ...extra,
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast("ok", "Configuración guardada");
    } catch {
      showToast("err", "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function addAccount() {
    setBankAccounts(prev => [...prev, { id: crypto.randomUUID(), bank: "", accountType: "", accountNumber: "", accountHolder: "", rut: "", email: "" }]);
  }
  function removeAccount(id: string) { setBankAccounts(prev => prev.filter(a => a.id !== id)); }
  function updateAccount(id: string, field: keyof BankAccount, value: string) {
    setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }

  const redThreshold = thresholds.yellow;
  const marginDemo = [42, 28, 12];
  function semaforo(pct: number) {
    if (pct >= thresholds.green)  return "text-emerald-400";
    if (pct >= thresholds.yellow) return "text-amber-400";
    return "text-red-400";
  }

  if (loading) {
    return <div className="text-[13px] text-muted-foreground">Cargando configuración...</div>;
  }

  return (
    <div className="max-w-3xl space-y-5">
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 rounded-xl px-4 py-2.5 text-[13px] font-medium shadow-lg",
          toast.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}>
          {toast.msg}
        </div>
      )}

      <Tabs defaultValue="company">
        <TabsList className="h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] p-0.5">
          {[
            { value: "company",       label: "Empresa",         icon: Building2 },
            { value: "banking",       label: "Datos bancarios", icon: CreditCard },
            { value: "documents",     label: "Documentos",      icon: FileText },
            { value: "profitability", label: "Rentabilidad",    icon: TrendingUp },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}
              className="h-7 gap-1.5 text-[12px] rounded-lg data-[state=active]:bg-white/[0.10] data-[state=active]:text-foreground text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />{label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ─── Empresa ─── */}
        <TabsContent value="company" className="mt-5">
          <div className="rounded-2xl border border-white/[0.07] bg-card p-6 space-y-5">
            <SectionTitle>Datos de la empresa</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Razón Social">
                  <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                    value={company.legalName} onChange={e => setCompany(c => ({ ...c, legalName: e.target.value }))} />
                </Field>
              </div>
              <Field label="RUT">
                <Input className="h-9 text-[13px] font-mono bg-white/[0.04] border-white/[0.08]"
                  value={company.rut} onChange={e => setCompany(c => ({ ...c, rut: e.target.value }))} />
              </Field>
              <Field label="Giro">
                <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                  value={company.businessLine} onChange={e => setCompany(c => ({ ...c, businessLine: e.target.value }))} />
              </Field>
              <div className="col-span-2">
                <Field label="Dirección">
                  <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                    value={company.address} onChange={e => setCompany(c => ({ ...c, address: e.target.value }))} />
                </Field>
              </div>
              <Field label="Comuna">
                <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                  value={company.district} onChange={e => setCompany(c => ({ ...c, district: e.target.value }))} />
              </Field>
              <Field label="Región">
                <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                  value={company.region} onChange={e => setCompany(c => ({ ...c, region: e.target.value }))} />
              </Field>
              <Field label="Email">
                <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]" type="email"
                  value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
              </Field>
              <Field label="Teléfono">
                <Input className="h-9 text-[13px] bg-white/[0.04] border-white/[0.08]"
                  value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} />
              </Field>
            </div>
            <div className="flex justify-end pt-1">
              <SaveButton saving={saving} onClick={() => save()} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Bancarios ─── */}
        <TabsContent value="banking" className="mt-5">
          <div className="rounded-2xl border border-white/[0.07] bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <SectionTitle>Cuentas bancarias</SectionTitle>
              <Button onClick={addAccount} variant="outline" size="sm" className="h-7 gap-1.5 text-[11px] border-white/[0.10] bg-transparent hover:bg-white/[0.06]">
                <Plus className="h-3 w-3" />Agregar
              </Button>
            </div>
            <div className="space-y-3">
              {bankAccounts.map((acc, i) => (
                <div key={acc.id} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Cuenta {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10" onClick={() => removeAccount(acc.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["bank", "Banco"], ["accountType", "Tipo de cuenta"],
                      ["accountNumber", "N° Cuenta"], ["accountHolder", "Titular"],
                      ["rut", "RUT titular"], ["email", "Email de pago"],
                    ] as [keyof BankAccount, string][]).map(([field, label]) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground/60">{label}</Label>
                        <Input
                          className="h-8 text-[12px] bg-white/[0.04] border-white/[0.07]"
                          value={acc[field]}
                          onChange={e => updateAccount(acc.id, field, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <SaveButton saving={saving} onClick={() => save()} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Documentos ─── */}
        <TabsContent value="documents" className="mt-5">
          <div className="rounded-2xl border border-white/[0.07] bg-card p-6 space-y-5">
            <SectionTitle>Configuración de PDFs</SectionTitle>
            <Field label="Nota al pie (aparece en todos los PDFs)">
              <Textarea className="text-[13px] min-h-[70px] resize-none bg-white/[0.04] border-white/[0.08]"
                value={pdfFooterNote}
                onChange={e => setPdfFooterNote(e.target.value)}
              />
            </Field>
            <div className="flex justify-end">
              <SaveButton saving={saving} onClick={() => save()} />
            </div>
          </div>
        </TabsContent>

        {/* ─── Rentabilidad ─── */}
        <TabsContent value="profitability" className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-card p-6 space-y-6">
            <div>
              <SectionTitle>Umbrales del semáforo de rentabilidad</SectionTitle>
              <p className="text-[12px] text-muted-foreground -mt-2">
                Define los porcentajes de margen neto que clasifican cada OT como rentable, en riesgo o crítica.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[12px] font-semibold text-emerald-400">Verde — Saludable</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Margen ≥ este valor</p>
                <div className="flex items-center gap-2">
                  <Input type="number" min={0} max={100} value={thresholds.green}
                    onChange={e => setThresholds(t => ({ ...t, green: parseInt(e.target.value) || 0 }))}
                    className="h-9 w-24 text-[14px] font-semibold text-center bg-white/[0.06] border-emerald-500/20" />
                  <span className="text-[13px] text-muted-foreground">%</span>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-[12px] font-semibold text-amber-400">Amarillo — En riesgo</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Margen ≥ este valor y &lt; verde</p>
                <div className="flex items-center gap-2">
                  <Input type="number" min={0} max={100} value={thresholds.yellow}
                    onChange={e => setThresholds(t => ({ ...t, yellow: parseInt(e.target.value) || 0 }))}
                    className="h-9 w-24 text-[14px] font-semibold text-center bg-white/[0.06] border-amber-500/20" />
                  <span className="text-[13px] text-muted-foreground">%</span>
                </div>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-[12px] font-semibold text-red-400">Rojo — Crítico</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Margen &lt; {redThreshold}%</p>
                <div className="h-9 flex items-center px-3 rounded-lg border border-red-500/20 bg-white/[0.03] w-24">
                  <span className="text-[14px] font-semibold text-red-400">&lt; {redThreshold}%</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 space-y-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Vista previa</p>
                {marginDemo.map((m) => (
                  <div key={m} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", semaforo(m).replace("text-", "bg-"))} />
                      <span className="text-[12px] text-muted-foreground">Margen {m}%</span>
                    </div>
                    <span className={cn("text-[12px] font-semibold", semaforo(m))}>
                      {m >= thresholds.green ? "Saludable" : m >= thresholds.yellow ? "En riesgo" : "Crítico"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-card p-6 space-y-4">
            <SectionTitle>Categorías de gastos</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gastos Fijos</p>
                {["rent","salary","insurance","utilities"].map(k => (
                  <div key={k} className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                    <span className="text-[12px] text-foreground/80">{CATEGORY_LABELS[k]}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gastos Variables</p>
                {["supplies","fuel","travel","subcontracting","maintenance","other"].map(k => (
                  <div key={k} className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400/50" />
                    <span className="text-[12px] text-foreground/80">{CATEGORY_LABELS[k]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
