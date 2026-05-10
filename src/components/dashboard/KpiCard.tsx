import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon: LucideIcon;
  className?: string;
}

export function KpiCard({ title, value, subtitle, trend, icon: Icon, className }: KpiCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral  = trend && trend.value === 0;

  return (
    <div className={cn(
      "rounded-2xl border border-white/[0.07] bg-card p-5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{title}</span>
          <span className="text-[26px] font-semibold tracking-tight text-foreground leading-none mt-1">{value}</span>
          {subtitle && (
            <span className="text-[12px] text-muted-foreground mt-1">{subtitle}</span>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07]">
          <Icon className="h-[17px] w-[17px] text-foreground/70" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          {trendNeutral ? (
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          ) : trendPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          )}
          <span className={cn(
            "text-[12px] font-medium",
            trendNeutral ? "text-muted-foreground" : trendPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-[12px] text-muted-foreground/70">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
