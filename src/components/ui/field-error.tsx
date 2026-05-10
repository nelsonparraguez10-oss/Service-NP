interface FieldErrorProps { msg?: string }

export function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null;
  return <p className="mt-1 text-[11px] text-red-400">{msg}</p>;
}
