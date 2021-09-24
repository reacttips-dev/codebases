import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { GetMetricTimeSeriesCSV } from '../queries/MetricQueries.gql'
import safeError from './safeError'

const downloadAsBlob = (name, dataString, fileType, extension) => {
  const blob = new Blob([dataString], {
    type: fileType
  })
  const a = document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  a.download = `${name}.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const downloadCSV = (name, data) => {
  downloadAsBlob(name, data, 'text/csv', 'csv')
}

export const downloadTimeSeriesCSV = () => {} //eslint-disable-line @typescript-eslint/no-empty-function

export const useTimeSeriesCSV = variables => {
  const [getCSV, { loading, data, error }] = useLazyQuery(
    GetMetricTimeSeriesCSV,
    {
      variables
    }
  )

  useEffect(() => {
    if (!loading && data) {
      const {
        organisation: {
          site: {
            name,
            timeSeries: { csv, pages, measurements }
          }
        }
      } = data
      downloadCSV(`${name} - ${pages[0].name} - ${measurements[0].label}`, csv)
    }

    if (error) {
      console.error(error)
      alert(safeError(error))
    }
  }, [loading])

  return getCSV
}
