import { useState } from 'react'
import { Cpu, Server, HardDrive, Activity, Wifi, Plus, Search, AlertTriangle, CheckCircle, Settings, Sliders, Radio, Thermometer, Zap } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ComponentCard from '../components/ui/ComponentCard'

const tabs = [
  { id: 'services', label: 'Device Services', icon: Server },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'profiles', label: 'Profiles', icon: Sliders },
  { id: 'watchers', label: 'Provision Watchers', icon: Radio },
  { id: 'events', label: 'Events & Readings', icon: Activity },
]

const services = [
  { name: 'device-virtual', status: 'running', type: 'Virtual', protocol: 'None', port: 59900, profiles: 4, devices: 8 },
  { name: 'device-rest', status: 'running', type: 'REST API', protocol: 'HTTP', port: 59986, profiles: 2, devices: 3 },
  { name: 'device-modbus', status: 'running', type: 'Modbus', protocol: 'TCP/RTU', port: 59901, profiles: 3, devices: 12 },
  { name: 'device-mqtt', status: 'running', type: 'MQTT', protocol: 'MQTT', port: 59902, profiles: 2, devices: 6 },
  { name: 'device-snmp', status: 'stopped', type: 'SNMP', protocol: 'SNMP v2c', port: 59903, profiles: 1, devices: 0 },
  { name: 'device-bacnet', status: 'running', type: 'BACnet', protocol: 'BACnet/IP', port: 59904, profiles: 2, devices: 24 },
  { name: 'device-opcua', status: 'running', type: 'OPC-UA', protocol: 'UA Binary', port: 59905, profiles: 1, devices: 4 },
  { name: 'device-gpio', status: 'running', type: 'GPIO', protocol: 'Sysfs', port: 59906, profiles: 1, devices: 2 },
]

const edgeDevices = [
  { name: 'TempSensor-01', service: 'device-modbus', profile: 'Temperature-Sensor', protocol: 'Modbus TCP', address: '192.168.1.100:502', labels: ['warehouse', 'zone-a'], status: 'locked' },
  { name: 'PressureSensor-A2', service: 'device-modbus', profile: 'Pressure-Sensor', protocol: 'Modbus TCP', address: '192.168.1.101:502', labels: ['factory', 'line-1'], status: 'locked' },
  { name: 'EnergyMeter-M1', service: 'device-modbus', profile: 'Energy-Meter', protocol: 'Modbus RTU', address: '/dev/ttyUSB0:1', labels: ['power', 'main'], status: 'locked' },
  { name: 'HVAC-Controller-01', service: 'device-bacnet', profile: 'HVAC-Controller', protocol: 'BACnet/IP', address: '192.168.2.50:47808', labels: ['building-a', 'floor-3'], status: 'locked' },
  { name: 'TempSensor-Office-A', service: 'device-mqtt', profile: 'Temperature-Sensor', protocol: 'MQTT', address: 'mqtt://broker:1883/temp/office-a', labels: ['office', 'monitoring'], status: 'unlocked' },
  { name: 'Camera-Entrance-01', service: 'device-rest', profile: 'ONVIF-Camera', protocol: 'HTTP', address: 'http://192.168.3.10:8080', labels: ['security', 'entrance'], status: 'locked' },
]

const profiles = [
  { name: 'Temperature-Sensor', desc: 'Temperature monitoring with DS18B20', manufacturer: 'Maxim Integrated', model: 'DS18B20', resources: 3, commands: 6 },
  { name: 'Pressure-Sensor', desc: 'Industrial pressure transducer', manufacturer: 'Siemens', model: 'SITRANS P320', resources: 4, commands: 8 },
  { name: 'Energy-Meter', desc: '3-phase power monitoring', manufacturer: 'Schneider Electric', model: 'PM5560', resources: 12, commands: 24 },
  { name: 'HVAC-Controller', desc: 'Building HVAC control interface', manufacturer: 'Honeywell', model: 'Spyder 7', resources: 8, commands: 16 },
  { name: 'ONVIF-Camera', desc: 'IP camera with ONVIF Profile S', manufacturer: 'Hikvision', model: 'DS-2CD2T47', resources: 5, commands: 10 },
]

export default function EdgeX() {
  const [activeTab, setActiveTab] = useState('services')

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'IoT', 'EdgeX']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">EdgeX Foundry</h1>
            <p className="text-sm text-text-secondary mt-0.5">Manage EdgeX 4.0 IoT device services, profiles, devices, and events</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto"><Button variant="primary" size="sm" icon={Plus}>Add {activeTab === 'services' ? 'Service' : activeTab === 'devices' ? 'Device' : activeTab === 'profiles' ? 'Profile' : 'Watcher'}</Button></div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeTab === tab.id ? 'bg-grafana-blue/10 text-grafana-blue' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            }`}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map(s => (
            <div key={s.name} className="rounded-xl border border-border-default bg-bg-card p-4 hover:border-grafana-blue/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.status === 'running' ? 'bg-grafana-green/10' : 'bg-grafana-red/10'}`}>
                    {s.status === 'running' ? <CheckCircle size={15} className="text-grafana-green" /> : <AlertTriangle size={15} className="text-grafana-red" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{s.name}</p>
                    <p className="text-[10px] text-text-tertiary">{s.type}</p>
                  </div>
                </div>
                <Badge variant={s.status === 'running' ? 'success' : 'error'} size="sm" dot>{s.status === 'running' ? 'Running' : 'Stopped'}</Badge>
              </div>
              <div className="space-y-1 text-xs text-text-secondary">
                <div className="flex justify-between"><span>Protocol</span><span className="text-text-primary font-mono">{s.protocol}</span></div>
                <div className="flex justify-between"><span>Port</span><span className="text-text-primary font-mono">:{s.port}</span></div>
                <div className="flex justify-between"><span>Profiles</span><span className="text-text-primary">{s.profiles}</span></div>
                <div className="flex justify-between"><span>Devices</span><span className="text-text-primary">{s.devices}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border-default">
            <div className="relative w-full sm:w-56">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input type="text" placeholder="Search devices..." className="w-full h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default bg-bg-hover/50">
                  {['Device Name', 'Service', 'Profile', 'Protocol', 'Address', 'Labels', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {edgeDevices.map((d, i) => (
                  <tr key={d.name} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-medium text-text-primary">{d.name}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary">{d.service}</td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary">{d.profile}</td>
                    <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{d.protocol}</td>
                    <td className="px-4 py-2.5 text-xs text-text-tertiary font-mono max-w-[160px] truncate" title={d.address}>{d.address}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {d.labels.map(l => (
                          <span key={l} className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] text-text-secondary">{l}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      {d.status === 'locked' ? (
                        <span className="text-grafana-green text-xs font-medium">Locked</span>
                      ) : (
                        <Badge variant="warning" size="sm">Unlocked</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(p => (
            <div key={p.name} className="rounded-xl border border-border-default bg-bg-card p-5 hover:border-grafana-blue/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-grafana-purple/10 flex items-center justify-center">
                  <Sliders size={15} className="text-grafana-purple" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{p.name}</p>
                  <p className="text-[10px] text-text-tertiary">{p.manufacturer} · {p.model}</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-3">{p.desc}</p>
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                <span>{p.resources} resources</span>
                <span>·</span>
                <span>{p.commands} commands</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border-default">
                <Button variant="ghost" size="sm">View Profile</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'watchers' && (
        <div className="rounded-xl border border-border-default bg-bg-card p-8 text-center">
          <Radio size={36} className="mx-auto text-text-tertiary mb-3" />
          <h3 className="text-sm font-semibold text-text-primary mb-1">Provision Watchers</h3>
          <p className="text-sm text-text-secondary mb-4">Automatically discover and register new devices on the network.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {[
              { name: 'MQTT-Broker-Watcher', topic: 'edgex/+/discovery', status: 'running', devices: 3 },
              { name: 'Modbus-Scan-Watcher', subnet: '192.168.1.0/24', status: 'running', devices: 5 },
              { name: 'BACnet-Discovery', subnet: '192.168.2.0/24', status: 'stopped', devices: 0 },
            ].map(w => (
              <div key={w.name} className="rounded-lg border border-border-default p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-primary">{w.name}</span>
                  <Badge variant={w.status === 'running' ? 'success' : 'error'} size="sm" dot>{w.status === 'running' ? 'Active' : 'Stopped'}</Badge>
                </div>
                <p className="text-[10px] text-text-tertiary">{w.topic || w.subnet}</p>
                <p className="text-xs text-text-secondary mt-1">{w.devices} devices discovered</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><Button variant="primary" size="sm" icon={Plus}>Add Provision Watcher</Button></div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="rounded-xl border border-border-default bg-bg-card p-8 text-center">
          <Activity size={36} className="mx-auto text-text-tertiary mb-3" />
          <h3 className="text-sm font-semibold text-text-primary mb-1">Events & Readings</h3>
          <p className="text-sm text-text-secondary mb-4">Browse real-time sensor readings and event data from EdgeX devices.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Total Events (24h)', value: '142,380', change: '+12%', color: 'text-grafana-blue' },
              { label: 'Avg Readings/Event', value: '6.4', change: '+2%', color: 'text-grafana-purple' },
              { label: 'Error Rate', value: '0.02%', change: '-8%', color: 'text-grafana-green' },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-border-default p-4">
                <p className="text-xs text-text-tertiary mb-1">{s.label}</p>
                <p className="text-xl font-semibold text-text-primary">{s.value}</p>
                <span className={`text-[10px] font-medium ${s.change.startsWith('+') ? 'text-grafana-green' : 'text-grafana-red'}`}>{s.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
