import { Plus } from 'lucide-react'
import StatCard from '../components/StatCard'
import GaugeChart from '../components/charts/GaugeChart'
import DataTable from '../components/DataTable'
import Button from '../components/ui/Button'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'

export default function Nodes() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Infrastructure', 'Nodes']} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Nodes</h1>
            <p className="text-sm text-text-secondary mt-0.5">Manage cluster nodes and resources</p>
          </div>
          <Button variant="primary" size="sm" icon={Plus}>Add Node</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-4 text-center">
          <GaugeChart value={68} title="CPU" color="#6f96d9" />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-4 text-center">
          <GaugeChart value={72} title="Memory" color="#967bde" />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-4 text-center">
          <GaugeChart value={45} title="Disk" color="#6fbf73" />
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-4 text-center">
          <GaugeChart value={23} title="Network" color="#f5c542" />
        </div>
      </div>

      <DataTable />
    </div>
  )
}
