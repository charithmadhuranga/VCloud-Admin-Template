import ReactECharts from 'echarts-for-react'
import { useChartTheme } from '../../hooks/useChartTheme'

export default function PieChart({ data, colors, height = 300, donut }) {
  const t = useChartTheme()
  const pal = colors || [t.blue, t.green, t.yellow, t.red, t.purple, t.orange]

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: t.bgElevated,
      borderColor: t.borderDefault,
      textStyle: { color: t.textPrimary, fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: t.textSecondary, fontSize: 12 },
    },
    series: [{
      type: 'pie',
      radius: donut ? ['40%', '65%'] : '65%',
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: t.bgCard, borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
      },
      data: data.map((d, i) => ({ ...d, itemStyle: { color: pal[i % pal.length] } })),
    }],
  }

  return <ReactECharts option={option} style={{ height }} notMerge />
}
