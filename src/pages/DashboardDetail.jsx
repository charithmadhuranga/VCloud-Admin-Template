import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit3, Trash2, Copy, Layout, Monitor, Plus } from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import DashboardCanvas from "../components/widgets/DashboardCanvas";
import AnalyticsWidgetDrawer from "../components/widgets/AnalyticsWidgetDrawer";
import WidgetConfigPanel from "../components/widgets/WidgetConfigPanel";

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

const mockDashboards = {
  "db-1": {
    id: "db-1", name: "Fleet Overview", description: "High-level fleet metrics",
    widget_count: 6, created_at: "2026-06-15", device_ids: ["dev-1", "dev-2"],
    widgets: [
      { id: "w-1", widget_type: "stat", title: "Active Devices", position: { x: 0, y: 0, w: 2, h: 1 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { unit: "", decimals: 0, prefix: "" } },
      { id: "w-2", widget_type: "time_series", title: "CPU Usage", position: { x: 2, y: 0, w: 5, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { color: "#4f8cff", unit: "%" } },
      { id: "w-3", widget_type: "bar", title: "Deployments by Region", position: { x: 7, y: 0, w: 5, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { color: "#73bf69" } },
      { id: "w-4", widget_type: "pie", title: "Device Status", position: { x: 0, y: 1, w: 4, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { donut: true } },
      { id: "w-5", widget_type: "gauge", title: "System Health", position: { x: 4, y: 1, w: 3, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { unit: "%" } },
      { id: "w-6", widget_type: "stat", title: "Alerts", position: { x: 0, y: 2, w: 2, h: 1 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { unit: "", decimals: 0, prefix: "", color: "#f2495c" } },
    ],
  },
  "db-2": {
    id: "db-2", name: "Device Performance", description: "Per-device CPU, memory, disk",
    widget_count: 4, created_at: "2026-06-18", device_ids: [],
    widgets: [
      { id: "w-7", widget_type: "stat", title: "Avg CPU", position: { x: 0, y: 0, w: 2, h: 1 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: {} },
      { id: "w-8", widget_type: "stat", title: "Avg Memory", position: { x: 2, y: 0, w: 2, h: 1 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: {} },
      { id: "w-9", widget_type: "time_series", title: "Memory Over Time", position: { x: 4, y: 0, w: 8, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: {} },
      { id: "w-10", widget_type: "bar", title: "Disk Usage by Device", position: { x: 0, y: 1, w: 12, h: 2 }, source: "clickhouse", data_config: { clickhouse: null, realtime: null }, visual_config: { stacked: true } },
    ],
  },
};

export default function DashboardDetail() {
  const { dashboardId } = useParams();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const db = mockDashboards[dashboardId] || {
      id: dashboardId, name: "Unknown Dashboard", description: "", widget_count: 0, created_at: new Date().toISOString().slice(0, 10), device_ids: [], widgets: [],
    };
    setDashboard(db);
  }, [dashboardId]);

  useEffect(() => {
    if (dashboard) {
      setEditName(dashboard.name);
      setEditDescription(dashboard.description || "");
    }
  }, [dashboard?.id]);

  if (!dashboard) return null;

  const isEmpty = dashboard.widgets.length === 0;
  const deviceIds = dashboard.device_ids;
  const deviceScopeLabel = deviceIds && deviceIds.length > 0
    ? `${deviceIds.length} device${deviceIds.length > 1 ? "s" : ""}`
    : "All devices";

  const enterEditMode = () => { setEditing(true); setDrawerOpen(true); };
  const cancelEdit = () => {
    setEditing(false); setDrawerOpen(false); setSelectedWidget(null);
    setEditName(dashboard.name);
    setEditDescription(dashboard.description || "");
  };

  const handleSave = () => {
    setDashboard((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      description: editDescription.trim() || prev.description,
    }));
    setEditing(false);
    setDrawerOpen(false);
    setSelectedWidget(null);
  };

  const handleDuplicate = () => {
    const clone = { ...dashboard, id: `db-${Date.now()}`, name: `${dashboard.name} (copy)`, created_at: new Date().toISOString().slice(0, 10) };
    navigate(`/analytics/${clone.id}`);
  };

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `w-${Date.now()}`,
      widget_type: widgetType,
      title: WIDGET_LABELS[widgetType] || widgetType,
      position: { x: 0, y: 0, w: 3, h: 2 },
      source: "clickhouse",
      data_config: { clickhouse: null, realtime: null },
      visual_config: {},
    };
    setDashboard((prev) => ({ ...prev, widgets: [...prev.widgets, newWidget], widget_count: prev.widget_count + 1 }));
  };

  const handleUpdateWidget = (updates) => {
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => w.id === selectedWidget?.id ? { ...w, ...updates } : w),
    }));
  };

  const handleDeleteWidget = () => {
    if (!selectedWidget) return;
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== selectedWidget.id),
      widget_count: prev.widget_count - 1,
    }));
    setSelectedWidget(null);
  };

  const handleDeleteDashboard = () => {
    navigate("/analytics");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 px-6 py-3 border-b border-(--color-border) shrink-0">
        <button onClick={() => navigate("/analytics")} className="p-1.5 text-(--color-text-muted) hover:text-(--color-text-primary) rounded-md hover:bg-(--color-surface-hover) transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-1">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-transparent text-base font-semibold text-(--color-text-primary) border-b border-(--color-border)/50 focus:border-grafana-blue outline-none pb-0.5" placeholder="Dashboard name" />
              <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-transparent text-xs text-(--color-text-muted) border-b border-(--color-border)/50 focus:border-grafana-blue outline-none pb-0.5" placeholder="Add a description (optional)" />
            </div>
          ) : (
            <>
              <h1 className="text-base font-semibold text-(--color-text-primary) truncate">{dashboard.name}</h1>
              {dashboard.description && <p className="text-xs text-(--color-text-muted) truncate">{dashboard.description}</p>}
              <div className="flex items-center gap-1 mt-1">
                <Monitor size={10} className="text-(--color-text-muted)" />
                <span className="text-[10px] text-(--color-text-muted)">{deviceScopeLabel}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={enterEditMode}><Edit3 size={14} /> Edit</Button>
              <Button variant="secondary" size="sm" onClick={handleDuplicate}><Copy size={14} /></Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}><Trash2 size={14} /></Button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnalyticsWidgetDrawer
          open={drawerOpen}
          widgets={dashboard.widgets}
          onAdd={handleAddWidget}
          onDelete={handleDeleteWidget}
          onClose={() => setDrawerOpen(false)}
        />

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-grafana-blue/10 flex items-center justify-center mb-4">
              <Layout size={24} className="text-grafana-blue" />
            </div>
            <h2 className="text-lg font-semibold text-(--color-text-primary) mb-2">
              {editing ? "Start building your dashboard" : "Empty Dashboard"}
            </h2>
            <p className="text-sm text-(--color-text-muted) max-w-md mb-6">
              {editing
                ? "Add widgets to visualize your data using ClickHouse queries or real-time streams."
                : "Switch to edit mode to add and arrange widgets."}
            </p>
            {editing && (
              <Button variant="primary" size="sm" onClick={() => handleAddWidget("stat")}>
                <Plus size={14} /> Add Your First Widget
              </Button>
            )}
          </div>
        ) : (
          <DashboardCanvas
            widgets={dashboard.widgets}
            editing={editing}
            onSelectWidget={setSelectedWidget}
          />
        )}

        {selectedWidget && (
          <WidgetConfigPanel
            widget={selectedWidget}
            onSave={handleUpdateWidget}
            onDelete={handleDeleteWidget}
            onClose={() => setSelectedWidget(null)}
          />
        )}
      </div>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Dashboard"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button size="sm" className="bg-grafana-red hover:bg-red-600" onClick={handleDeleteDashboard}>Delete</Button>
          </>
        }>
        <p className="text-sm text-(--color-text-secondary)">Are you sure you want to delete "{dashboard.name}"? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
