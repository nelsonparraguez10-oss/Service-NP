export type FieldErrors = Record<string, string>;

export function required(val: string): string {
  return val.trim() === "" ? "Campo requerido" : "";
}

export function validEmail(val: string): string {
  if (!val.trim()) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Email inválido";
}

export function validRut(val: string): string {
  if (!val.trim()) return "Campo requerido";
  return /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(val)
    ? ""
    : "Formato inválido (ej: 76.543.210-K)";
}

export function validAmount(val: string, min = 1): string {
  const n = parseFloat(val);
  if (isNaN(n)) return "Debe ser un número";
  if (n < min) return `Debe ser mayor a ${min - 1}`;
  return "";
}

export function validDate(val: string): string {
  return !val ? "Campo requerido" : "";
}

export function dateAfter(start: string, end: string): string {
  if (!start || !end) return "";
  return new Date(end) >= new Date(start) ? "" : "Debe ser posterior a la fecha de inicio";
}

export function collect(...checks: string[]): FieldErrors | null {
  const filtered = checks.filter(Boolean);
  return filtered.length ? { _: filtered[0] } : null;
}
