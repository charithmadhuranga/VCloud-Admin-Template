import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Search, Box } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

const initialContainers = [
  { Id: "c1", Names: "/vedge-stack-agent", Image: "vedge/stack-agent:latest", State: "running", Ports: "0.0.0.0:8080->8080/tcp", Created: Math.floor(Date.now() / 1000) - 3600 },
  { Id: "c2", Names: "/vedge-edgex-core-data", Image: "edgexfoundry/core-data:3.1.0", State: "running", Ports: "0.0.0.0:48080->48080/tcp", Created: Math.floor(Date.now() / 1000) - 7200 },
  { Id: "c3", Names: "/node-red", Image: "nodered/node-red:4.0.2", State: "running", Ports: "0.0.0.0:1880->1880/tcp", Created: Math.floor(Date.now() / 1000) - 14400 },
  { Id: "c4", Names: "/vedge-tunnel-agent", Image: "vedge/tunnel-agent:latest", State: "exited", Ports: "", Created: Math.floor(Date.now() / 1000) - 86400 },
];

const statusColor = (state) => {
  switch (state) {
    case "running": return "green";
    case "exited": return "gray";
    case "created": return "orange";
    default: return "red";
  }
};

function formatPorts(ports) {
  if (!ports || ports === "") return "—";
  return ports.replace(/0\.0\.0\.0:/g, "").replace(/,/g, ", ");
}

function formatCreated(ts) {
  if (!ts) return "—";
  const diff = Date.now() - ts * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Containers() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [containers] = useState(initialContainers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = containers.filter((c) => {
    const name = (c.Names || "").replace(/^\//, "");
    const image = c.Image || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || image.toLowerCase().includes(search.toLowerCase());
    if (filter === "running") return matchesSearch && c.State === "running";
    if (filter === "exited") return matchesSearch && c.State !== "running";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/devices/${deviceId}`)}>
          <ArrowLeft size={16} />
        </Button>
        <div className="flex items-center gap-2">
          <Box size={20} className="text-grafana-blue" />
          <h1 className="text-xl font-semibold text-(--color-text-primary)">Containers</h1>
        </div>
        <span className="text-sm text-(--color-text-muted)">on device</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
          <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana pl-8 pr-3 py-1.5 text-xs text-(--color-text-primary)" placeholder="Search containers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5">
          {["all", "running", "exited"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-medium rounded-grafana capitalize ${filter === f ? "bg-grafana-blue text-white" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"}`}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Box} title="No containers" description="No containers match your search" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--color-border) bg-(--color-surface-hover)">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">Image</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">Ports</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const name = (c.Names || "").replace(/^\//, "");
                  return (
                    <tr key={c.Id || name} onClick={() => navigate(`/devices/${deviceId}/containers/${encodeURIComponent(name)}`)}
                      className="border-b border-(--color-border) hover:bg-(--color-surface-hover) cursor-pointer transition-colors last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Box size={14} className="text-(--color-text-muted) shrink-0" />
                          <span className="text-(--color-text-primary) font-medium truncate max-w-[200px]">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-(--color-text-muted) text-xs truncate max-w-[250px] block">{c.Image || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={statusColor(c.State)}>{c.State || "unknown"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-(--color-text-muted) text-xs">{formatPorts(c.Ports)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-(--color-text-muted) text-xs">{formatCreated(c.Created)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
