import { useState, useMemo } from 'react'
import { Search, Shield, ShieldOff, UserPlus } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'

const users = [
  { id: 1, name: 'John Doe', email: 'john@fleet.io', role: 'Admin', status: 'Active', mfa: true, lastActive: '2m ago', teams: ['Platform', 'Security'] },
  { id: 2, name: 'Jane Smith', email: 'jane@fleet.io', role: 'Engineer', status: 'Active', mfa: true, lastActive: '15m ago', teams: ['Backend', 'Infra'] },
  { id: 3, name: 'Mike Johnson', email: 'mike@fleet.io', role: 'Viewer', status: 'Active', mfa: false, lastActive: '1h ago', teams: ['Frontend'] },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@fleet.io', role: 'Engineer', status: 'Inactive', mfa: true, lastActive: '3d ago', teams: ['Data', 'ML'] },
  { id: 5, name: 'Alex Chen', email: 'alex@fleet.io', role: 'Admin', status: 'Active', mfa: true, lastActive: '5m ago', teams: ['Platform', 'Security', 'Infra'] },
  { id: 6, name: 'Emily Davis', email: 'emily@fleet.io', role: 'Engineer', status: 'Active', mfa: false, lastActive: '30m ago', teams: ['Backend'] },
  { id: 7, name: 'Tom Brown', email: 'tom@fleet.io', role: 'Viewer', status: 'Suspended', mfa: false, lastActive: '2w ago', teams: ['External'] },
  { id: 8, name: 'Lisa Anderson', email: 'lisa@fleet.io', role: 'Engineer', status: 'Active', mfa: true, lastActive: '10m ago', teams: ['Frontend', 'Design'] },
]

export default function Users() {
  const [filter, setFilter] = useState('')
  const filtered = useMemo(() =>
    users.filter(u => Object.values(u).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))),
    [filter]
  )

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Infrastructure', 'Users']} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Users</h1>
            <p className="text-sm text-text-secondary mt-0.5">{users.length} team members</p>
          </div>
          <Button variant="primary" size="sm" icon={UserPlus}>Invite User</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border-default flex items-center justify-between">
          <div className="flex gap-4">
            {['All', 'Active', 'Inactive', 'Suspended'].map(tab => (
              <button key={tab} className={`text-xs font-medium transition-colors cursor-pointer ${
                tab === 'All' ? 'text-grafana-blue' : 'text-text-tertiary hover:text-text-primary'
              }`}>{tab}</button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Search users..." className="w-44 h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-hover/50">
                {['User', 'Role', 'Status', 'MFA', 'Teams', 'Last Active'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{u.name}</p>
                        <p className="text-xs text-text-tertiary">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={u.role === 'Admin' ? 'purple' : u.role === 'Engineer' ? 'info' : 'neutral'} size="sm">{u.role}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={u.status === 'Active' ? 'success' : u.status === 'Inactive' ? 'warning' : 'error'} size="sm" dot>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    {u.mfa
                      ? <Shield size={14} className="text-grafana-green" />
                      : <ShieldOff size={14} className="text-text-tertiary" />
                    }
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      {u.teams.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] text-text-secondary font-medium">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
