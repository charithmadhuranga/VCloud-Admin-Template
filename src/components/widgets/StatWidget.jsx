import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../ui/Card";

export default function StatWidget({ widget, data, loading }) {
  const vc = widget.visual_config || {};
  const unit = vc.unit || "";
  const decimals = vc.decimals ?? 1;
  const prefix = vc.prefix || "";
  const metricColumn = widget.data_config?.clickhouse?.metric_column || "value";
  const value = data.length > 0 ? Number(data[0][metricColumn] ?? 0) : 0;
  const prevValue = data.length > 1 ? Number(data[1][metricColumn] ?? 0) : null;
  const delta = prevValue !== null ? value - prevValue : null;
  const deltaPct = prevValue && prevValue !== 0 ? ((delta / prevValue) * 100) : null;

  return (
    <Card className="p-3 h-full flex flex-col justify-center">
      <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1 truncate shrink-0">
        {widget.title}
      </h3>
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-xs text-(--color-text-muted)">Loading...</div>
      ) : (
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg text-(--color-text-muted)">{prefix}</span>}
            <span className="text-2xl font-bold text-(--color-text-primary)">
              {typeof value === "number" ? value.toFixed(decimals) : value}
            </span>
            {unit && <span className="text-sm text-(--color-text-muted)">{unit}</span>}
          </div>
          {delta !== null && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${delta >= 0 ? "text-grafana-green" : "text-grafana-red"}`}>
              {delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>
                {delta >= 0 ? "+" : ""}{delta.toFixed(decimals)}{unit}
                {deltaPct !== null && ` (${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%)`}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
