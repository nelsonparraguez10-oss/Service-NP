import type { ReactElement } from "react";

export async function downloadAsPdf(documentElement: ReactElement, filename: string): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const blob = await pdf(documentElement).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
