import { useState } from 'react'
import { Search, User, Shield, MoreHorizontal, Mail, Clock, Check, X } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'

const users = [
  { id: 'u-01', name: 'Alex Morgan', email: 'alex@vedge.io', role: 'Admin', status: 'active', lastActive: 'Just now', avatar: 'AM' },
  { id: 'u-02', name: 'Jordan Lee', email: 'jordan@vedge.io', role: 'Editor', status: 'active', lastActive: '5m ago', avatar: 'JL' },
  { id: 'u-03', name: 'Taylor Smith', email: 'taylor@vedge.io', role: 'Viewer', status: 'active', lastActive: '1h ago', avatar: 'TS' },
  { id: 'u-04', name: 'Casey Brown', email: 'casey@vedge.io', role: 'Editor', status: 'inactive', lastActive: '2d ago', avatar: 'CB' },
  { id: 'u-05', name: 'Riley Johnson', email: 'riley@vedge.io', role: 'Viewer', status: 'active', lastActive: '30m ago', avatar: 'RJ' },
  { id: 'u-06', name: 'Sam Wilson', email: 'sam@vedge.io', role: 'Admin', status: 'active', lastActive: '10m ago', avatar: 'SW' },
]

const roleColors = { Admin: 'purple', Editor: 'blue', Viewer: 'gray' }
const statusColors = { active: 'green', inactive: 'gray' }

export default function Users() {
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-text-primary">Users</h1>
      </div>
      <p className="text-sm text-text-secondary mb-6">Manage team members and their access permissions.</p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface-elevated border border-border rounded-grafana text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-grafana-blue"
          />
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-hover">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Last Active</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border hover:bg-surface-hover transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-grafana-blue/10 flex items-center justify-center text-xs font-semibold text-grafana-blue">
                      {u.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{u.name}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Badge color={roleColors[u.role]}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge color={statusColors[u.status]}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs hidden lg:table-cell">{u.lastActive}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer">
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
