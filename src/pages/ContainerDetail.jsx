import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Box, Info, Terminal as TerminalIcon, Activity, RotateCcw, Square, Play, RefreshCw, HardDrive, Cpu, MemoryStick, Globe, Folder, Settings2 } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const initialContainer = {
  Names: "/vedge-stack-agent",
  Image: "vedge/stack-agent:latest",
  State: "running",
  Ports: "0.0.0.0:8080->8080/tcp",
  Created: Math.floor(Date.now() / 1000) - 3600,
  Id: "abc123def456",
  Config: {
    Image: "vedge/stack-agent:latest",
    Cmd: ["/bin/sh", "-c", "stack-agent --config /etc/vedge"],
    Entrypoint: null,
    WorkingDir: "/app",
    Env: ["VEDGE_MODE=production", "LOG_LEVEL=info", "API_KEY=••••••••"],
  },
  HostConfig: { RestartPolicy: { Name: "always" } },
  State: { Status: "running", Running: true, StartedAt: "2026-07-03T08:00:00Z" },
  NetworkSettings: { Ports: { "8080/tcp": [{ HostIp: "0.0.0.0", HostPort: "8080" }] } },
  Mounts: [{ Type: "bind", Source: "/data/vedge", Destination: "/etc/vedge" }],
};

const statusColor = (s) => {
  switch (s) {
    case "running": return "green";
    case "exited": return "gray";
    case "created": return "orange";
    default: return "red";
  }
};

function InspectDetail({ label, value }) {
  return (
    <div className="py-2 border-b border-(--color-border) last:border-0">
      <span className="text-xs text-(--color-text-muted) block">{label}</span>
      <span className="text-sm text-(--color-text-primary) font-mono break-all">{value ?? "—"}</span>
    </div>
  );
}

export default function ContainerDetail() {
  const { deviceId, containerName } = useParams();
  const navigate = useNavigate();
  const decodedName = containerName ? decodeURIComponent(containerName) : "";
  const [tab, setTab] = useState("info");
  const [container] = useState(initialContainer);
  const [logs] = useState("[stack-agent] Service initialized\n[stack-agent] Connected to fleet manager\n[stack-agent] Monitoring stack deployments...");
  const [stats] = useState({ CPUPerc: "2.4%", MemUsage: "128.4MiB / 512MiB", MemPerc: "25.08%", NetIO: "1.2GB / 342MB", BlockIO: "45MB / 12MB" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/devices/${deviceId}/containers`)}>
          <ArrowLeft size={16} />
        </Button>
        <Box size={20} className="text-grafana-blue" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-(--color-text-primary)">{decodedName}</h1>
            <Badge color={statusColor(container.State)}>{container.State || "unknown"}</Badge>
          </div>
          <p className="text-sm text-(--color-text-muted)">
            {container.Image} · on device
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => {}}><RotateCcw size={14} /> <span className="hidden sm:inline">Restart</span></Button>
          <Button variant="ghost" size="sm" onClick={() => {}}><Square size={14} /> <span className="hidden sm:inline">Stop</span></Button>
          <Button variant="ghost" size="sm" onClick={() => {}}><Play size={14} /> <span className="hidden sm:inline">Start</span></Button>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5 w-fit">
        {(["info", "logs", "stats", "terminal"]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-grafana capitalize transition-colors ${
              tab === t ? "bg-grafana-blue text-white" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}>
            {t === "info" && <Info size={14} />}
            {t === "logs" && <TerminalIcon size={14} />}
            {t === "stats" && <Activity size={14} />}
            {t === "terminal" && <TerminalIcon size={14} />}
            {t === "terminal" ? "Terminal" : t}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Info size={12} /> Configuration</h3>
            <InspectDetail label="ID" value={container.Id?.slice(0, 12)} />
            <InspectDetail label="Image" value={container.Config?.Image} />
            <InspectDetail label="Command" value={container.Config?.Cmd?.join(" ")} />
            <InspectDetail label="Working Dir" value={container.Config?.WorkingDir} />
            <InspectDetail label="Restart Policy" value={container.HostConfig?.RestartPolicy?.Name} />
            <InspectDetail label="Created" value={container.Created ? new Date(container.Created * 1000).toLocaleString() : null} />
            <InspectDetail label="Status" value={container.State?.Status} />
          </Card>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Globe size={12} /> Ports</h3>
              {container.NetworkSettings?.Ports ? (
                <div className="space-y-1">
                  {Object.entries(container.NetworkSettings.Ports).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 text-xs text-(--color-text-primary) font-mono">
                      <span>{key}</span>
                      <span className="text-(--color-text-muted)">→</span>
                      <span>{val ? val.map((v) => `${v.HostIp}:${v.HostPort}`).join(", ") : "—"}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-(--color-text-muted) text-xs">No ports exposed</p>}
            </Card>

            <Card className="p-4">
              <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Folder size={12} /> Mounts</h3>
              {container.Mounts?.length > 0 ? (
                <div className="space-y-2">
                  {container.Mounts.map((m, i) => (
                    <div key={i} className="text-xs">
                      <span className="text-(--color-text-muted)">{m.Type}: </span>
                      <span className="text-(--color-text-primary) font-mono">{m.Source || m.Name}</span>
                      <span className="text-(--color-text-muted)"> → </span>
                      <span className="text-(--color-text-primary) font-mono">{m.Destination}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-(--color-text-muted) text-xs">No mounts</p>}
            </Card>

            <Card className="p-4">
              <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Settings2 size={12} /> Environment</h3>
              {container.Config?.Env?.length > 0 ? (
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {container.Config.Env.map((e, i) => {
                    const [k, ...v] = e.split("=");
                    const sensitive = ["PASSWORD", "SECRET", "TOKEN", "KEY"].some((s) => k.toUpperCase().includes(s));
                    return (
                      <div key={i} className="text-xs font-mono">
                        <span className="text-(--color-text-muted)">{k}=</span>
                        <span className="text-(--color-text-primary)">{sensitive ? "••••••" : v.join("=")}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-(--color-text-muted) text-xs">No environment variables</p>}
            </Card>
          </div>
        </div>
      )}

      {tab === "logs" && (
        <Card className="p-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-(--color-border)">
            <span className="text-xs text-(--color-text-muted)">Container logs</span>
            <Button variant="ghost" size="sm" onClick={() => {}}><RefreshCw size={12} /> Refresh</Button>
          </div>
          <pre className="p-4 text-xs text-(--color-text-primary) font-mono whitespace-pre-wrap overflow-auto max-h-[600px]">{logs || "(no output)"}</pre>
        </Card>
      )}

      {tab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Cpu size={12} /> CPU</h3>
            <p className="text-2xl font-bold text-(--color-text-primary)">{stats?.CPUPerc || "—"}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><MemoryStick size={12} /> Memory</h3>
            <p className="text-2xl font-bold text-(--color-text-primary)">{stats?.MemUsage || "—"}</p>
            <p className="text-xs text-(--color-text-muted) mt-1">{stats?.MemPerc || "—"}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><Activity size={12} /> Network I/O</h3>
            <p className="text-sm font-medium text-(--color-text-primary)">{stats?.NetIO || "—"}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-3 flex items-center gap-1.5"><HardDrive size={12} /> Block I/O</h3>
            <p className="text-sm font-medium text-(--color-text-primary)">{stats?.BlockIO || "—"}</p>
          </Card>
        </div>
      )}

      {tab === "terminal" && (
        <Card className="p-6 text-center">
          <TerminalIcon size={32} className="mx-auto text-(--color-text-muted) mb-2" />
          <p className="text-sm text-(--color-text-muted)">Terminal access requires a WebSocket connection to the edge device.</p>
        </Card>
      )}
    </div>
  );
}
