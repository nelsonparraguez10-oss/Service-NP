export function formatCLP(amount: number | string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, "");
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1).toUpperCase();
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted}-${dv}`;
}

export function calcIVA(net: number): number {
  return Math.round(net * 0.19);
}

export function calcTotal(net: number): number {
  return net + calcIVA(net);
}

export function calcLineTotal(qty: number, unitPrice: number, discount = 0): number {
  return qty * unitPrice * (1 - discount / 100);
}

export function calcNetFromLines(
  lines: Array<{ quantity: string | number; unitPrice: string | number; discount?: string | number }>
): number {
  return lines.reduce((sum, l) => {
    return sum + calcLineTotal(
      Number(l.quantity),
      Number(l.unitPrice),
      Number(l.discount ?? 0)
    );
  }, 0);
}
