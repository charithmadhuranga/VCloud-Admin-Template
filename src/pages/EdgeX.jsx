import { useState, useRef, useEffect, useCallback } from "react";
import {
  Server, Cpu, HardDrive, Activity, RefreshCw, FileText, Plus,
  Database, Crosshair, Eye, Edit3, Trash2, Play, Square,
  Terminal, ExternalLink, Upload, Code2, FileJson,
  Shield, RotateCcw, Save,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import DeviceSelector from "../components/DeviceSelector";
import { useTheme } from "../context/ThemeContext";

const TABS = [
  { key: "services", label: "Services", icon: Server },
  { key: "profiles", label: "Device Profiles", icon: FileText },
  { key: "devices", label: "Devices", icon: Cpu },
  { key: "device-services", label: "Device Services", icon: HardDrive },
  { key: "provision-watchers", label: "Provision Watchers", icon: Crosshair },
  { key: "core-data", label: "Core Data", icon: Database },
  { key: "nodered", label: "Node-RED", icon: Activity },
  { key: "tunnel", label: "Tunnel", icon: Shield },
];

const SERVICE_STATUS_COLOR = { running: "green", unreachable: "red", not_configured: "gray" };

const initialDevices = [
  { id: "dev-1", name: "k8s-node-01", status: "online", edgex_agent_status: "online", device_type: "device" },
  { id: "dev-2", name: "k8s-node-02", status: "online", edgex_agent_status: "online", device_type: "device" },
  { id: "dev-3", name: "k8s-node-03", status: "online", edgex_agent_status: "online", device_type: "demo" },
];

const initialServices = [
  { service: "core-data", health: "running", type: "core", url: "http://localhost:48080" },
  { service: "core-metadata", health: "running", type: "core", url: "http://localhost:48081" },
  { service: "core-command", health: "running", type: "core", url: "http://localhost:48082" },
  { service: "support-notifications", health: "running", type: "core", url: "http://localhost:48086" },
  { service: "device-rest", health: "running", type: "device", url: "http://localhost:59996" },
  { service: "device-virtual", health: "running", type: "device", url: "http://localhost:59997" },
  { service: "app-mqtt-export", health: "running", type: "app", url: "http://localhost:59710" },
];

const initialProfiles = [
  { name: "Random-Boolean-Device", description: "Example boolean device", manufacturer: "IOTech", model: "V1" },
  { name: "Random-Integer-Device", description: "Example integer device", manufacturer: "IOTech", model: "V1" },
];

const initialEdgeDevices = [
  { name: "Random-Boolean-Device-01", profile_name: "Random-Boolean-Device", service_name: "device-rest", admin_state: "unlocked", operating_state: "up" },
  { name: "Random-Integer-Device-01", profile_name: "Random-Integer-Device", service_name: "device-rest", admin_state: "unlocked", operating_state: "up" },
];

const initialDeviceSvcList = [
  { name: "device-rest", description: "REST Device Service", baseAddress: "http://localhost:59986" },
  { name: "device-virtual", description: "Virtual Device Service", baseAddress: "http://localhost:59987" },
];

const initialProvisionWatchers = [
  { name: "REST-Watcher", service_name: "device-rest", profile_name: "Random-Boolean-Device", identifiers: { MAC: "00-11-22-33-44-55" } },
];

const initialReadings = [
  { resourceName: "temperature", valueType: "Float32", value: "24.5" },
  { resourceName: "humidity", valueType: "Float32", value: "62.1" },
  { resourceName: "switch", valueType: "Bool", value: "true" },
];

const initialFlows = [
  { id: "f-01", version: 12, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-03T09:42:15Z" },
  { id: "f-02", version: 8, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-03T08:30:00Z" },
  { id: "f-03", version: 11, status: "failed", flow_json: { nodes: [] }, created_at: "2026-07-02T22:15:44Z", error_log: "Invalid flow JSON" },
  { id: "f-04", version: 5, status: "deployed", flow_json: { nodes: [] }, created_at: "2026-07-02T18:00:00Z" },
  { id: "f-05", version: 3, status: "pending", flow_json: { nodes: [] }, created_at: "2026-07-03T10:00:00Z" },
];

function ServiceCard({ svc, acting, onStart, onStop, onRestart, onLogs }) {
  const svcName = svc.service || "unknown";
  const health = svc.health || "unknown";
  const svcType = svc.type || "core";
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-(--color-text-secondary)" />
          <span className="text-sm font-medium text-(--color-text-primary)">{svcName}</span>
          <Badge color={SERVICE_STATUS_COLOR[health] || "orange"}>{health}</Badge>
          <Badge color={svcType === "core" ? "blue" : svcType === "device" ? "gray" : "purple"}>{svcType}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onStart(svcName)} title="Start" disabled={acting}><Play size={12} /></Button>
          <Button variant="ghost" size="sm" onClick={() => onStop(svcName)} title="Stop" disabled={acting}><Square size={12} /></Button>
          <Button variant="ghost" size="sm" onClick={() => onRestart(svcName)} title="Restart" disabled={acting}><RefreshCw size={12} /></Button>
          <Button variant="ghost" size="sm" onClick={() => onLogs(svcName)} title="Logs" disabled={acting}><Terminal size={12} /></Button>
        </div>
      </div>
      {svc.url && svc.url !== "http://:0" && <p className="text-xs text-(--color-text-secondary) truncate">{svc.url}</p>}
      <p className="text-xs text-(--color-text-secondary) truncate font-mono">vedge-edgex-{svcName}</p>
    </Card>
  );
}

function ProfileCard({ profile, onView, onEdit, onDelete }) {
  const name = profile.name || "unnamed";
  const desc = profile.description || "";
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="text-(--color-text-secondary) shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--color-text-primary) truncate">{name}</p>
            {desc && <p className="text-xs text-(--color-text-secondary) truncate">{desc}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={onView} title="View details"><Eye size={14} /></Button>
          {onEdit && <Button variant="ghost" size="sm" onClick={onEdit} title="Edit"><Edit3 size={14} /></Button>}
          <Button variant="ghost" size="sm" onClick={onDelete} title="Delete"><Trash2 size={14} className="text-grafana-red" /></Button>
        </div>
      </div>
    </Card>
  );
}

function DeviceCard({ device, onView, onEdit, onDelete }) {
  const name = device.name || "unnamed";
  const profileName = device.profile_name || "";
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu size={16} className="text-(--color-text-secondary) shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--color-text-primary) truncate">{name}</p>
            <p className="text-xs text-(--color-text-secondary) truncate">{profileName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={onView} title="View"><Eye size={14} /></Button>
          {onEdit && <Button variant="ghost" size="sm" onClick={onEdit} title="Edit"><Edit3 size={14} /></Button>}
          <Button variant="ghost" size="sm" onClick={onDelete} title="Delete"><Trash2 size={14} className="text-grafana-red" /></Button>
        </div>
      </div>
    </Card>
  );
}

function DeviceServiceCard({ svc, onEdit, onDelete }) {
  const name = svc.name || "unnamed";
  const desc = svc.description || "";
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <HardDrive size={16} className="text-(--color-text-secondary) shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--color-text-primary) truncate">{name}</p>
            {desc && <p className="text-xs text-(--color-text-secondary) truncate">{desc}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && <Button variant="ghost" size="sm" onClick={onEdit} title="Edit"><Edit3 size={14} /></Button>}
          <Button variant="ghost" size="sm" onClick={onDelete} title="Delete"><Trash2 size={14} className="text-grafana-red" /></Button>
        </div>
      </div>
    </Card>
  );
}

function ProvisionWatcherCard({ pw, onEdit, onDelete }) {
  const name = pw.name || "unnamed";
  const identifiers = pw.identifiers ? Object.entries(pw.identifiers).map(([k, v]) => `${k}:${v}`).join(", ") : "";
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Crosshair size={16} className="text-(--color-text-secondary) shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--color-text-primary) truncate">{name}</p>
            {identifiers && <p className="text-xs text-(--color-text-secondary) truncate">{identifiers}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && <Button variant="ghost" size="sm" onClick={onEdit} title="Edit"><Edit3 size={14} /></Button>}
          <Button variant="ghost" size="sm" onClick={onDelete} title="Delete"><Trash2 size={14} className="text-grafana-red" /></Button>
        </div>
      </div>
    </Card>
  );
}

function ProfileDetailPanel({ profile, onBack }) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-(--color-text-primary) mb-2">{profile.name}</h3>
        <dl className="space-y-2 text-xs">
          {Object.entries(profile).map(([k, v]) => (
            <div key={k} className="flex">
              <dt className="text-(--color-text-muted) w-32 shrink-0">{k}</dt>
              <dd className="text-(--color-text-primary)">{v != null ? String(v) : "—"}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}

function DeviceDetailPanel({ device }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-(--color-text-primary) mb-2">{device.name}</h3>
      <dl className="space-y-2 text-xs">
        {Object.entries(device).map(([k, v]) => (
          <div key={k} className="flex">
            <dt className="text-(--color-text-muted) w-32 shrink-0">{k}</dt>
            <dd className="text-(--color-text-primary)">{v != null ? String(v) : "—"}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={onConfirm} className="bg-grafana-red hover:bg-red-600">Delete</Button>
        </>
      }>
      <p className="text-sm text-(--color-text-secondary)">{message}</p>
    </Modal>
  );
}

export default function EdgeX() {
  const [devices] = useState(initialDevices);
  const [activeTab, setActiveTab] = useState("services");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [addError, setAddError] = useState(null);

  const [services] = useState(initialServices);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [edgeDevices, setEdgeDevices] = useState(initialEdgeDevices);
  const [provisionWatchers, setProvisionWatchers] = useState(initialProvisionWatchers);
  const [deviceSvcList] = useState(initialDeviceSvcList);
  const [readings] = useState(initialReadings);

  const [viewProfile, setViewProfile] = useState(null);
  const [viewDevice, setViewDevice] = useState(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddPW, setShowAddPW] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editSvc, setEditSvc] = useState(null);

  const [newProfileName, setNewProfileName] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceProfile, setNewDeviceProfile] = useState("");
  const [newPWName, setNewPWName] = useState("");
  const [newPWSvc, setNewPWSvc] = useState("");
  const [newPWProfile, setNewPWProfile] = useState("");
  const [newPWIdentifiers, setNewPWIdentifiers] = useState("");

  const [logs, setLogs] = useState(null);
  const [showLogs, setShowLogs] = useState(null);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const onlineDevices = devices.filter((d) => d.edgex_agent_status === "online");

  const profileNames = profiles.map((p) => p.name).filter(Boolean);
  const deviceServiceNames = deviceSvcList.map((s) => s.name).filter(Boolean);

  const handleDeployProfile = () => {
    if (!newProfileName.trim()) return;
    setProfiles((prev) => [...prev, { name: newProfileName.trim(), description: "", manufacturer: "", model: "" }]);
    setNewProfileName("");
    setShowAddProfile(false);
  };

  const handleDeleteProfile = () => {
    if (!deleteConfirm || deleteConfirm.kind !== "profile") return;
    setProfiles((prev) => prev.filter((p) => p.name !== deleteConfirm.name));
    setDeleteConfirm(null);
  };

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) return;
    setEdgeDevices((prev) => [...prev, { name: newDeviceName.trim(), profile_name: newDeviceProfile || "none", service_name: "device-rest", admin_state: "unlocked", operating_state: "up" }]);
    setNewDeviceName("");
    setNewDeviceProfile("");
    setShowAddDevice(false);
  };

  const handleDeleteDevice = () => {
    if (!deleteConfirm || deleteConfirm.kind !== "device") return;
    setEdgeDevices((prev) => prev.filter((d) => d.name !== deleteConfirm.name));
    setDeleteConfirm(null);
  };

  const handleAddPW = () => {
    if (!newPWName.trim()) return;
    setProvisionWatchers((prev) => [...prev, { name: newPWName.trim(), service_name: newPWSvc || "device-rest", profile_name: newPWProfile || "none", identifiers: { MAC: newPWIdentifiers || "00-00-00-00-00-00" } }]);
    setNewPWName("");
    setNewPWSvc("");
    setNewPWProfile("");
    setNewPWIdentifiers("");
    setShowAddPW(false);
  };

  const handleDeletePW = () => {
    if (!deleteConfirm || deleteConfirm.kind !== "pw") return;
    setProvisionWatchers((prev) => prev.filter((p) => p.name !== deleteConfirm.name));
    setDeleteConfirm(null);
  };

  const handleDeleteSvc = () => {
    if (!deleteConfirm || deleteConfirm.kind !== "svc") return;
    setDeleteConfirm(null);
  };

  const handleServiceAction = async () => {
    setActing(true);
    await new Promise((r) => setTimeout(r, 800));
    setActing(false);
  };

  const handleLogs = (svcName) => {
    setLogs(`[vedge-edgex-${svcName}] Service status: running\n[vedge-edgex-${svcName}] Container healthy\n[vedge-edgex-${svcName}] API ready on port`);
    setShowLogs(svcName);
  };

  /* --- Flows (Node-RED) state & handlers --- */
  const { theme } = useTheme();
  const [flows, setFlows] = useState(initialFlows);
  const [flowJson, setFlowJson] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState("");
  const [viewFlow, setViewFlow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snapError, setSnapError] = useState(null);
  const [containerStatus, setContainerStatus] = useState("running");
  const [containerActing, setContainerActing] = useState(false);
  const [containerErr, setContainerErr] = useState(null);
  const [nodeRedLogs, setNodeRedLogs] = useState(null);
  const [showNodeRedLogs, setShowNodeRedLogs] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setFlowJson(ev.target.result); setJsonError(null); };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDeploy = async () => {
    if (!selectedDeviceId || !flowJson.trim()) return;
    setJsonError(null); setDeployMsg("");
    try { JSON.parse(flowJson); } catch { setJsonError("Invalid JSON. Please check the syntax."); return; }
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
    setDeployMsg(`Deployed v${newFlow.version}`);
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

  const handleNodeRedLogs = () => {
    setNodeRedLogs(`[vedge-edgex-nodered] Container healthy\n[vedge-edgex-nodered] Node-RED v4.1 running\n[vedge-edgex-nodered] Port 1880 ready\n[vedge-edgex-nodered] API healthy on /api`);
    setShowNodeRedLogs(true);
  };
  /* --- end flows state --- */

  /* --- Tunnel state & handlers --- */
  const [tunnelLogs, setTunnelLogs] = useState(null);
  const [tunnelLogsLoading, setTunnelLogsLoading] = useState(false);
  const [tunnelActionLoading, setTunnelActionLoading] = useState(null);
  const [tunnelConfigTab, setTunnelConfigTab] = useState("simple");
  const [tunnelSimpleAddr, setTunnelSimpleAddr] = useState("tunnel.vedge.io");
  const [tunnelSimplePort, setTunnelSimplePort] = useState("7000");
  const [tunnelSimpleToken, setTunnelSimpleToken] = useState("");
  const [tunnelRawConfig, setTunnelRawConfig] = useState("");
  const [tunnelSaveSuccess, setTunnelSaveSuccess] = useState(false);

  const tunnelStatus = selectedDevice?.tunnel_agent_status || "unknown";
  const tunnelStatusBadgeColor = (s) => {
    switch (s) {
      case "online": return "green";
      case "offline": return "gray";
      case "error": return "red";
      default: return "orange";
    }
  };

  const handleTunnelAgentAction = async (action) => {
    setTunnelActionLoading(action);
    await new Promise((r) => setTimeout(r, 1000));
    setTunnelActionLoading(null);
  };

  const handleTunnelFetchLogs = async () => {
    setTunnelLogsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setTunnelLogs("[tunnel-agent] Service running\n[tunnel-agent] FRP connection established\n[tunnel-agent] Tunnel active on port 7000");
    setTunnelLogsLoading(false);
  };

  const handleTunnelSaveConfig = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setTunnelSaveSuccess(true);
    setTimeout(() => setTunnelSaveSuccess(false), 3000);
  };
  /* --- end tunnel state --- */

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-(--color-text-primary)">EdgeX Management</h1>
        <div className="flex items-center gap-3">
          <DeviceSelector
            devices={devices}
            value={selectedDeviceId}
            onChange={(id) => { setSelectedDeviceId(id); setViewProfile(null); setViewDevice(null); }}
            placeholder="Select a device..."
            className="w-64"
          />
          {selectedDeviceId && (
            <Button variant="ghost" size="sm" onClick={() => {}} loading={loading}><RefreshCw size={14} /></Button>
          )}
        </div>
      </div>

      {addError && (
        <div className="text-xs text-grafana-red bg-grafana-red/10 px-3 py-2 rounded-grafana">
          {addError}
        </div>
      )}

      {!selectedDeviceId && (
        <Card className="p-8 text-center text-(--color-text-muted)">
          <Activity size={32} className="mx-auto mb-2" />
          <p>Select a device to manage its EdgeX stack</p>
        </Card>
      )}

      {selectedDeviceId && (
        <>
          <div className="flex gap-1 border-b border-(--color-border) overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setViewProfile(null); setViewDevice(null); }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-grafana-blue text-grafana-blue"
                      : "border-transparent text-(--color-text-muted) hover:text-(--color-text-primary)"
                  }`}>
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "services" && (
            <div className="space-y-6">
              <p className="text-xs text-(--color-text-muted)">EdgeX services for {selectedDevice?.name || selectedDeviceId}</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Core Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.filter((s) => (s.service || "").startsWith("core-") || (s.service || "").startsWith("support-")).map((svc, i) => (
                      <ServiceCard key={i} svc={svc} acting={acting} onStart={handleServiceAction} onStop={handleServiceAction} onRestart={handleServiceAction} onLogs={handleLogs} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Application Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.filter((s) => (s.service || "").startsWith("app-")).map((svc, i) => (
                      <ServiceCard key={i} svc={svc} acting={acting} onStart={handleServiceAction} onStop={handleServiceAction} onRestart={handleServiceAction} onLogs={handleLogs} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Device Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.filter((s) => (s.service || "").startsWith("device-")).map((svc, i) => (
                      <ServiceCard key={i} svc={svc} acting={acting} onStart={handleServiceAction} onStop={handleServiceAction} onRestart={handleServiceAction} onLogs={handleLogs} />
                    ))}
                  </div>
                </div>
              </div>
              {showLogs && logs && (
                <Card className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-(--color-text-primary)">Logs: {showLogs}</span>
                    <button onClick={() => { setShowLogs(null); setLogs(null); }} className="text-xs text-grafana-blue hover:underline">Close</button>
                  </div>
                  <pre className="text-xs text-(--color-text-primary) font-mono whitespace-pre-wrap max-h-40 overflow-auto">{logs}</pre>
                </Card>
              )}
            </div>
          )}

          {activeTab === "profiles" && (
            viewProfile ? (
              <ProfileDetailPanel profile={viewProfile} onBack={() => setViewProfile(null)} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-(--color-text-muted)">Device profiles on {selectedDevice?.name || selectedDeviceId}</p>
                  <Button variant="primary" size="sm" onClick={() => setShowAddProfile(true)}><Plus size={14} /> Deploy Profile</Button>
                </div>
                {profiles.length === 0 ? (
                  <Card className="p-6 text-center text-(--color-text-muted)"><FileText size={24} className="mx-auto mb-2" /><p>No device profiles deployed</p></Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profiles.map((profile, i) => (
                      <ProfileCard key={i} profile={profile}
                        onView={() => setViewProfile(profile)}
                        onEdit={() => {}}
                        onDelete={() => setDeleteConfirm({ kind: "profile", name: profile.name })} />
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {activeTab === "devices" && (
            viewDevice ? (
              <DeviceDetailPanel device={viewDevice} />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-(--color-text-muted)">EdgeX devices on {selectedDevice?.name || selectedDeviceId}</p>
                  <Button variant="primary" size="sm" onClick={() => setShowAddDevice(true)}><Plus size={14} /> Add Device</Button>
                </div>
                {edgeDevices.length === 0 ? (
                  <Card className="p-6 text-center text-(--color-text-muted)"><Cpu size={24} className="mx-auto mb-2" /><p>No devices registered in EdgeX</p></Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {edgeDevices.map((d, i) => (
                      <DeviceCard key={i} device={d}
                        onView={() => setViewDevice(d)}
                        onEdit={() => {}}
                        onDelete={() => setDeleteConfirm({ kind: "device", name: d.name })} />
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {activeTab === "device-services" && (
            <div className="space-y-4">
              <p className="text-xs text-(--color-text-muted)">Device services manage protocol connectivity.</p>
              {deviceSvcList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Existing Device Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {deviceSvcList.map((svc, i) => (
                      <DeviceServiceCard key={i} svc={svc}
                        onEdit={() => setEditSvc(svc)}
                        onDelete={() => setDeleteConfirm({ kind: "svc", name: svc.name })} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "provision-watchers" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-(--color-text-muted)">Provision watchers auto-discover devices</p>
                <Button variant="primary" size="sm" onClick={() => setShowAddPW(true)}><Plus size={14} /> Add Watcher</Button>
              </div>
              {provisionWatchers.length === 0 ? (
                <Card className="p-6 text-center text-(--color-text-muted)"><Crosshair size={24} className="mx-auto mb-2" /><p>No provision watchers configured</p></Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {provisionWatchers.map((pw, i) => (
                    <ProvisionWatcherCard key={i} pw={pw}
                      onDelete={() => setDeleteConfirm({ kind: "pw", name: pw.name })}
                      onEdit={() => {}} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "core-data" && (
            <div className="space-y-4">
              <p className="text-xs text-(--color-text-muted)">Device readings and events for {selectedDevice?.name}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Readings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-96 overflow-auto">
                    {readings.map((r, i) => (
                      <div key={i} className="text-xs bg-(--color-surface-hover) rounded p-1.5 overflow-hidden">
                        <span className="text-(--color-text-muted) block truncate">{r.resourceName}</span>
                        <span className="text-(--color-text-muted) text-[10px]">{r.valueType}</span>
                        <div className="mt-0.5 text-(--color-text-primary) font-mono text-xs">{String(r.value)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-(--color-text-primary)">Events</h3>
                  <p className="text-xs text-(--color-text-muted)">Select an EdgeX device from the Devices tab to load events.</p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "nodered" && (
            <div className="space-y-4">
              {/* Node-RED Instance Overview */}
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-grafana-blue" />
                      <h2 className="text-base font-semibold text-(--color-text-primary)">Node-RED Instance</h2>
                      <span className="text-[10px] text-(--color-text-muted) bg-(--color-surface-hover) px-1.5 py-0.5 rounded">vedge-edgex-nodered</span>
                      {containerStatus && (
                        <span className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          containerStatus === "running" ? "bg-green-500/10 text-green-500" :
                          containerStatus === "stopped" || containerStatus === "exited" ? "bg-red-500/10 text-red-500" :
                          "bg-orange-500/10 text-orange-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                            containerStatus === "running" ? "bg-green-500" :
                            containerStatus === "stopped" || containerStatus === "exited" ? "bg-red-500" :
                            "bg-orange-500"
                          }`} />
                          {containerStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-(--color-text-muted)">Flow-based visual programming environment for edge devices</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-(--color-text-secondary)">Container:</span>
                      <code className="bg-(--color-surface-hover) px-1 rounded text-(--color-text-primary)">vedge-edgex-nodered</code>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-(--color-text-secondary)">Port:</span>
                      <code className="bg-(--color-surface-hover) px-1 rounded text-(--color-text-primary)">1880</code>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button variant="primary" size="sm" onClick={() => {}} disabled={containerActing}>
                        <Play size={12} /> Start
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => {}} disabled={containerActing}>
                        <Square size={12} /> Stop
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => {}} disabled={containerActing}>
                        <RefreshCw size={12} className={containerActing ? "animate-spin" : ""} /> Restart
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button variant="ghost" size="sm" onClick={handleNodeRedLogs}>
                        <Terminal size={12} /> Logs
                      </Button>
                      <Button variant="primary" size="sm">
                        <ExternalLink size={12} /> Open Node-RED UI
                      </Button>
                    </div>
                  </div>
                </div>

                {containerErr && (
                  <div className="mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded p-2">
                    <span className="text-xs text-red-500 flex-1">{containerErr}</span>
                    <button onClick={() => setContainerErr(null)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                )}

                {showNodeRedLogs && nodeRedLogs !== null && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-(--color-text-secondary)">Container Logs</span>
                      <button onClick={() => setShowNodeRedLogs(false)} className="text-xs text-(--color-text-muted) hover:text-(--color-text-primary)">Close</button>
                    </div>
                    <pre className="p-2 bg-(--color-surface-hover) rounded text-xs text-(--color-text-secondary) max-h-48 overflow-auto font-mono leading-relaxed">
                      {nodeRedLogs}
                    </pre>
                  </div>
                )}
              </Card>

              {/* Deploy Flow */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={16} className="text-(--color-text-secondary)" />
                  <h3 className="text-sm font-semibold text-(--color-text-primary)">Deploy Flow</h3>
                </div>
                <div className="space-y-3">
                  <div className="border border-(--color-border) rounded-grafana overflow-hidden">
                    <Editor height="20vh" defaultLanguage="json" value={flowJson}
                      onChange={(val) => { setFlowJson(val || ""); setJsonError(null); }}
                      theme={theme === "dark" ? "vs-dark" : "vs"}
                      options={{ minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, fontSize: 12 }} />
                  </div>
                  {jsonError && <p className="text-xs text-grafana-red">{jsonError}</p>}
                  <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                    <Button variant="primary" size="sm" disabled={!selectedDeviceId || !flowJson.trim()} loading={deploying} onClick={handleDeploy}>
                      <Upload size={12} /> Deploy to Node-RED
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={12} /> Upload JSON
                    </Button>
                  </div>
                  {deployMsg && (
                    <p className={`text-xs ${deployMsg.includes("failed") || deployMsg.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
                      {deployMsg}
                    </p>
                  )}
                </div>
              </Card>

              {/* Flow Snapshots */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-(--color-text-secondary)" />
                    <h3 className="text-sm font-semibold text-(--color-text-primary)">Flow Snapshots</h3>
                  </div>
                </div>

                {flows.length === 0 ? (
                  <div className="border border-dashed border-(--color-border) rounded p-6 text-center">
                    <p className="text-xs text-(--color-text-muted)">No flow snapshots yet</p>
                    <p className="text-xs text-(--color-text-muted) mt-1">Deploy a flow above to create the first snapshot</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {flows.map((snap) => (
                      <div key={snap.id} className="flex items-center justify-between bg-(--color-surface-hover) rounded p-2 group hover:bg-(--color-surface-hover)/80 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-medium text-(--color-text-primary) shrink-0">v{snap.version}</span>
                          <Badge color={
                            snap.status === "deployed" ? "green" :
                            snap.status === "pending" ? "orange" :
                            snap.status === "failed" ? "red" : "gray"
                          }>{snap.status}</Badge>
                          {snap.created_at && (
                            <span className="text-[10px] text-(--color-text-muted) truncate">{new Date(snap.created_at).toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setViewFlow(snap.flow_json)} title="View flow JSON" className="p-1 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors rounded">
                            <Eye size={11} />
                          </button>
                          <button onClick={() => setDeleteTarget(snap.id)} title="Delete snapshot" className="p-1 text-(--color-text-muted) hover:text-grafana-red transition-colors rounded">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {snapError && (
                  <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded p-2">
                    <p className="text-xs text-red-500">{snapError}</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === "tunnel" && (
            <div className="space-y-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-grafana-purple" />
                    <div>
                      <h3 className="text-sm font-semibold text-(--color-text-primary)">Tunnel Agent</h3>
                      <p className="text-xs text-(--color-text-muted)">
                        <Badge color={tunnelStatusBadgeColor(tunnelStatus)}>{tunnelStatus}</Badge>
                        {" · "}Container: vedge-tunnel-agent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" loading={tunnelLogsLoading} onClick={handleTunnelFetchLogs} title="Fetch Logs">
                      <Terminal size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" loading={tunnelActionLoading === "restart"} onClick={() => handleTunnelAgentAction("restart")} title="Restart">
                      <RotateCcw size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" loading={tunnelActionLoading === "stop"} onClick={() => handleTunnelAgentAction("stop")} title="Stop">
                      <Square size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" loading={tunnelActionLoading === "start"} onClick={() => handleTunnelAgentAction("start")} title="Start">
                      <Play size={14} />
                    </Button>
                  </div>
                </div>

                {tunnelLogs !== null && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <button onClick={() => setTunnelLogs(null)} className="text-xs text-grafana-blue hover:underline">Clear</button>
                      <button onClick={handleTunnelFetchLogs} className="text-xs text-grafana-blue hover:underline">Refresh</button>
                    </div>
                    <pre className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-4 py-3 text-xs text-(--color-text-primary) font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
                      {tunnelLogs || "(no output yet — request sent to edge device)"}
                    </pre>
                  </div>
                )}
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-grafana-purple" />
                    <div>
                      <h3 className="text-sm font-semibold text-(--color-text-primary)">Tunnel Configuration</h3>
                      <p className="text-xs text-(--color-text-muted)">FRP tunnel settings for remote UI access</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-(--color-border) mb-3">
                  <div className="flex gap-0">
                    <button onClick={() => setTunnelConfigTab("simple")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        tunnelConfigTab === "simple"
                          ? "border-grafana-blue text-(--color-text-primary)"
                          : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                      }`}>Simple</button>
                    <button onClick={() => setTunnelConfigTab("raw")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        tunnelConfigTab === "raw"
                          ? "border-grafana-blue text-(--color-text-primary)"
                          : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
                      }`}>Raw TOML</button>
                  </div>
                </div>

                {tunnelSaveSuccess && (
                  <div className="mb-3 text-xs text-grafana-green bg-grafana-green/10 px-3 py-2 rounded-grafana">
                    Configuration saved and sent to device.
                  </div>
                )}

                {tunnelConfigTab === "simple" ? (
                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Server Address</label>
                      <input type="text" value={tunnelSimpleAddr} onChange={(e) => setTunnelSimpleAddr(e.target.value)}
                        placeholder="vedge.yourdomain.com"
                        className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Server Port</label>
                      <input type="text" value={tunnelSimplePort} onChange={(e) => setTunnelSimplePort(e.target.value)}
                        placeholder="7000"
                        className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">FRP Token</label>
                      <input type="password" value={tunnelSimpleToken} onChange={(e) => setTunnelSimpleToken(e.target.value)}
                        placeholder="Shared secret token"
                        className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue" />
                    </div>
                  </div>
                ) : (
                  <div className="border border-(--color-border) rounded-grafana overflow-hidden">
                    <Editor height="300px" defaultLanguage="ini" value={tunnelRawConfig}
                      onChange={(val) => setTunnelRawConfig(val || "")}
                      theme={theme === "dark" ? "vs-dark" : "vs"}
                      options={{ minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, fontSize: 12, tabSize: 2 }} />
                  </div>
                )}

                <div className="mt-4">
                  <Button variant="primary" size="sm" onClick={handleTunnelSaveConfig}>
                    <Save size={14} /> Save Configuration
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      <Modal open={showAddProfile} onClose={() => setShowAddProfile(false)} title="Deploy Device Profile"
        footer={<><Button variant="secondary" size="sm" onClick={() => setShowAddProfile(false)}>Cancel</Button><Button size="sm" onClick={handleDeployProfile} disabled={!newProfileName.trim()}>Deploy Profile</Button></>}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Profile Name *</label>
            <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" placeholder="e.g. Random-Boolean-Device" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} />
          </div>
        </div>
      </Modal>

      <Modal open={showAddDevice} onClose={() => setShowAddDevice(false)} title="Add EdgeX Device"
        footer={<><Button variant="secondary" size="sm" onClick={() => setShowAddDevice(false)}>Cancel</Button><Button size="sm" onClick={handleAddDevice} disabled={!newDeviceName.trim()}>Add Device</Button></>}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Device Name *</label>
            <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} placeholder="e.g. My-Device-01" />
          </div>
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Profile</label>
            <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newDeviceProfile} onChange={(e) => setNewDeviceProfile(e.target.value)}>
              <option value="">None</option>
              {profileNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <Modal open={showAddPW} onClose={() => setShowAddPW(false)} title="Add Provision Watcher"
        footer={<><Button variant="secondary" size="sm" onClick={() => setShowAddPW(false)}>Cancel</Button><Button size="sm" onClick={handleAddPW} disabled={!newPWName.trim()}>Add Watcher</Button></>}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Name *</label>
            <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newPWName} onChange={(e) => setNewPWName(e.target.value)} placeholder="e.g. REST-Watcher" />
          </div>
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Device Service</label>
            <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newPWSvc} onChange={(e) => setNewPWSvc(e.target.value)}>
              <option value="">None</option>
              {deviceServiceNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Profile</label>
            <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newPWProfile} onChange={(e) => setNewPWProfile(e.target.value)}>
              <option value="">None</option>
              {profileNames.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-(--color-text-muted) block mb-1">Identifiers (e.g. MAC address)</label>
            <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)" value={newPWIdentifiers} onChange={(e) => setNewPWIdentifiers(e.target.value)} placeholder="00-11-22-33-44-55" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirm?.kind === "profile"}
        title="Delete Profile"
        message={`Are you sure you want to delete profile "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteProfile}
        onCancel={() => setDeleteConfirm(null)} />
      <ConfirmDialog
        open={deleteConfirm?.kind === "device"}
        title="Delete Device"
        message={`Are you sure you want to delete device "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteDevice}
        onCancel={() => setDeleteConfirm(null)} />
      <ConfirmDialog
        open={deleteConfirm?.kind === "pw"}
        title="Delete Provision Watcher"
        message={`Are you sure you want to delete provision watcher "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={handleDeletePW}
        onCancel={() => setDeleteConfirm(null)} />
      <ConfirmDialog
        open={deleteConfirm?.kind === "svc"}
        title="Delete Device Service"
        message={`Are you sure you want to delete device service "${deleteConfirm?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteSvc}
        onCancel={() => setDeleteConfirm(null)} />

      {/* Flows modals */}
      <Modal open={!!viewFlow} onClose={() => setViewFlow(null)} title="Flow JSON" className="max-w-3xl">
        <div className="border border-(--color-border) rounded-grafana overflow-hidden">
          <Editor height="400px" defaultLanguage="json" value={JSON.stringify(viewFlow, null, 2)}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            options={{ readOnly: true, minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, fontSize: 12 }} />
        </div>
      </Modal>
      <Modal open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="Delete flow snapshot"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
          </>
        }>
        <p className="text-sm text-(--color-text-secondary)">Are you sure you want to delete this flow snapshot? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
