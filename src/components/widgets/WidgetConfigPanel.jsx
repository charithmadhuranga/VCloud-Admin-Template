import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";

const WIDGET_TYPE_LABELS = {
  time_series: "Time Series",
  bar: "Bar Chart",
  pie: "Pie / Donut",
  gauge: "Gauge",
  stat: "Stat",
  table: "Table",
  event_log: "Event Log",
  markdown: "Markdown",
};

const REALTIME_FIELDS = ["cpu_percent", "memory_percent", "disk_percent", "device_id"];

export default function WidgetConfigPanel({ widget, onSave, onDelete, onClose }) {
  const [source, setSource] = useState(widget.source || "clickhouse");
  const [title, setTitle] = useState(widget.title);
  const [description, setDescription] = useState(widget.description || "");
  const [sql, setSql] = useState(widget.data_config?.clickhouse?.query || "");
  const [realtimeTopic, setRealtimeTopic] = useState(widget.realtime_topic || "");
  const [realtimeField, setRealtimeField] = useState(widget.data_config?.realtime?.field || "cpu_percent");

  useEffect(() => {
    setSource(widget.source || "clickhouse");
    setTitle(widget.title);
    setDescription(widget.description || "");
    setSql(widget.data_config?.clickhouse?.query || "");
    setRealtimeTopic(widget.realtime_topic || "");
    setRealtimeField(widget.data_config?.realtime?.field || "cpu_percent");
  }, [widget]);

  const handleSave = () => {
    onSave({
      title,
      description: description || null,
      source,
      realtime_topic: source === "realtime" ? realtimeTopic : null,
      data_config: source === "clickhouse"
        ? { clickhouse: sql.trim() ? { query: sql.trim() } : null, realtime: null }
        : { clickhouse: null, realtime: { topic: realtimeTopic, field: realtimeField } },
    });
  };

  return (
    <div className="w-80 border-l border-(--color-border) bg-(--color-surface-elevated) flex flex-col h-full shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
        <h3 className="text-sm font-semibold text-(--color-text-primary)">Widget Config</h3>
        <button onClick={onClose} className="p-1 text-(--color-text-muted) hover:text-(--color-text-primary) rounded">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="text-xs px-2 py-1 rounded bg-grafana-blue/10 text-grafana-blue font-medium inline-block">
          {WIDGET_TYPE_LABELS[widget.widget_type] || widget.widget_type}
        </div>

        <div>
          <label className="block text-xs font-medium text-(--color-text-muted) mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue" />
        </div>

        <div>
          <label className="block text-xs font-medium text-(--color-text-muted) mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full px-3 py-2 text-sm bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue resize-none" />
        </div>

        <div>
          <label className="block text-xs font-medium text-(--color-text-muted) mb-1">Data Source</label>
          <div className="flex gap-2">
            <button onClick={() => setSource("clickhouse")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-grafana border transition-colors ${
                source === "clickhouse"
                  ? "bg-grafana-blue text-white border-grafana-blue"
                  : "bg-(--color-surface-elevated) text-(--color-text-muted) border-(--color-border) hover:border-grafana-blue"
              }`}>ClickHouse</button>
            <button onClick={() => setSource("realtime")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-grafana border transition-colors ${
                source === "realtime"
                  ? "bg-grafana-blue text-white border-grafana-blue"
                  : "bg-(--color-surface-elevated) text-(--color-text-muted) border-(--color-border) hover:border-grafana-blue"
              }`}>Realtime</button>
          </div>
        </div>

        {source === "clickhouse" ? (
          <div>
            <label className="block text-xs font-medium text-(--color-text-muted) mb-1">ClickHouse Query</label>
            <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={4}
              className="w-full px-3 py-2 text-xs font-mono bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue resize-none"
              placeholder="SELECT timestamp, value FROM metrics WHERE device_id = ?" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-(--color-text-muted) mb-1">Realtime Topic</label>
              <select value={realtimeTopic} onChange={(e) => setRealtimeTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue">
                <option value="">Select a topic...</option>
                <option value="device/metrics">device/metrics</option>
                <option value="device/events">device/events</option>
                <option value="device/status">device/status</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-(--color-text-muted) mb-1">Field</label>
              <select value={realtimeField} onChange={(e) => setRealtimeField(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue">
                {REALTIME_FIELDS.map((f) => (<option key={f} value={f}>{f}</option>))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-(--color-border)">
        <Button size="sm" className="flex-1" onClick={handleSave}>Save</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}
