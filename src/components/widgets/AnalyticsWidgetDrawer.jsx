import { BarChart3, PieChart, Gauge, Activity, Table2, ScrollText, FileText, Presentation, Plus, Trash2, X } from "lucide-react";

const WIDGET_DEFS = [
  { type: "time_series", label: "Time Series", description: "Line chart for metrics over time", icon: Activity },
  { type: "bar", label: "Bar Chart", description: "Bar chart for comparisons", icon: BarChart3 },
  { type: "pie", label: "Pie / Donut", description: "Distribution breakdown", icon: PieChart },
  { type: "gauge", label: "Gauge", description: "Single value gauge", icon: Gauge },
  { type: "stat", label: "Stat", description: "Single stat with delta", icon: Presentation },
  { type: "table", label: "Table", description: "Data table view", icon: Table2 },
  { type: "event_log", label: "Event Log", description: "Event/severity log", icon: ScrollText },
  { type: "markdown", label: "Markdown", description: "Rich text content", icon: FileText },
];

export default function AnalyticsWidgetDrawer({ open, widgets, onAdd, onDelete, onClose }) {
  if (!open) return null;

  return (
    <div className="w-64 shrink-0 border-r border-(--color-border) bg-(--color-surface-elevated) flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
        <h2 className="text-sm font-semibold text-(--color-text-primary)">Widgets</h2>
        <button onClick={onClose} className="p-1 text-(--color-text-muted) hover:text-(--color-text-primary) rounded">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 p-3 space-y-5">
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-2">Add Widget</h3>
          <div className="space-y-1">
            {WIDGET_DEFS.map((def) => {
              const Icon = def.icon;
              return (
                <button key={def.type} onClick={() => onAdd(def.type)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left border border-transparent bg-transparent hover:bg-(--color-surface-elevated) hover:border-(--color-border) transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-grafana-blue/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-grafana-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-(--color-text-primary)">{def.label}</span>
                    <p className="text-[10px] text-(--color-text-muted) truncate">{def.description}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-grafana-blue/10 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={11} className="text-grafana-blue" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {widgets.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) mb-2">Placed Widgets</h3>
            <div className="space-y-1">
              {widgets.map((w) => {
                const def = WIDGET_DEFS.find((d) => d.type === w.widget_type);
                const Icon = def?.icon || BarChart3;
                return (
                  <div key={w.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-(--color-surface-elevated) border border-(--color-border)">
                    <div className="w-7 h-7 rounded-lg bg-grafana-blue/10 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-grafana-blue" />
                    </div>
                    <span className="text-xs font-medium text-(--color-text-primary) truncate flex-1">{w.title}</span>
                    <button onClick={() => onDelete(w.id)} className="p-1 text-(--color-text-muted) hover:text-grafana-red rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
