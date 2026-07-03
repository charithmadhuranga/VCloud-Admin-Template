import ReactECharts from 'echarts-for-react'
import { useChartTheme } from '../../hooks/useChartTheme'

export default function GaugeChart({ value = 0, title = '', color, height = 160 }) {
  const t = useChartTheme()
  const gaugeColor = color || t.blue

  const option = {
    series: [{
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '90%',
      startAngle: 220,
      endAngle: -40,
      min: 0,
      max: 100,
      splitNumber: 5,
      progress: { show: true, width: 8, itemStyle: { color: gaugeColor } },
      axisLine: { lineStyle: { width: 8, color: [[1, t.borderSubtle]] } },
      axisTick: { show: false },
      splitLine: { length: 6, lineStyle: { width: 2, color: t.borderDefault } },
      axisLabel: { show: false },
      pointer: { show: false },
      detail: {
        offsetCenter: [0, 20],
        fontSize: 18,
        fontWeight: 700,
        color: t.textPrimary,
        formatter: `{value}%`,
      },
      title: {
        offsetCenter: [0, '-10'],
        fontSize: 11,
        color: t.textTertiary,
      },
      data: [{ value, name: title }],
    }],
  }

  return <ReactECharts option={option} style={{ height }} notMerge />
}
