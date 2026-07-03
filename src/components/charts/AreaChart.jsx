import ReactECharts from 'echarts-for-react'
import { useChartTheme } from '../../hooks/useChartTheme'

export default function AreaChart({ data, categories, colors, height = 300, smooth = true }) {
  const t = useChartTheme()

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: t.bgElevated,
      borderColor: t.borderDefault,
      textStyle: { color: t.textPrimary, fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: t.textSecondary, fontSize: 12 },
    },
    grid: { left: 40, right: 16, top: 20, bottom: 40 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: t.borderDefault } },
      axisLabel: { color: t.textTertiary, fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderSubtle, type: 'dashed' } },
      axisLabel: { color: t.textTertiary, fontSize: 11 },
    },
    series: data.map((s, i) => ({
      name: s.name,
      type: 'line',
      smooth,
      symbol: 'none',
      areaStyle: { opacity: 0.12, color: (colors?.[i] || [t.blue, t.green, t.yellow, t.red][i]) },
      lineStyle: { width: 2, color: colors?.[i] || [t.blue, t.green, t.yellow, t.red][i] },
      itemStyle: { color: colors?.[i] || [t.blue, t.green, t.yellow, t.red][i] },
      data: s.data,
    })),
  }

  return <ReactECharts option={option} style={{ height }} notMerge />
}
