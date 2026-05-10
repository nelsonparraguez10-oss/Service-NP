"use client";

import { useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSave() {
  const [status, setStatus] = useState<SaveStatus>("idle");

  function trigger(validateFn: () => boolean) {
    if (!validateFn()) return;
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2200);
    }, 750);
  }

  return { status, trigger };
}
