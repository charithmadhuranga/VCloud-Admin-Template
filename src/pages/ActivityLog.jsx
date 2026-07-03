import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { History, RefreshCw, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Button from "../components/ui/Button";

const initialLogs = [
  { id: "l-1", action: "user.login", resource_type: "web-ui", resource_id: "session-01", user_id: "user-john", details: "Login from 10.0.1.5", created_at: new Date(Date.now() - 60000).toISOString() },
  { id: "l-2", action: "device.registered", resource_type: "device", resource_id: "dev-05", user_id: "user-jane", details: "Registered device production-sensor-02", created_at: new Date(Date.now() - 300000).toISOString() },
  { id: "l-3", action: "stack.deployed", resource_type: "stack", resource_id: "stk-03", user_id: "user-john", details: "Deployed stack node-red-influxdb to k8s-node-01", created_at: new Date(Date.now() - 900000).toISOString() },
  { id: "l-4", action: "alert.acknowledged", resource_type: "alert", resource_id: "a-02", user_id: "user-john", details: "Acknowledged CPU alert on k8s-node-02", created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "l-5", action: "config.updated", resource_type: "config", resource_id: "cfg-prometheus", user_id: "user-admin", details: "Updated alerting rules", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "l-6", action: "auth.failure", resource_type: "api-key", resource_id: "key-monitoring", user_id: "svc-monitor", details: "Invalid API key from 10.0.2.50", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "l-7", action: "flow.deployed", resource_type: "flow", resource_id: "f-06", user_id: "user-jane", details: "Deployed Node-RED flow v12 to k8s-node-01", created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: "l-8", action: "device.deleted", resource_type: "device", resource_id: "dev-legacy", user_id: "user-admin", details: "Deleted legacy device dev-legacy-01", created_at: new Date(Date.now() - 28800000).toISOString() },
  { id: "l-9", action: "tunnel.started", resource_type: "tunnel", resource_id: "ts-04", user_id: "user-john", details: "Started tunnel session for Grafana on k8s-node-01", created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: "l-10", action: "backup.completed", resource_type: "backup", resource_id: "bk-etcd", user_id: "system", details: "ETCD snapshot saved to s3://fleet-backup/", created_at: new Date(Date.now() - 86400000).toISOString() },
];

const ACTION_COLORS = {
  created: "text-grafana-green",
  registered: "text-grafana-green",
  deployed: "text-grafana-green",
  started: "text-grafana-green",
  deleted: "text-grafana-red",
  stopped: "text-grafana-red",
  failure: "text-grafana-red",
  updated: "text-grafana-blue",
  acknowledged: "text-grafana-orange",
  completed: "text-grafana-green",
};

const ACTION_BG = {
  created: "bg-grafana-green/10",
  registered: "bg-grafana-green/10",
  deployed: "bg-grafana-green/10",
  started: "bg-grafana-green/10",
  deleted: "bg-grafana-red/10",
  stopped: "bg-grafana-red/10",
  failure: "bg-grafana-red/10",
  updated: "bg-grafana-blue/10",
  acknowledged: "bg-grafana-orange/10",
  completed: "bg-grafana-green/10",
};

function actionColor(action) {
  for (const [key, val] of Object.entries(ACTION_COLORS)) {
    if (action.includes(key)) return val;
  }
  return "text-grafana-orange";
}

function actionBg(action) {
  for (const [key, val] of Object.entries(ACTION_BG)) {
    if (action.includes(key)) return val;
  }
  return "bg-grafana-orange/10";
}

function formatAction(action) {
  if (!action) return "";
  return action.replace(/\./g, " ").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
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
    const valid = values.filter((v) => typeof v === "string" && v.length > 0);
    if (!filterText) return valid;
    const s = filterText.toLowerCase();
    return valid.filter((v) => v.toLowerCase().includes(s));
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

export default function ActivityLog() {
  const [logs, setLogs] = useState(initialLogs);
  const [filters, setFilters] = useState({
    action: "", resource_type: "", user_id: "",
    date_from: "", date_to: "",
  });
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const limit = 50;

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
  }, [filters.action, filters.resource_type, filters.user_id, filters.date_from, filters.date_to]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (filters.action && !l.action.includes(filters.action)) return false;
      if (filters.resource_type && l.resource_type !== filters.resource_type) return false;
      if (filters.user_id && l.user_id !== filters.user_id) return false;
      if (filters.date_from && new Date(l.created_at) < new Date(filters.date_from)) return false;
      if (filters.date_to && new Date(l.created_at) > new Date(filters.date_to + "T23:59:59")) return false;
      return true;
    });
  }, [logs, filters]);

  const totalPages = Math.max(1, Math.ceil(logs.length / limit));

  const filterValues = useMemo(() => ({
    actions: [...new Set(logs.map((l) => l.action))],
    resource_types: [...new Set(logs.map((l) => l.resource_type))],
    user_ids: [...new Set(logs.map((l) => l.user_id))],
  }), [logs]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ action: "", resource_type: "", user_id: "", date_from: "", date_to: "" });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 space-y-1 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-(--color-text-primary)">Activity Log</h1>
            <p className="text-sm text-(--color-text-secondary)">Track all actions performed across the fleet.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      <div className="shrink-0 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-3 mb-4" ref={dropdownRef}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) mr-1">Filters</span>

          <Dropdown label="Action" value={filters.action} values={filterValues.actions}
            open={openDropdown === "action"} onToggle={() => setOpenDropdown(openDropdown === "action" ? null : "action")}
            onSelect={(v) => setFilter("action", v)} display={(v) => formatAction(v)} />

          <Dropdown label="Type" value={filters.resource_type} values={filterValues.resource_types}
            open={openDropdown === "type"} onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            onSelect={(v) => setFilter("resource_type", v)} display={(v) => v} />

          <Dropdown label="User" value={filters.user_id} values={filterValues.user_ids}
            open={openDropdown === "user"} onToggle={() => setOpenDropdown(openDropdown === "user" ? null : "user")}
            onSelect={(v) => setFilter("user_id", v)} display={(v) => String(v).slice(0, 12) + "…"} />

          <div className="flex items-center gap-1.5">
            <input type="date" value={filters.date_from} onChange={(e) => setFilter("date_from", e.target.value)}
              className="px-2 py-1.5 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue w-32" />
            <span className="text-(--color-text-muted) text-xs">–</span>
            <input type="date" value={filters.date_to} onChange={(e) => setFilter("date_to", e.target.value)}
              className="px-2 py-1.5 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) focus:outline-none focus:border-grafana-blue w-32" />
          </div>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X size={12} /> Clear
            </Button>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-(--color-border) flex-wrap">
            {filters.action && <Chip label={`Action: ${formatAction(filters.action)}`} onRemove={() => clearFilter("action")} />}
            {filters.resource_type && <Chip label={`Type: ${filters.resource_type}`} onRemove={() => clearFilter("resource_type")} />}
            {filters.user_id && <Chip label={`User: ${String(filters.user_id).slice(0, 16)}…`} onRemove={() => clearFilter("user_id")} />}
            {filters.date_from && <Chip label={`From: ${filters.date_from}`} onRemove={() => clearFilter("date_from")} />}
            {filters.date_to && <Chip label={`To: ${filters.date_to}`} onRemove={() => clearFilter("date_to")} />}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-(--color-text-muted) text-sm">
            <History size={32} className="mx-auto mb-2 opacity-40" />
            {activeFilterCount > 0 ? "No results match your filters." : "No activity recorded yet."}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map((log) => (
              <div key={log.id}
                className="flex items-start gap-3 px-4 py-3 rounded-lg bg-(--color-surface-elevated) border border-(--color-border) hover:border-(--color-text-muted)/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${actionBg(log.action)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${actionColor(log.action)}`}>
                      {formatAction(log.action)}
                    </span>
                    <span className="text-[10px] text-(--color-text-muted) bg-surface-base px-1.5 py-0.5 rounded">
                      {log.resource_type}
                    </span>
                    {log.resource_id && (
                      <span className="text-[10px] text-(--color-text-muted) font-mono truncate max-w-[120px]">
                        {log.resource_id}
                      </span>
                    )}
                    <span className="text-[10px] text-(--color-text-muted)/50 ml-auto whitespace-nowrap shrink-0"
                      title={new Date(log.created_at).toLocaleString()}>
                      {timeAgo(log.created_at)}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-(--color-text-primary) mt-1 leading-relaxed">{log.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-between mt-4 pt-3 border-t border-(--color-border)">
          <span className="text-xs text-(--color-text-muted)">{filteredLogs.length} result{filteredLogs.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft size={14} /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) { pageNum = i + 1; }
                else if (page <= 4) { pageNum = i + 1; }
                else if (page >= totalPages - 3) { pageNum = totalPages - 6 + i; }
                else { pageNum = page - 3 + i; }
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 text-xs rounded-md transition-colors ${
                      pageNum === page ? "bg-grafana-blue text-white font-semibold" : "text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
                    }`}>{pageNum}</button>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
