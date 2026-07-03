import StatWidget from "./StatWidget";
import TimeSeriesWidget from "./TimeSeriesWidget";
import BarWidget from "./BarWidget";
import PieWidget from "./PieWidget";
import GaugeWidget from "./GaugeWidget";
import Card from "../ui/Card";

const WIDGET_LABELS = {
  time_series: "Time Series",
  bar: "Bar Chart",
  pie: "Pie / Donut",
  gauge: "Gauge",
  stat: "Stat",
  table: "Table",
  event_log: "Event Log",
  markdown: "Markdown",
};

const mockData = {
  time_series: [
    { timestamp: "2026-07-03T09:00:00Z", value: 45 },
    { timestamp: "2026-07-03T09:05:00Z", value: 52 },
    { timestamp: "2026-07-03T09:10:00Z", value: 38 },
    { timestamp: "2026-07-03T09:15:00Z", value: 65 },
    { timestamp: "2026-07-03T09:20:00Z", value: 58 },
    { timestamp: "2026-07-03T09:25:00Z", value: 72 },
    { timestamp: "2026-07-03T09:30:00Z", value: 61 },
  ],
  bar: [
    { category: "US East", value: 120 },
    { category: "EU West", value: 98 },
    { category: "APAC", value: 145 },
    { category: "US West", value: 87 },
  ],
  pie: [
    { category: "Running", value: 64 },
    { category: "Stopped", value: 12 },
    { category: "Failed", value: 8 },
    { category: "Pending", value: 16 },
  ],
  gauge: [{ value: 73 }],
  stat: [
    { value: 1247 },
    { value: 1189 },
  ],
};

export default function WidgetRenderer({ widget }) {
  const type = widget.widget_type;
  const data = mockData[type] || [];

  switch (type) {
    case "stat":
      return <StatWidget widget={widget} data={data} />;
    case "time_series":
      return <TimeSeriesWidget widget={widget} data={data} />;
    case "bar":
      return <BarWidget widget={widget} data={data} />;
    case "pie":
      return <PieWidget widget={widget} data={data} />;
    case "gauge":
      return <GaugeWidget widget={widget} data={data} />;
    case "table":
      return (
        <Card className="p-3 h-full flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider truncate w-full text-center mb-1">{widget.title}</h3>
          <p className="text-xs text-(--color-text-muted)">Table widget</p>
        </Card>
      );
    case "event_log":
      return (
        <Card className="p-3 h-full flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider truncate w-full text-center mb-1">{widget.title}</h3>
          <p className="text-xs text-(--color-text-muted)">Event log widget</p>
        </Card>
      );
    case "markdown":
      return (
        <Card className="p-3 h-full flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider truncate w-full text-center mb-1">{widget.title}</h3>
          <p className="text-xs text-(--color-text-muted)">{widget.description || "Markdown content"}</p>
        </Card>
      );
    default:
      return (
        <Card className="p-3 h-full flex flex-col items-center justify-center">
          <p className="text-xs text-(--color-text-muted)">{WIDGET_LABELS[type] || type}</p>
        </Card>
      );
  }
}
