import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Upload, Code2, Trash2, Eye, FileJson, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { useTheme } from "../context/ThemeContext";

const initialDevices = [
  { id: "dev-1", name: "k8s-node-01", status: "online", device_type: "device" },
  { id: "dev-2", name: "k8s-node-02", status: "online", device_type: "device" },
  { id: "dev-3", name: "k8s-node-03", status: "online", device_type: "demo" },
  { id: "dev-4", name: "db-primary-01", status: "online", device_type: "device" },
];

const initialFlows = [
  { id: "f-01", version: 12, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-03T09:42:15Z" },
  { id: "f-02", version: 8, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-03T08:30:00Z" },
  { id: "f-03", version: 11, status: "failed", flow_json: { nodes: [] }, created_at: "2026-07-02T22:15:44Z", error_log: "Invalid flow JSON" },
  { id: "f-04", version: 5, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-02T18:00:00Z" },
  { id: "f-05", version: 3, status: "pending", flow_json: { nodes: [] }, created_at: "2026-07-03T10:00:00Z" },
];

export default function Flows() {
  const { theme } = useTheme();
  const devices = initialDevices;
  const [flows, setFlows] = useState(initialFlows);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [activeTab, setActiveTab] = useState("deploy");
  const [flowJson, setFlowJson] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [viewFlow, setViewFlow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const onlineDevices = devices.filter((d) => d.status === "online");
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFlowJson(ev.target.result);
      setJsonError(null);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDeploy = async () => {
    if (!selectedDeviceId || !flowJson.trim()) return;
    setJsonError(null);
    try {
      JSON.parse(flowJson);
    } catch {
      setJsonError("Invalid JSON. Please check the syntax.");
      return;
    }
    setDeploying(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newFlow = {
      id: `f-${Date.now()}`,
      version: flows.length + 1,
      status: "deployed",
      flow_json: JSON.parse(flowJson),
      created_at: new Date().toISOString(),
    };
    setFlows((prev) => [newFlow, ...prev]);
    setFlowJson("");
    setActiveTab("history");
    setDeploying(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !selectedDeviceId) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setFlows((prev) => prev.filter((f) => f.id !== deleteTarget));
    setDeleteTarget(null);
    setDeleting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-(--color-text-primary)">Flows</h1>
      </div>
      <p className="text-sm text-(--color-text-secondary) mb-6">
        Manage Node-RED flow lifecycles on edge devices.
      </p>

      <div className="mb-6">
        <label className="block text-xs font-medium text-(--color-text-secondary) mb-1.5">
          Target Device
        </label>
        <select
          value={selectedDeviceId}
          onChange={(e) => handleDeviceChange(e.target.value)}
          className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue w-full max-w-xs"
        >
          <option value="">Select a device...</option>
          {onlineDevices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.device_type === "demo" ? "[DEMO] " : ""}{d.name} ({d.status})
            </option>
          ))}
        </select>
        {selectedDeviceId && selectedDevice && (
          <div className="mt-2">
            <Badge color="green">online</Badge>
            <span className="text-xs text-(--color-text-muted) ml-2">{selectedDevice.name}</span>
          </div>
        )}
      </div>

      <div className="border-b border-(--color-border) mb-4">
        <div className="flex gap-0">
          {["deploy", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-grafana-blue text-(--color-text-primary)"
                  : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
              }`}
            >
              {tab === "deploy" ? "Deploy Flow" : "Flow History"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "deploy" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1.5">
              Flow JSON
            </label>
            <div className="border border-(--color-border) rounded-grafana overflow-hidden">
              <Editor
                height="40vh"
                defaultLanguage="json"
                value={flowJson}
                onChange={(val) => {
                  setFlowJson(val || "");
                  setJsonError(null);
                }}
                theme={theme === "dark" ? "vs-dark" : "vs"}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  fontSize: 12,
                }}
              />
            </div>
            {jsonError && (
              <p className="text-xs text-grafana-red mt-1">{jsonError}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              Upload File
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedDeviceId || !flowJson.trim()}
              loading={deploying}
              onClick={handleDeploy}
            >
              <Code2 size={14} />
              Deploy
            </Button>
          </div>

          {!selectedDeviceId && (
            <p className="text-xs text-(--color-text-muted)">Select a device to enable deployment.</p>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div>
          {!selectedDeviceId ? (
            <EmptyState
              icon={FileJson}
              title="Select a device"
              description="Choose a device above to view its flow history."
            />
          ) : flows.length === 0 ? (
            <EmptyState
              icon={FileJson}
              title="No flows deployed"
              description="Deploy a flow to this device to see it here."
            />
          ) : (
            <div className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--color-border) text-(--color-text-muted) text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">Version</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Deployed</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="w-24 px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flows.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-hover) transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-(--color-text-primary)">
                        v{f.version}
                      </td>
                      <td className="px-4 py-3 text-(--color-text-secondary) hidden sm:table-cell">
                        {f.created_at ? new Date(f.created_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={
                            f.status === "deployed" ? "green" :
                            f.status === "failed" ? "red" :
                            "orange"
                          }
                        >
                          {f.status === "pending" ? "deploying..." : f.status}
                        </Badge>
                        {f.error_log && (
                          <span className="ml-2 text-xs text-grafana-red">{f.error_log}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewFlow(f.flow_json)}
                            className="p-1.5 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors rounded"
                            title="View flow"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(f.id)}
                            className="p-1.5 text-(--color-text-muted) hover:text-grafana-red transition-colors rounded"
                            title="Delete flow"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal
        open={!!viewFlow}
        onClose={() => setViewFlow(null)}
        title="Flow JSON"
        className="max-w-3xl"
      >
        <div className="border border-(--color-border) rounded-grafana overflow-hidden">
          <Editor
            height="400px"
            defaultLanguage="json"
            value={JSON.stringify(viewFlow, null, 2)}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              fontSize: 12,
            }}
          />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete flow snapshot"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-(--color-text-secondary)">
          Are you sure you want to delete this flow snapshot? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
