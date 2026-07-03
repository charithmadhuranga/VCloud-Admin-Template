import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'
import PieChart from '../components/charts/PieChart'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import StatusBadge from '../components/StatusBadge'

function MiniSparkline({ data, color = '#6f96d9' }) {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const w = 120, h = 28
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`).join(' ')
  return <svg width={w} height={h}><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Analytics']} />
        <h1 className="text-lg font-semibold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Request metrics and performance trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Latency" value="95ms" change={-12} changeLabel="vs yesterday" icon={Clock}
          chart={<MiniSparkline data={[120, 95, 88, 105, 92, 85, 78, 82, 90, 75, 72, 68, 65]} color="#6f96d9" />} />
        <StatCard title="Requests/sec" value="4,210" change={18} changeLabel="vs yesterday" icon={TrendingUp}
          chart={<MiniSparkline data={[1200, 1800, 2400, 2100, 2800, 3200, 2900, 3500, 4100, 3800, 4200, 4600, 4900]} color="#6fbf73" />} />
        <StatCard title="Error Rate" value="0.4%" change={-65} changeLabel="vs yesterday" icon={BarChart3}
          chart={<MiniSparkline data={[2.1, 1.8, 1.5, 2.3, 1.9, 1.2, 0.8, 1.1, 0.9, 0.7, 0.6, 0.5, 0.4]} color="#e24d5d" />} />
        <StatCard title="Active Users" value="1,847" change={7} changeLabel="vs yesterday" icon={Users}
          chart={<MiniSparkline data={[850, 920, 1100, 980, 1250, 1400, 1350, 1500, 1650, 1800, 1750, 1900, 2100]} color="#967bde" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Requests & Errors (24h)</h3>
              <p className="text-xs text-text-tertiary mt-0.5">Request volume and error rate over time</p>
            </div>
            <StatusBadge variant="success" label="Stable" />
          </div>
          <AreaChart
            data={[
              { name: 'Requests', data: [4200, 2100, 1800, 3400, 7800, 9200, 10100, 9800, 8700, 6400, 5100, 3800] },
              { name: 'Errors', data: [23, 12, 8, 18, 42, 55, 61, 58, 48, 35, 28, 20] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#6f96d9', '#e24d5d']}
          />
        </div>

        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Traffic by Region</h3>
              <p className="text-xs text-text-tertiary mt-0.5">Request distribution across regions</p>
            </div>
          </div>
          <PieChart
            data={[
              { name: 'US East', value: 45 },
              { name: 'EU West', value: 22 },
              { name: 'AP Southeast', value: 18 },
              { name: 'US West', value: 10 },
              { name: 'EU Central', value: 5 },
            ]}
            donut
            height={280}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Resource Usage by Service</h3>
            <p className="text-xs text-text-tertiary mt-0.5">CPU and Memory allocation per service tier</p>
          </div>
        </div>
        <BarChart
          data={[
            { name: 'CPU', data: [45, 32, 68, 24, 55] },
            { name: 'Memory', data: [62, 28, 72, 18, 48] },
          ]}
          categories={['API Gateway', 'Message Queue', 'Database', 'Cache', 'Worker Pool']}
          colors={['#6f96d9', '#967bde']}
          height={260}
        />
      </div>
    </div>
  )
}
