import PageBreadCrumb from '../../components/ui/PageBreadCrumb'
import AreaChart from '../../components/charts/AreaChart'
import BarChart from '../../components/charts/BarChart'
import GaugeChart from '../../components/charts/GaugeChart'
import StatCard from '../../components/StatCard'
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react'

export default function MetricsOverview() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Metrics', 'Overview']} />
        <h1 className="text-lg font-semibold text-text-primary">Metrics Overview</h1>
        <p className="text-sm text-text-secondary mt-0.5">Aggregated cluster metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg CPU" value="47.3%" change={-5.2} changeLabel="vs last hour" icon={Cpu} />
        <StatCard title="Memory" value="62.8%" change={8.1} changeLabel="vs last hour" icon={HardDrive} />
        <StatCard title="Network I/O" value="1.4 Gbps" change={12} changeLabel="vs last hour" icon={Wifi} />
        <StatCard title="Requests" value="4,210/s" change={18} changeLabel="vs last hour" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">System Resources (24h)</h3>
          <AreaChart
            data={[
              { name: 'CPU', data: [45, 48, 42, 47, 44, 52, 58, 55, 50, 46, 43, 47] },
              { name: 'Memory', data: [55, 58, 62, 59, 63, 61, 65, 68, 64, 60, 58, 62] },
              { name: 'Network', data: [30, 28, 35, 32, 38, 42, 45, 40, 36, 34, 31, 33] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#6f96d9', '#967bde', '#6fbf73']}
          />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Current Utilization</h3>
          <div className="grid grid-cols-2 gap-4">
            <GaugeChart value={47} title="CPU" color="#f5c542" height={150} />
            <GaugeChart value={63} title="Memory" color="#967bde" height={150} />
            <GaugeChart value={38} title="Disk" color="#6fbf73" height={150} />
            <GaugeChart value={72} title="Network" color="#6f96d9" height={150} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Resource Usage by Node</h3>
        <BarChart
          data={[
            { name: 'CPU %', data: [34, 68, 89, 12, 94, 45, 0] },
            { name: 'Memory %', data: [42, 39, 88, 40, 91, 46, 0] },
          ]}
          categories={['k8s-master-01', 'k8s-node-01', 'k8s-node-02', 'redis-cache-01', 'db-primary-01', 'k8s-node-03', 'cache-node-02']}
          colors={['#6f96d9', '#e24d5d']}
          stacked
        />
      </div>
    </div>
  )
}
