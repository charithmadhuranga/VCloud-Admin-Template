import { useState } from "react";
import { useNavigate } from "react-router";
import { BarChart3, Copy, Trash2, Search, Layout, MoreHorizontal, Plus } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";

const mockDevices = [
  { id: "dev-1", name: "k8s-node-01", status: "online", device_type: "device" },
  { id: "dev-2", name: "k8s-node-02", status: "online", device_type: "device" },
  { id: "dev-3", name: "k8s-node-03", status: "online", device_type: "demo" },
  { id: "dev-4", name: "db-primary-01", status: "online", device_type: "device" },
  { id: "dev-5", name: "gw-01", status: "offline", device_type: "device" },
];

const initialDashboards = [
  { id: "db-1", name: "Fleet Overview", description: "High-level fleet metrics", widget_count: 6, created_at: "2026-06-15", device_ids: ["dev-1", "dev-2", "dev-3"] },
  { id: "db-2", name: "Device Performance", description: "Per-device CPU, memory, disk", widget_count: 4, created_at: "2026-06-18", device_ids: ["dev-1", "dev-2"] },
  { id: "db-3", name: "Network Latency", description: "P99/P50 latency across regions", widget_count: 3, created_at: "2026-06-20" },
  { id: "db-4", name: "Container Health", description: "Container status and resource usage", widget_count: 5, created_at: "2026-06-22", device_ids: ["dev-1"] },
];

export default function Analytics() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [search, setSearch] = useState("");
  const [actionMenuId, setActionMenuId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);

  const filtered = dashboards.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    const db = {
      id: `db-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || undefined,
      widget_count: 0,
      created_at: new Date().toISOString().slice(0, 10),
      device_ids: selectedDeviceIds.length > 0 ? selectedDeviceIds : undefined,
    };
    setDashboards((prev) => [...prev, db]);
    setNewName("");
    setNewDesc("");
    setSelectedDeviceIds([]);
    setShowCreate(false);
  };

  const toggleDevice = (id) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleDuplicate = (id) => {
    const orig = dashboards.find((d) => d.id === id);
    if (!orig) return;
    const clone = { ...orig, id: `db-${Date.now()}`, name: `${orig.name} (copy)`, created_at: new Date().toISOString().slice(0, 10) };
    setDashboards((prev) => [...prev, clone]);
  };

  const handleDelete = (id) => {
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-(--color-text-primary)">Dashboards</h1>
          <p className="text-sm text-(--color-text-muted) mt-1">
            Create and manage your analytics dashboards
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> New Dashboard
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue"
          placeholder="Search dashboards..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title={search ? "No matching dashboards" : "No dashboards yet"}
          description={
            search
              ? "Try a different search term"
              : "Create your first dashboard to get started"
          }
          action={
            !search ? (
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus size={14} /> New Dashboard
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DashboardCard
              key={d.id}
              dashboard={d}
              onOpen={() => navigate(`/analytics/${d.id}`)}
              onDuplicate={() => handleDuplicate(d.id)}
              onDelete={() => handleDelete(d.id)}
              actionOpen={actionMenuId === d.id}
              onToggleAction={() =>
                setActionMenuId(actionMenuId === d.id ? null : d.id)
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Dashboard"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="My Dashboard"
              className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Description (optional)</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What is this dashboard for?"
              rows={3}
              className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Devices</label>
            <div className="text-xs text-(--color-text-muted) mb-2">
              Choose which devices to scope this dashboard to. Leave empty for all devices.
            </div>
            <div className="max-h-40 overflow-y-auto border border-(--color-border) rounded-grafana bg-(--color-surface-elevated)">
              {mockDevices.length === 0 ? (
                <div className="px-3 py-2 text-xs text-(--color-text-muted)">No devices available</div>
              ) : (
                mockDevices.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 px-3 py-1.5 text-sm text-(--color-text-primary) hover:bg-(--color-surface-hover) cursor-pointer">
                    <input type="checkbox" checked={selectedDeviceIds.includes(d.id)} onChange={() => toggleDevice(d.id)} className="accent-grafana-blue" />
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${d.status === "online" ? "bg-grafana-green" : d.status === "error" ? "bg-grafana-red" : "bg-(--color-text-muted)"}`} />
                      <span className="truncate">{d.name || d.id}</span>
                      {d.device_type === "demo" && <Badge color="orange">demo</Badge>}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DashboardCard({
  dashboard,
  onOpen,
  onDuplicate,
  onDelete,
  actionOpen,
  onToggleAction,
}) {
  return (
    <Card hover className="p-4" onClick={onOpen}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-grafana-blue/10 flex items-center justify-center shrink-0">
            <Layout size={16} className="text-grafana-blue" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-(--color-text-primary) truncate">
              {dashboard.name}
            </h3>
            {dashboard.description && (
              <p className="text-xs text-(--color-text-muted) truncate mt-0.5">
                {dashboard.description}
              </p>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAction();
            }}
            className="p-1 text-(--color-text-muted) hover:text-(--color-text-primary) rounded"
          >
            <MoreHorizontal size={14} />
          </button>
          {actionOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-(--color-surface-elevated) border border-(--color-border) rounded-md shadow-lg py-1 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                  onToggleAction();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-(--color-text-primary) hover:bg-(--color-surface-hover) flex items-center gap-2"
              >
                <Copy size={12} />
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  onToggleAction();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-(--color-text-primary) hover:bg-(--color-surface-hover) flex items-center gap-2"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-(--color-text-muted)">
        <span>{dashboard.widget_count || 0} widgets</span>
        {dashboard.created_at && (
          <span>{new Date(dashboard.created_at).toLocaleDateString()}</span>
        )}
      </div>
    </Card>
  );
}
