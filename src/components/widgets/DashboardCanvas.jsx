import WidgetRenderer from "./WidgetRenderer";

export default function DashboardCanvas({ widgets, editing, onSelectWidget }) {
  const getColSpan = (w) => w.position?.w || 3;
  const getRowSpan = (w) => w.position?.h || 2;

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-12 gap-3 auto-rows-[180px]">
        {widgets.map((w) => (
          <div
            key={w.id}
            className={`${editing ? "group relative cursor-pointer ring-1 ring-transparent hover:ring-grafana-blue/40 rounded-grafana transition-all" : "h-full"}`}
            style={{ gridColumn: `span ${Math.min(getColSpan(w), 12)}`, gridRow: `span ${getRowSpan(w)}` }}
            onClick={() => onSelectWidget(w)}
          >
            {editing && (
              <div className="absolute top-0 left-0 right-0 h-7 bg-grafana-blue/5 rounded-t-grafana flex items-center justify-center gap-2 z-10 cursor-grab select-none">
                <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-(--color-text-muted)/40" />
                  <circle cx="8" cy="2" r="1.5" fill="currentColor" className="text-(--color-text-muted)/40" />
                  <circle cx="14" cy="2" r="1.5" fill="currentColor" className="text-(--color-text-muted)/40" />
                </svg>
              </div>
            )}
            <div className={editing ? "pt-7 h-full" : "h-full"}>
              <WidgetRenderer widget={w} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
