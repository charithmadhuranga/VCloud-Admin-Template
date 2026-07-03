import PageBreadCrumb from '../../components/ui/PageBreadCrumb'
import AreaChart from '../../components/charts/AreaChart'
import StatCard from '../../components/StatCard'
import { Wifi, ArrowUp, ArrowDown } from 'lucide-react'

export default function MetricsNetwork() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Metrics', 'Network']} />
        <h1 className="text-lg font-semibold text-text-primary">Network Metrics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Bandwidth, latency, and packet statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Throughput" value="1.4 Gbps" change={12} changeLabel="vs last hour" icon={Wifi} />
        <StatCard title="P99 Latency" value="142ms" change={-8} changeLabel="vs last hour" icon={Wifi} />
        <StatCard title="Packets In" value="2.1M/s" change={5} changeLabel="vs last hour" icon={ArrowDown} />
        <StatCard title="Packets Out" value="1.8M/s" change={-3} changeLabel="vs last hour" icon={ArrowUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Network Throughput (24h)</h3>
          <AreaChart
            data={[
              { name: 'Inbound', data: [1.2, 0.8, 0.6, 1.1, 2.4, 2.8, 3.2, 2.9, 2.5, 1.8, 1.4, 1.0] },
              { name: 'Outbound', data: [1.0, 0.7, 0.5, 0.9, 2.0, 2.4, 2.7, 2.5, 2.1, 1.5, 1.2, 0.8] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#6f96d9', '#6fbf73']}
          />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Latency by Region</h3>
          <AreaChart
            data={[
              { name: 'US East', data: [95, 88, 82, 78, 112, 135, 142, 138, 125, 108, 98, 90] },
              { name: 'EU West', data: [120, 110, 105, 98, 145, 168, 172, 165, 155, 132, 125, 115] },
              { name: 'AP Southeast', data: [210, 195, 188, 180, 245, 268, 275, 260, 242, 220, 205, 198] },
            ]}
            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']}
            colors={['#6fbf73', '#f5c542', '#e24d5d']}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border-default">
          <h3 className="text-sm font-semibold text-text-primary">Network Interfaces</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-hover/50">
                {['Interface', 'Node', 'State', 'RX Rate', 'TX Rate', 'Errors'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { iface: 'eth0', node: 'k8s-node-01', state: 'Up', rx: '245 MB/s', tx: '189 MB/s', errors: '0' },
                { iface: 'eth0', node: 'k8s-node-02', state: 'Up', rx: '312 MB/s', tx: '256 MB/s', errors: '2' },
                { iface: 'eth0', node: 'db-primary-01', state: 'Up', rx: '89 MB/s', tx: '145 MB/s', errors: '0' },
                { iface: 'bond0', node: 'k8s-master-01', state: 'Up', rx: '512 MB/s', tx: '478 MB/s', errors: '0' },
                { iface: 'eth0', node: 'redis-cache-01', state: 'Down', rx: '0', tx: '0', errors: '0' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                  <td className="px-4 py-2.5 text-text-primary font-mono text-xs">{row.iface}</td>
                  <td className="px-4 py-2.5 text-text-primary">{row.node}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.state === 'Up' ? 'bg-grafana-green/10 text-grafana-green' : 'bg-grafana-red/10 text-grafana-red'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.state === 'Up' ? 'bg-grafana-green' : 'bg-grafana-red'}`} />
                      {row.state}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-text-primary">{row.rx}</td>
                  <td className="px-4 py-2.5 text-text-primary">{row.tx}</td>
                  <td className="px-4 py-2.5 text-text-primary">{row.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
