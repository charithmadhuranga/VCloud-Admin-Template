import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import Badge from "./ui/Badge";

export default function DeviceSelector({ devices, value, onChange, placeholder = "Select a device...", className = "" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = devices.find((d) => d.id === value);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = devices.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.status.toLowerCase().includes(q);
  });

  const onlineDevices = filtered.filter((d) => d.status === "online");
  const otherDevices = filtered.filter((d) => d.status !== "online");

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  const statusColor = (status) => {
    switch (status) {
      case "online": return "bg-grafana-green";
      case "offline": return "bg-(--color-text-muted)";
      case "error": return "bg-grafana-red";
      default: return "bg-orange-500";
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-left cursor-pointer hover:border-(--color-text-muted)/50 transition-colors focus:outline-none focus:border-grafana-blue"
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(selected.status)}`} />
            <span className="text-(--color-text-primary) truncate">{selected.name}</span>
            {selected.device_type === "demo" && <Badge color="orange">demo</Badge>}
          </div>
        ) : (
          <span className="text-(--color-text-muted) flex-1">{placeholder}</span>
        )}
        <ChevronDown size={14} className={`text-(--color-text-muted) shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana shadow-lg overflow-hidden">
          <div className="relative border-b border-(--color-border)">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search devices..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-transparent text-(--color-text-primary) placeholder:text-(--color-text-muted)/50 focus:outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-(--color-text-muted)">No devices match your search</div>
            ) : (
              <>
                {onlineDevices.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) bg-(--color-surface-hover)/50">
                      Online ({onlineDevices.length})
                    </div>
                    {onlineDevices.map((d) => (
                      <DeviceOption key={d.id} device={d} selected={d.id === value} onSelect={handleSelect} statusColor={statusColor} />
                    ))}
                  </div>
                )}
                {otherDevices.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted) bg-(--color-surface-hover)/50">
                      Other ({otherDevices.length})
                    </div>
                    {otherDevices.map((d) => (
                      <DeviceOption key={d.id} device={d} selected={d.id === value} onSelect={handleSelect} statusColor={statusColor} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DeviceOption({ device, selected, onSelect, statusColor }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(device.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${
        selected ? "bg-grafana-blue/10" : "hover:bg-(--color-surface-hover)"
      }`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor(device.status)}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm truncate ${selected ? "text-grafana-blue font-medium" : "text-(--color-text-primary)"}`}>
            {device.name}
          </span>
          {device.device_type === "demo" && <Badge color="orange">demo</Badge>}
        </div>
        <p className="text-[10px] text-(--color-text-muted) truncate">{device.id}</p>
      </div>
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
        device.status === "online" ? "bg-grafana-green/10 text-grafana-green" :
        device.status === "error" ? "bg-grafana-red/10 text-grafana-red" :
        "bg-(--color-surface-hover) text-(--color-text-muted)"
      }`}>
        {device.status}
      </span>
    </button>
  );
}
