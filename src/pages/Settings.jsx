import { useState } from "react";
import { User, Building2, Palette } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ThemeToggle from "../components/ThemeToggle";

export default function Settings() {
  const [tab, setTab] = useState("profile");

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "organization", label: "Organization", icon: Building2 },
    { key: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-(--color-text-primary) mb-1">Settings</h1>
      <p className="text-sm text-(--color-text-secondary) mb-6">
        Manage your profile, organization, and preferences.
      </p>

      <div className="flex gap-1 mb-6 border-b border-(--color-border)">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-grafana-blue text-grafana-blue"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-4 max-w-lg">
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-(--color-surface-hover) flex items-center justify-center">
                <User size={24} className="text-(--color-text-muted)" />
              </div>
              <div>
                <h3 className="font-medium text-(--color-text-primary)">Admin User</h3>
                <p className="text-sm text-(--color-text-muted)">admin@vedge.io</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Username</dt>
                <dd className="text-(--color-text-primary)">admin</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Role</dt>
                <dd className="text-(--color-text-primary)">Administrator</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Member since</dt>
                <dd className="text-(--color-text-primary)">Jan 15, 2026</dd>
              </div>
            </dl>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => {}}>
              <User size={16} />
              Manage Profile
            </Button>
            <Button variant="destructive" onClick={() => {}}>
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {tab === "organization" && (
        <div className="space-y-4 max-w-lg">
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-(--color-surface-hover) flex items-center justify-center">
                <Building2 size={24} className="text-(--color-text-muted)" />
              </div>
              <div>
                <h3 className="font-medium text-(--color-text-primary)">VEdge Fleet</h3>
                <p className="text-sm text-(--color-text-muted)">5 members</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Organization ID</dt>
                <dd className="text-(--color-text-primary) font-mono text-xs">org_2kF8j3nMq9</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Slug</dt>
                <dd className="text-(--color-text-primary)">vedge-fleet</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-(--color-text-muted)">Max members</dt>
                <dd className="text-(--color-text-primary)">25</dd>
              </div>
            </dl>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => {}}>
              <Building2 size={16} />
              Manage Organization
            </Button>
          </div>
        </div>
      )}

      {tab === "appearance" && (
        <Card className="max-w-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-(--color-text-primary)">Theme</h3>
              <p className="text-sm text-(--color-text-muted)">
                Switch between dark and light mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      )}
    </div>
  );
}
