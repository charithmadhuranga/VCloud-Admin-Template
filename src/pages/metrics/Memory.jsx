import PageBreadCrumb from '../../components/ui/PageBreadCrumb'
import AreaChart from '../../components/charts/AreaChart'
import PieChart from '../../components/charts/PieChart'
import GaugeChart from '../../components/charts/GaugeChart'
import StatCard from '../../components/StatCard'
import { HardDrive } from 'lucide-react'

export default function MetricsMemory() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Metrics', 'Memory']} />
        <h1 className="text-lg font-semibold text-text-primary">Memory Metrics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Memory utilization and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Memory" value="384 GB" change={0} icon={HardDrive} />
        <StatCard title="Avg Usage" value="62.8%" change={8.1} changeLabel="vs last hour" icon={HardDrive} />
        <StatCard title="Peak (24h)" value="91.2%" change={16} changeLabel="vs yesterday" icon={HardDrive} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Memory Usage (24h)</h3>
          <AreaChart
            data={[
              { name: 'Used', data: [55, 58, 62, 59, 63, 61, 65, 68, 64, 60, 58, 62] },
              { name: 'Cached', data: [18, 16, 20, 17, 22, 19, 21, 23, 20, 18, 17, 19] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#967bde', '#6f96d9']}
          />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Memory Distribution</h3>
          <PieChart
            data={[
              { name: 'Applications', value: 45 },
              { name: 'Databases', value: 25 },
              { name: 'Cache', value: 15 },
              { name: 'System', value: 10 },
              { name: 'Free', value: 5 },
            ]}
            donut
            height={260}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { node: 'db-primary-01', val: 91, color: '#e24d5d' },
          { node: 'k8s-node-02', val: 88, color: '#f08c3e' },
          { node: 'k8s-node-01', val: 39, color: '#6fbf73' },
          { node: 'k8s-master-01', val: 42, color: '#6f96d9' },
        ].map(g => (
          <div key={g.node} className="rounded-xl border border-border-default bg-bg-card p-4 text-center">
            <GaugeChart value={g.val} title={g.node} color={g.color} height={140} />
          </div>
        ))}
      </div>
    </div>
  )
}
