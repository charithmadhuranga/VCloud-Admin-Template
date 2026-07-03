import { useState } from "react";
import { Play, Square, RotateCcw, Terminal, Save, Shield } from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Editor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";

const initialDevices = [
  { id: "dev-1", name: "k8s-node-01", status: "online", tunnel_agent_status: "online", device_type: "device" },
  { id: "dev-2", name: "k8s-node-02", status: "online", tunnel_agent_status: "online", device_type: "device" },
  { id: "dev-3", name: "k8s-node-03", status: "online", tunnel_agent_status: "error", device_type: "demo" },
  { id: "dev-4", name: "db-primary-01", status: "offline", tunnel_agent_status: "offline", device_type: "device" },
];

const statusBadgeColor = (s) => {
  switch (s) {
    case "online": return "green";
    case "offline": return "gray";
    case "error": return "red";
    default: return "orange";
  }
};

export default function Tunnel() {
  const { theme } = useTheme();
  const [devices] = useState(initialDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [logs, setLogs] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [configTab, setConfigTab] = useState("simple");
  const [simpleAddr, setSimpleAddr] = useState("tunnel.vedge.io");
  const [simplePort, setSimplePort] = useState("7000");
  const [simpleToken, setSimpleToken] = useState("");
  const [rawConfig, setRawConfig] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const tunnelStatus = selectedDevice?.tunnel_agent_status || "unknown";

  const handleAgentAction = async (action) => {
    setActionLoading(action);
    await new Promise((r) => setTimeout(r, 1000));
    setActionLoading(null);
  };

  const handleFetchLogs = async () => {
    setLogsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLogs("[tunnel-agent] Service running\n[tunnel-agent] FRP connection established\n[tunnel-agent] Tunnel active on port 7000");
    setLogsLoading(false);
  };

  const handleSaveConfig = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-(--color-text-primary)">Tunnel Management</h1>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-6">
        Manage the tunnel agent and configure FRP tunnel settings for remote UI access to edge devices.
      </p>

      {!selectedDeviceId && (
        <div className="py-16 text-center text-(--color-text-muted) text-sm">
          Select a device to manage its tunnel agent and configuration.
        </div>
      )}

      {selectedDeviceId && (
        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-grafana-purple" />
                <div>
                  <h3 className="text-sm font-semibold text-(--color-text-primary)">Tunnel Agent</h3>
                  <p className="text-xs text-(--color-text-muted)">
                    <Badge color={statusBadgeColor(tunnelStatus)}>{tunnelStatus}</Badge>
                    {" · "}Container: vedge-tunnel-agent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="sm"
                  loading={logsLoading}
                  onClick={handleFetchLogs}
                  title="Fetch Logs"
                >
                  <Terminal size={14} />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  loading={actionLoading === "restart"}
                  onClick={() => handleAgentAction("restart")}
                  title="Restart"
                >
                  <RotateCcw size={14} />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  loading={actionLoading === "stop"}
                  onClick={() => handleAgentAction("stop")}
                  title="Stop"
                >
                  <Square size={14} />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  loading={actionLoading === "start"}
                  onClick={() => handleAgentAction("start")}
                  title="Start"
                >
                  <Play size={14} />
                </Button>
              </div>
            </div>

            {logs !== null && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => setLogs(null)}
                    className="text-xs text-grafana-blue hover:underline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleFetchLogs}
                    className="text-xs text-grafana-blue hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                <pre className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-4 py-3 text-xs text-(--color-text-primary) font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
                  {logs || "(no output yet — request sent to edge device)"}
                </pre>
              </div>
            )}
          </Card>

          {selectedDeviceId && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-grafana-purple" />
                  <div>
                    <h3 className="text-sm font-semibold text-(--color-text-primary)">Tunnel Configuration</h3>
                    <p className="text-xs text-(--color-text-muted)">
                      FRP tunnel settings for remote UI access
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-(--color-border) mb-3">
                <div className="flex gap-0">
                  <button
                    onClick={() => setConfigTab("simple")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      configTab === "simple"
                        ? "border-grafana-blue text-(--color-text-primary)"
                        : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setConfigTab("raw")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      configTab === "raw"
                        ? "border-grafana-blue text-(--color-text-primary)"
                        : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }`}
                  >
                    Raw TOML
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-3 text-xs text-grafana-green bg-grafana-green/10 px-3 py-2 rounded-grafana">
                  Configuration saved and sent to device.
                </div>
              )}

              {configTab === "simple" ? (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Server Address</label>
                    <input
                      type="text"
                      value={simpleAddr}
                      onChange={(e) => setSimpleAddr(e.target.value)}
                      placeholder="vedge.yourdomain.com"
                      className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Server Port</label>
                    <input
                      type="text"
                      value={simplePort}
                      onChange={(e) => setSimplePort(e.target.value)}
                      placeholder="7000"
                      className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Token</label>
                    <input
                      type="password"
                      value={simpleToken}
                      onChange={(e) => setSimpleToken(e.target.value)}
                      placeholder="Shared secret token"
                      className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-(--color-border) rounded-grafana overflow-hidden">
                  <Editor
                    height="300px"
                    defaultLanguage="ini"
                    value={rawConfig}
                    onChange={(val) => setRawConfig(val || "")}
                    theme={theme === "dark" ? "vs-dark" : "vs"}
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      fontSize: 12,
                      tabSize: 2,
                    }}
                  />
                </div>
              )}

              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={handleSaveConfig}>
                  <Save size={14} />
                  Save Configuration
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
