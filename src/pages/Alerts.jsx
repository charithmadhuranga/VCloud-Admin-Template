import { useState, useEffect, useMemo, useRef } from "react";
import { AlertTriangle, CheckCircle, Eye, Bell, Settings, RefreshCw, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const SEVERITY_CONFIG = {
  critical: { color: "text-grafana-red", bg: "bg-grafana-red/10" },
  warning: { color: "text-grafana-orange", bg: "bg-grafana-orange/10" },
  info: { color: "text-grafana-blue", bg: "bg-grafana-blue/10" },
};

const STATUS_CONFIG = {
  firing: { color: "text-grafana-orange", bg: "bg-grafana-orange/10" },
  acknowledged: { color: "text-(--color-text-muted)", bg: "bg-(--color-surface-hover)" },
  resolved: { color: "text-grafana-green", bg: "bg-grafana-green/10" },
};

const initialAlerts = [
  { id: "a-1", severity: "critical", status: "firing", message: "Disk usage at 94% on db-primary-01", metric_value: 94, device_id: "dev-04", fired_at: new Date(Date.now() - 120000).toISOString() },
  { id: "a-2", severity: "warning", status: "firing", message: "CPU threshold exceeded on k8s-node-02", metric_value: 89.2, device_id: "dev-02", fired_at: new Date(Date.now() - 480000).toISOString() },
  { id: "a-3", severity: "info", status: "resolved", message: "Auto-scaling triggered in us-east-1", metric_value: null, device_id: "dev-01", fired_at: new Date(Date.now() - 900000).toISOString() },
  { id: "a-4", severity: "critical", status: "firing", message: "SSL certificate expires in 7 days", metric_value: null, device_id: "dev-01", fired_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "a-5", severity: "warning", status: "acknowledged", message: "Memory pressure on cache-node-03", metric_value: 88.4, device_id: "dev-03", fired_at: new Date(Date.now() - 3600000).toISOString() },
];

const initialRules = [
  { id: "r-1", name: "High CPU Usage", metric: "cpu_percent", operator: "gt", threshold: 85, duration_seconds: 300, severity: "warning", enabled: true },
  { id: "r-2", name: "Disk Full", metric: "disk_percent", operator: "gt", threshold: 90, duration_seconds: 60, severity: "critical", enabled: true },
];

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-grafana-blue bg-grafana-blue/10 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-grafana-red transition-colors"><X size={10} /></button>
    </span>
  );
}

function Dropdown({
  label, value, values, open, onToggle, onSelect, display,
}) {
  const [filterText, setFilterText] = useState("");

  const filtered = useMemo(() => {
    if (!filterText) return values;
    const s = filterText.toLowerCase();
    return values.filter((v) => String(v).toLowerCase().includes(s));
  }, [values, filterText]);

  useEffect(() => { if (!open) setFilterText(""); }, [open]);

  return (
    <div className="relative">
      <button onClick={onToggle}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded-grafana transition-colors ${
          value ? "bg-grafana-blue/10 border-grafana-blue/40 text-grafana-blue font-medium" : "bg-(--color-surface-elevated) border-(--color-border) text-(--color-text-muted) hover:border-(--color-text-muted)/40 hover:text-(--color-text-primary)"
        }`}>
        <Search size={11} /> {value ? display(value) : label}
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 w-56 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana shadow-lg z-50 overflow-hidden">
          <div className="p-1.5 border-b border-(--color-border)">
            <input type="text" value={filterText} onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search..." autoFocus
              className="w-full px-2 py-1 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded text-(--color-text-primary) focus:outline-none focus:border-grafana-blue" />
          </div>
          <div className="max-h-48 overflow-y-auto">
            <button onClick={() => onSelect("")}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                !value ? "bg-grafana-blue/10 text-grafana-blue font-medium" : "text-(--color-text-muted) hover:bg-(--color-surface-hover)"
              }`}>All {label}s</button>
            {filtered.map((v) => (
              <button key={v} onClick={() => onSelect(v)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  value === v ? "bg-grafana-blue/10 text-grafana-blue font-medium" : "text-(--color-text-primary) hover:bg-(--color-surface-hover)"
                }`}>{display(v)}</button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-2 text-xs text-(--color-text-muted)">No matches</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Alerts() {
  const [tab, setTab] = useState("alerts");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [rules, setRules] = useState(initialRules);
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "", metric: "device_online", operator: "eq",
    threshold: 0, duration_seconds: 0, severity: "warning", enabled: true,
  });

  const pageSize = 20;
  const total = alerts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [severityFilter, statusFilter, deviceFilter, dateFrom, dateTo]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter && a.severity !== severityFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (deviceFilter && a.device_id !== deviceFilter) return false;
      if (dateFrom && a.fired_at && new Date(a.fired_at) < new Date(dateFrom)) return false;
      if (dateTo && a.fired_at && new Date(a.fired_at) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter, deviceFilter, dateFrom, dateTo]);

  const paginatedAlerts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAlerts.slice(start, start + pageSize);
  }, [filteredAlerts, page]);

  const filterValues = {
    severities: [...new Set(alerts.map((a) => a.severity))],
    statuses: [...new Set(alerts.map((a) => a.status))],
    device_ids: [...new Set(alerts.map((a) => a.device_id))],
  };

  const activeFilterCount = [severityFilter, statusFilter, deviceFilter, dateFrom, dateTo].filter(Boolean).length;

  const handleAcknowledge = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "acknowledged" } : a));
  };

  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "resolved" } : a));
  };

  const handleCreateRule = () => {
    if (!newRule.name.trim()) return;
    setRules((prev) => [...prev, { ...newRule, id: `r-${Date.now()}` }]);
    setShowCreateRule(false);
    setNewRule({ name: "", metric: "device_online", operator: "eq", threshold: 0, duration_seconds: 0, severity: "warning", enabled: true });
  };

  const handleDeleteRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 space-y-1 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-grafana-orange" />
            <h1 className="text-xl font-semibold text-(--color-text-primary)">Alerts</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5">
              <button onClick={() => setTab("alerts")}
                className={`px-3 py-1.5 text-xs font-medium rounded-grafana transition-colors ${
                  tab === "alerts" ? "bg-grafana-blue text-white" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}><Bell size={14} className="inline mr-1" />Alerts</button>
              <button onClick={() => setTab("rules")}
                className={`px-3 py-1.5 text-xs font-medium rounded-grafana transition-colors ${
                  tab === "rules" ? "bg-grafana-blue text-white" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}><Settings size={14} className="inline mr-1" />Rules</button>
            </div>
          </div>
        </div>
      </div>

      {tab === "rules" ? (
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowCreateRule(!showCreateRule)}>
              {showCreateRule ? "Cancel" : "New Rule"}
            </Button>
          </div>
          {showCreateRule && (
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-(--color-text-primary)">Create Alert Rule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Name</label>
                  <input className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Metric</label>
                  <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.metric} onChange={(e) => setNewRule({ ...newRule, metric: e.target.value })}>
                    <option value="device_online">Device Online</option>
                    <option value="container_status">Container Status</option>
                    <option value="memory_percent">Memory %</option>
                    <option value="disk_percent">Disk %</option>
                    <option value="cpu_percent">CPU %</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Operator</label>
                  <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.operator} onChange={(e) => setNewRule({ ...newRule, operator: e.target.value })}>
                    <option value="gt">Greater Than</option>
                    <option value="lt">Less Than</option>
                    <option value="eq">Equals</option>
                    <option value="neq">Not Equals</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Threshold</label>
                  <input type="number" className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.threshold} onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Duration (seconds)</label>
                  <input type="number" className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.duration_seconds} onChange={(e) => setNewRule({ ...newRule, duration_seconds: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-xs text-(--color-text-muted) block mb-1">Severity</label>
                  <select className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-xs text-(--color-text-primary)"
                    value={newRule.severity} onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <Button size="sm" onClick={handleCreateRule}>Create Rule</Button>
            </Card>
          )}
          {rules.length === 0 ? (
            <p className="text-(--color-text-muted) text-sm text-center py-8">No alert rules configured</p>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-(--color-text-primary)">{rule.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[rule.severity]?.bg || SEVERITY_CONFIG.info.bg} ${SEVERITY_CONFIG[rule.severity]?.color || SEVERITY_CONFIG.info.color}`}>{rule.severity}</span>
                      </div>
                      <p className="text-xs text-(--color-text-muted)">
                        {rule.metric} {rule.operator} {rule.threshold}
                        {rule.duration_seconds > 0 && ` for ${rule.duration_seconds}s`}
                        {!rule.enabled && " (disabled)"}
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="shrink-0 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-3 mb-4" ref={dropdownRef}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) mr-1">Filters</span>

              <Dropdown
                label="Severity"
                value={severityFilter}
                values={filterValues.severities}
                open={openDropdown === "severity"}
                onToggle={() => setOpenDropdown(openDropdown === "severity" ? null : "severity")}
                onSelect={(v) => { setSeverityFilter(v); setOpenDropdown(null); }}
                display={(v) => v}
              />
              <Dropdown
                label="Status"
                value={statusFilter}
                values={filterValues.statuses}
                open={openDropdown === "status"}
                onToggle={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                onSelect={(v) => { setStatusFilter(v); setOpenDropdown(null); }}
                display={(v) => v}
              />
              <Dropdown
                label="Device"
                value={deviceFilter}
                values={filterValues.device_ids}
                open={openDropdown === "device"}
                onToggle={() => setOpenDropdown(openDropdown === "device" ? null : "device")}
                onSelect={(v) => { setDeviceFilter(v); setOpenDropdown(null); }}
                display={(v) => String(v).slice(0, 12) + "…"}
              />

              <div className="flex items-center gap-1.5">
                <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setOpenDropdown(null); }}
                  className="px-2 py-1.5 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue w-32" />
                <span className="text-(--color-text-muted) text-xs">–</span>
                <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setOpenDropdown(null); }}
                  className="px-2 py-1.5 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue w-32" />
              </div>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => { setSeverityFilter(""); setStatusFilter(""); setDeviceFilter(""); setDateFrom(""); setDateTo(""); }}>
                  <X size={12} /> Clear
                </Button>
              )}
            </div>

            {activeFilterCount > 0 && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-(--color-border) flex-wrap">
                {severityFilter && <Chip label={`Severity: ${severityFilter}`} onRemove={() => setSeverityFilter("")} />}
                {statusFilter && <Chip label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter("")} />}
                {deviceFilter && <Chip label={`Device: ${String(deviceFilter).slice(0, 16)}…`} onRemove={() => setDeviceFilter("")} />}
                {dateFrom && <Chip label={`From: ${dateFrom}`} onRemove={() => setDateFrom("")} />}
                {dateTo && <Chip label={`To: ${dateTo}`} onRemove={() => setDateTo("")} />}
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
            {paginatedAlerts.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle size={32} className="mx-auto text-grafana-green mb-2" />
                <p className="text-(--color-text-muted) text-sm">
                  {activeFilterCount > 0 ? "No alerts match your filters." : "No active alerts"}
                </p>
              </Card>
            ) : (
              paginatedAlerts.map((alert) => (
                <Card key={alert.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[alert.severity]?.bg || SEVERITY_CONFIG.info.bg} ${SEVERITY_CONFIG[alert.severity]?.color || SEVERITY_CONFIG.info.color}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${STATUS_CONFIG[alert.status]?.bg || STATUS_CONFIG.acknowledged.bg} ${STATUS_CONFIG[alert.status]?.color || STATUS_CONFIG.acknowledged.color}`}>
                          {alert.status}
                        </span>
                        <span className="text-[10px] text-(--color-text-muted) font-mono">{String(alert.device_id).slice(0, 8)}…</span>
                      </div>
                      <p className="text-sm text-(--color-text-primary)">{alert.message}</p>
                      {alert.metric_value !== null && (
                        <p className="text-xs text-(--color-text-muted) mt-0.5">Value: {alert.metric_value}</p>
                      )}
                      <p className="text-xs text-(--color-text-muted) mt-1">
                        {alert.fired_at ? (
                          <span title={new Date(alert.fired_at).toLocaleString()}>{timeAgo(alert.fired_at)}</span>
                        ) : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {alert.status === "firing" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                            <Eye size={14} /> Acknowledge
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleResolve(alert.id)}>
                            <CheckCircle size={14} /> Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between mt-4 pt-3 border-t border-(--color-border)">
              <span className="text-xs text-(--color-text-muted)">{filteredAlerts.length} result{filteredAlerts.length !== 1 ? "s" : ""}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft size={14} /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pn;
                    if (totalPages <= 7) { pn = i + 1; }
                    else if (page <= 4) { pn = i + 1; }
                    else if (page >= totalPages - 3) { pn = totalPages - 6 + i; }
                    else { pn = page - 3 + i; }
                    return (
                      <button key={pn} onClick={() => setPage(pn)}
                        className={`w-7 h-7 text-xs rounded-md transition-colors ${
                          pn === page ? "bg-grafana-blue text-white font-semibold" : "text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
                        }`}>{pn}</button>
                    );
                  })}
                </div>
                <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
