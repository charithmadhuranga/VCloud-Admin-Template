import PieChart from "../charts/PieChart";
import Card from "../ui/Card";

export default function PieWidget({ widget, data, loading }) {
  const vc = widget.visual_config || {};
  const donut = vc.donut ?? true;
  const valueColumn = widget.data_config?.clickhouse?.value_column || "value";
  const categoryColumn = widget.data_config?.clickhouse?.category_column || "category";

  const chartData = data.map((d) => ({
    name: String(d[categoryColumn] ?? ""),
    value: Number(d[valueColumn] ?? 0),
  }));

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
          <PieChart data={chartData} donut={donut} height={200} />
        </div>
      )}
    </Card>
  );
}
