"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactRecord } from "@/lib/data/contacts";

interface Props {
  options: ContactRecord[];
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export function ContactCombobox({ options, value, onChange, placeholder = "Buscar...", hasError }: Props) {
  const [query, setQuery]               = useState(value);
  const [open, setOpen]                 = useState(false);
  const [highlighted, setHighlighted]   = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.rut.replace(/\./g, "").includes(query.replace(/\./g, ""))
  );

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function select(opt: ContactRecord) {
    setQuery(opt.name);
    onChange(opt.name);
    setOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown") { setOpen(true); setHighlighted(0); e.preventDefault(); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) select(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); setHighlighted(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "h-9 w-full rounded-md border bg-transparent px-3 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-ring transition-colors",
          hasError ? "border-red-400/50" : "border-input"
        )}
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-popover shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {filtered.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(opt); }}
              onMouseEnter={() => setHighlighted(idx)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                idx === highlighted ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{opt.name}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{opt.rut}</p>
              </div>
              {value === opt.name && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {open && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/[0.08] bg-popover shadow-lg p-3">
          <p className="text-[12px] text-muted-foreground text-center">Sin resultados para &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
