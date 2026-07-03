import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

const light = {
  bgElevated: '#ffffff',
  bgCard: '#ffffff',
  borderDefault: '#e0e2e6',
  borderSubtle: '#e8eaed',
  textPrimary: '#2c3235',
  textSecondary: '#767980',
  textTertiary: '#9ca0a8',
  blue: '#6f96d9',
  green: '#6fbf73',
  red: '#e24d5d',
  yellow: '#f5c542',
  purple: '#967bde',
  orange: '#f08c3e',
}

const dark = {
  bgElevated: '#1e2026',
  bgCard: '#1a1c21',
  borderDefault: '#4a4f5a',
  borderSubtle: '#3f4450',
  textPrimary: '#e2e4e7',
  textSecondary: '#8e94a0',
  textTertiary: '#9ea4b0',
  blue: '#6f96d9',
  green: '#6fbf73',
  red: '#e24d5d',
  yellow: '#f5c542',
  purple: '#967bde',
  orange: '#f08c3e',
}

export function useChartTheme() {
  const { theme } = useTheme()
  return useMemo(() => (theme === 'dark' ? dark : light), [theme])
}
