import GaugeChart from "../charts/GaugeChart";
import Card from "../ui/Card";

export default function GaugeWidget({ widget, data, loading }) {
  const vc = widget.visual_config || {};
  const unit = vc.unit || "%";
  const metricColumn = widget.data_config?.clickhouse?.metric_column || "value";
  const value = data.length > 0 ? Number(data[0][metricColumn] ?? 0) : 0;

  return (
    <Card className="p-3 h-full flex flex-col items-center justify-center">
      <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider truncate w-full text-center mb-2 shrink-0">
        {widget.title}
      </h3>
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-xs text-(--color-text-muted)">Loading...</div>
      ) : (
        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
          <GaugeChart value={value} title={`${value}${unit}`} height={160} />
        </div>
      )}
    </Card>
  );
}
