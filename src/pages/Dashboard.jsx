import { useState } from "react";
import { Edit3, Save, X, Server, Wifi, WifiOff, Eye, EyeOff, Plus, BarChart3 } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const FLEET_WIDGETS = [
  { id: "fleet-total", title: "Total Provisioned Devices", type: "fleet", fleetType: "total", value: "247", change: "+12 this week" },
  { id: "fleet-online", title: "Online / Connected", type: "fleet", fleetType: "online", value: "203", change: "82% of total" },
  { id: "fleet-offline", title: "Offline / Disconnected", type: "fleet", fleetType: "offline", value: "44", change: "18% of total" },
];

const DEFAULT_VISIBLE = ["fleet-total", "fleet-online", "fleet-offline"];

export default function Dashboard() {
  const [editing, setEditing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState(DEFAULT_VISIBLE);

  const fleetIcons = { total: Server, online: Wifi, offline: WifiOff };
  const fleetColors = { total: "text-grafana-blue", online: "text-grafana-green", offline: "text-grafana-red" };

  const enterEditMode = () => {
    setEditing(true);
    setDrawerOpen(true);
  };

  const cancelEdit = () => {
    setVisibleWidgets(DEFAULT_VISIBLE);
    setEditing(false);
    setDrawerOpen(false);
  };

  const handleSave = () => {
    setEditing(false);
    setDrawerOpen(false);
  };

  const toggleWidget = (id, visible) => {
    if (visible) {
      setVisibleWidgets((prev) => [...prev, id]);
    } else {
      setVisibleWidgets((prev) => prev.filter((w) => w !== id));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-0 py-3 border-b border-(--color-border) shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-(--color-text-primary)">Overview</h1>
          <p className="text-sm text-(--color-text-muted)">Fleet-wide status at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save size={14} /> Save
              </Button>
              <Button variant="secondary" size="sm" onClick={cancelEdit}>
                <X size={14} /> Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={enterEditMode}>
              <Edit3 size={14} /> Edit
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Widget Drawer */}
        {drawerOpen && (
          <div className="w-64 shrink-0 border-r border-(--color-border) p-4 space-y-3 overflow-y-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">Widgets</h3>
            <div className="space-y-2">
              <p className="text-[10px] font-medium text-(--color-text-muted) uppercase tracking-wider">Fleet Stats</p>
              {FLEET_WIDGETS.map((w) => {
                const visible = visibleWidgets.includes(w.id);
                const Icon = fleetIcons[w.fleetType] || Server;
                return (
                  <label key={w.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-(--color-surface-hover) cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={() => toggleWidget(w.id, !visible)}
                      className="accent-grafana-blue"
                    />
                    <Icon size={12} className={fleetColors[w.fleetType]} />
                    <span className="text-xs text-(--color-text-primary)">{w.title}</span>
                  </label>
                );
              })}
              <p className="text-[10px] font-medium text-(--color-text-muted) uppercase tracking-wider pt-2">Analytics</p>
              <div className="px-2 py-2 text-xs text-(--color-text-muted)">
                Analytics webview widgets will appear here.
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLEET_WIDGETS.filter((w) => visibleWidgets.includes(w.id)).map((widget) => {
              const Icon = fleetIcons[widget.fleetType] || Server;
              const colorClass = fleetColors[widget.fleetType] || "text-grafana-blue";
              return (
                <Card key={widget.id} className={`p-5 ${editing ? "ring-1 ring-grafana-blue/40" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${colorClass}/10 flex items-center justify-center`}>
                      <Icon size={20} className={colorClass} />
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted)">{widget.title}</p>
                      <p className="text-2xl font-bold text-(--color-text-primary)">{widget.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-(--color-text-muted)">{widget.change}</p>
                </Card>
              );
            })}
          </div>

          {visibleWidgets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 size={48} className="text-(--color-text-muted)/30 mb-4" />
              <p className="text-(--color-text-muted) text-sm">No widgets visible</p>
              <p className="text-(--color-text-muted) text-xs mt-1">Open the widget drawer to add widgets to this dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
