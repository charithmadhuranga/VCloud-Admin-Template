import ReactECharts from 'echarts-for-react'
import { useChartTheme } from '../../hooks/useChartTheme'

export default function BarChart({ data, categories, colors, height = 300, stacked }) {
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
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderSubtle, type: 'dashed' } },
      axisLabel: { color: t.textTertiary, fontSize: 11 },
    },
    series: data.map((s, i) => ({
      name: s.name,
      type: 'bar',
      stack: stacked ? 'total' : undefined,
      barMaxWidth: 32,
      itemStyle: {
        color: colors?.[i] || [t.blue, t.green, t.yellow, t.red, t.purple][i],
        borderRadius: stacked ? 0 : [4, 4, 0, 0],
      },
      data: s.data,
    })),
  }

  return <ReactECharts option={option} style={{ height }} notMerge />
}
