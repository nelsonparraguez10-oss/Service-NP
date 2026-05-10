"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCLP, calcLineTotal } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export interface LineItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface LineItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  readOnly?: boolean;
}

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", unit: "UN", quantity: 1, unitPrice: 0, discount: 0 };
}

const inputCls = "h-8 text-[12px] border-0 bg-transparent px-1 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/40";

export function LineItemsTable({ items, onChange, readOnly = false }: LineItemsTableProps) {
  function update(id: string, field: keyof LineItem, value: string | number) {
    onChange(items.map(it => it.id === id ? { ...it, [field]: value } : it));
  }
  function remove(id: string) { onChange(items.filter(it => it.id !== id)); }
  function add()               { onChange([...items, newItem()]); }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="grid grid-cols-[1fr_72px_72px_110px_66px_96px_36px] gap-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        <span>Descripción</span><span className="text-center">Un.</span>
        <span className="text-center">Cant.</span><span className="text-right">P. Unit.</span>
        <span className="text-center">Dscto</span><span className="text-right">Total</span>
        <span />
      </div>

      {/* Rows */}
      {items.map((item) => {
        const total = calcLineTotal(item.quantity, item.unitPrice, item.discount);
        return (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[1fr_72px_72px_110px_66px_96px_36px] gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 items-center",
              !readOnly && "hover:border-white/[0.12] hover:bg-white/[0.05] transition-colors"
            )}
          >
            <Input value={item.description} readOnly={readOnly}
              onChange={e => update(item.id, "description", e.target.value)}
              placeholder="Descripción del servicio..."
              className={`${inputCls} px-0`}
            />
            <Input value={item.unit} readOnly={readOnly}
              onChange={e => update(item.id, "unit", e.target.value)}
              className={`${inputCls} text-center`}
            />
            <Input type="number" min={0} value={item.quantity} readOnly={readOnly}
              onChange={e => update(item.id, "quantity", parseFloat(e.target.value) || 0)}
              className={`${inputCls} text-center`}
            />
            <Input type="number" min={0} value={item.unitPrice} readOnly={readOnly}
              onChange={e => update(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
              className={`${inputCls} text-right`}
            />
            <Input type="number" min={0} max={100} value={item.discount} readOnly={readOnly}
              onChange={e => update(item.id, "discount", parseFloat(e.target.value) || 0)}
              className={`${inputCls} text-center`}
            />
            <span className="text-[12px] font-medium text-right text-foreground/80 pr-1">{formatCLP(total)}</span>
            {!readOnly ? (
              <Button type="button" variant="ghost" size="icon"
                className="h-6 w-6 text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            ) : <span />}
          </div>
        );
      })}

      {!readOnly && (
        <Button type="button" variant="ghost" size="sm"
          className="h-7 text-[11px] text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.05] gap-1.5"
          onClick={add}
        >
          <Plus className="h-3 w-3" />
          Agregar línea
        </Button>
      )}
    </div>
  );
}
