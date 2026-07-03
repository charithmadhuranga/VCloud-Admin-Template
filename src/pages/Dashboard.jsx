import { Server, HardDrive, Activity, AlertTriangle, Cpu } from 'lucide-react'
import StatCard from '../components/StatCard'
import SparklineChart from '../components/SparklineChart'
import DataTable from '../components/DataTable'
import ActivityFeed from '../components/ActivityFeed'
import AreaChart from '../components/charts/AreaChart'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Dashboard']} />
        <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">Cluster overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Nodes" value="247" change={12} changeLabel="vs last week" icon={Server}
          chart={<SparklineChart data={[12, 19, 15, 22, 18, 29, 24, 34, 28, 32, 38, 35, 42, 39, 45]} color="#6f96d9" />} />
        <StatCard title="CPU Usage (Avg)" value="47.3%" change={-5.2} changeLabel="vs last week" icon={Cpu}
          chart={<SparklineChart data={[45, 48, 42, 47, 44, 46, 43]} color="#f5c542" />} />
        <StatCard title="Memory Usage" value="62.8%" change={8.1} changeLabel="vs last week" icon={HardDrive}
          chart={<SparklineChart data={[55, 58, 62, 59, 63, 61, 65]} color="#967bde" />} />
        <StatCard title="Active Alerts" value="14" change={-23} changeLabel="vs last week" icon={AlertTriangle}
          chart={<SparklineChart data={[22, 20, 18, 21, 16, 15, 14]} color="#e24d5d" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Cluster Throughput (24h)</h3>
              <p className="text-xs text-text-tertiary mt-0.5">Requests per second across all nodes</p>
            </div>
          </div>
          <AreaChart
            data={[
              { name: 'Requests', data: [4200, 2100, 1800, 3400, 7800, 9200, 10100, 9800, 8700, 6400, 5100, 3800] },
              { name: 'Latency (ms)', data: [95, 82, 78, 88, 112, 135, 142, 138, 125, 108, 98, 90] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#6f96d9', '#e24d5d']}
            height={220}
          />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>

      <DataTable />
    </div>
  )
}
