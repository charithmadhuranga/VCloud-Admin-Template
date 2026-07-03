import PageBreadCrumb from '../../components/ui/PageBreadCrumb'
import AreaChart from '../../components/charts/AreaChart'
import BarChart from '../../components/charts/BarChart'
import StatCard from '../../components/StatCard'
import { Cpu, TrendingUp } from 'lucide-react'

export default function MetricsCPU() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Metrics', 'CPU']} />
        <h1 className="text-lg font-semibold text-text-primary">CPU Metrics</h1>
        <p className="text-sm text-text-secondary mt-0.5">CPU utilization and performance across the fleet</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Cores" value="1,248" change={0} icon={Cpu} />
        <StatCard title="Avg Utilization" value="47.3%" change={-5.2} changeLabel="vs last hour" icon={Cpu} />
        <StatCard title="Peak (24h)" value="94.5%" change={12} changeLabel="db-primary-01" icon={TrendingUp} />
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">CPU Usage (24h)</h3>
        <AreaChart
          data={[
            { name: 'Average', data: [45, 48, 42, 47, 44, 52, 58, 55, 50, 46, 43, 47] },
            { name: 'P99', data: [72, 75, 68, 73, 70, 82, 89, 85, 78, 72, 68, 74] },
          ]}
          categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
          colors={['#6f96d9', '#e24d5d']}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">CPU by Node</h3>
          <BarChart
            data={[{ name: 'CPU %', data: [34, 68, 89, 12, 94, 45, 0] }]}
            categories={['master-01', 'node-01', 'node-02', 'cache-01', 'db-01', 'node-03', 'cache-02']}
            colors={['#f5c542']}
          />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Top Consumers</h3>
          <div className="space-y-3">
            {[
              { process: 'fleet-api-server', cpu: '24.5%', cores: 8 },
              { process: 'kafka-broker', cpu: '18.2%', cores: 4 },
              { process: 'postgres-query', cpu: '12.8%', cores: 2 },
              { process: 'redis-cache', cpu: '8.4%', cores: 2 },
              { process: 'prometheus', cpu: '6.1%', cores: 1 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-text-primary">{item.process}</span>
                    <span className="text-xs text-text-secondary">{item.cpu} / {item.cores}c</span>
                  </div>
                  <div className="h-2 rounded-full bg-border-subtle overflow-hidden">
                    <div className="h-full rounded-full bg-grafana-blue transition-all" style={{ width: `${(parseFloat(item.cpu) / 30) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
