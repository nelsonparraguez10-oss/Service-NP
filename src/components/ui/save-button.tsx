"use client";

import { Loader2, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/lib/hooks/useSave";

interface SaveButtonProps {
  status: SaveStatus;
  onClick: () => void;
  label?: string;
  className?: string;
}

export function SaveButton({ status, onClick, label = "Guardar cambios", className }: SaveButtonProps) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={status === "saving"}
      className={cn(
        "h-8 gap-1.5 text-[12px] px-5 transition-colors duration-300",
        status === "saved" && "bg-emerald-600 hover:bg-emerald-700",
        className
      )}
    >
      {status === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {status === "saved"  && <Check className="h-3.5 w-3.5" />}
      {status === "idle"   && <Save className="h-3.5 w-3.5" />}
      {status === "saving" ? "Guardando…" : status === "saved" ? "Guardado" : label}
    </Button>
  );
}
