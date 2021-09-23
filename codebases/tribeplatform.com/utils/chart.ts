import {
  ChartData,
  ReportData,
  EntityReport,
  ReportableEntity,
} from 'tribe-api/interfaces'
import { formatCount, formatNumberWithCommas } from 'tribe-translation'

export const mergeByName = dataPoints => {
  const map = {}
  const days: any[] = []
  dataPoints.forEach(dataPoint => {
    const { xAxis, name, ...value } = dataPoint
    if (xAxis in map) {
      map[xAxis] = {
        ...map[xAxis],
        ...value,
      }
    } else {
      map[xAxis] = {
        name,
        ...value,
      }
      days.push(xAxis)
    }
  })
  return days.sort((a, b) => a - b).map((day: number) => map[day])
}

const transformCase = (str: string, isCamelCase = true) =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) return ''
    return index === 0 && isCamelCase
      ? match.toLowerCase()
      : match.toUpperCase()
  })

export const formatChartData = (reportData?: ReportData[] | null) => {
  if (!reportData || !Array.isArray(reportData)) return []

  const chartData = reportData.map(totalVisitors => {
    const { label, points } = totalVisitors.value as ChartData
    const parsedPoints = JSON.parse(points || '[]')
    return parsedPoints.map(point => ({
      name: point.xAxisLabel,
      [transformCase(label)]: point.yAxis,
      xAxis: point.xAxis,
    }))
  })

  if (chartData.length === 2) {
    return mergeByName([...chartData[0], ...chartData[1]])
  }

  return chartData[0]
}

export const formatTableData = (reportData?: ReportData[] | null) => {
  if (!reportData || !Array.isArray(reportData)) return []
  const tableData: { entity: ReportableEntity }[] = []
  reportData.forEach(tableRow => {
    const currentValue = tableRow?.value as EntityReport
    const previousValue = tableRow?.previousValue as EntityReport
    const entity = currentValue?.entity as ReportableEntity
    const previousEntity = previousValue?.entity as ReportableEntity
    const tableRowData = { entity: entity || previousEntity }

    const tableColumnsData = currentValue?.data || []
    tableColumnsData?.forEach(column => {
      if (column?.value?.__typename === 'IntValue') {
        tableRowData[transformCase(column?.key)] = formatCount(
          column?.value?.int,
        )
      } else if (column?.value?.__typename === 'StringValue') {
        tableRowData[transformCase(column?.key)] = column?.value?.string
      } else if (column?.value?.__typename === 'ChartData') {
        tableRowData[transformCase(column?.key)] = formatChartData([column])
      }
    })

    const previousTableColumnsData = previousValue?.data || []
    previousTableColumnsData?.forEach(column => {
      if (column?.value?.__typename === 'IntValue') {
        tableRowData[
          `previous${transformCase(column?.key, false)}`
        ] = formatCount(column?.value?.int)
      } else if (column?.value?.__typename === 'StringValue') {
        tableRowData[`previous${transformCase(column?.key, false)}`] =
          column?.value?.string
      }
    })

    tableData?.push(tableRowData)
  })
  return tableData
}

export const formatSimpleTableData = (
  key: string,
  reportData?: ReportData[] | null,
) => {
  if (!key || !reportData || !Array.isArray(reportData)) return []

  return reportData.map(tableRow => {
    const rowData: {
      value: string | number | null
    } = {
      [transformCase(key)]: tableRow?.description,
      value: null,
    }
    if (tableRow?.value?.__typename === 'StringValue') {
      rowData.value = tableRow.value.string
    } else if (tableRow?.value?.__typename === 'IntValue') {
      rowData.value = formatNumberWithCommas(tableRow?.value?.int)
    }

    return rowData
  })
}
