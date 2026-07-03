import AreaChart from "../charts/AreaChart";
import Card from "../ui/Card";

export default function TimeSeriesWidget({ widget, data, loading }) {
  const vc = widget.visual_config || {};
  const color = vc.color || "#4f8cff";
  const unit = vc.unit || "";
  const metricColumn = widget.data_config?.clickhouse?.metric_column || "value";
  const labelColumn = widget.data_config?.clickhouse?.label_column || "timestamp";

  const categories = data.map((d) => {
    const v = d[labelColumn];
    try { return new Date(v).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); } catch { return v; }
  });
  const seriesData = data.map((d) => Number(d[metricColumn] ?? 0));

  return (
    <Card className="p-3 h-full flex flex-col">
      <h3 className="text-xs font-semibold text-(--color-text-muted) mb-2 uppercase tracking-wider truncate shrink-0">
        {widget.title}
      </h3>
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-xs text-(--color-text-muted)">Loading...</div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-xs text-(--color-text-muted)">No data</div>
      ) : (
        <div className="flex-1 min-h-0">
          <AreaChart
            data={[{ name: metricColumn, data: seriesData }]}
            categories={categories}
            colors={[color]}
            height={200}
          />
        </div>
      )}
    </Card>
  );
}
