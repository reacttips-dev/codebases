import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import ProfileSummary from './ProfileSummary'
import KpiMetricTableHeader from './KpiMetricTableHeader'
import { FormattedDateString } from './FormattedDate'
import { sortByInteger } from '../utils/sort'
import { ArrowRightIcon } from './Icon'
import MetricTable from './MetricTable'

import { RichFormatter } from '../utils/MetricFormatter'

const SnapshotSummary = ({
  snapshotRoute,
  testProfiles,
  summary,
  initialSortBy,
  initialSortDirection
}) => {
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortDirection, setSortDirection] = useState(initialSortDirection)
  const rootSummary = summary[0]

  if (!rootSummary) return null

  const kpiMetrics = [
    ...new Set(summary.map(measurement => measurement.metric.name))
  ].map(name => summary.find(measurement => measurement.name === name).metric)

  const TitleCell = () =>
    rootSummary && (
      <td>
        <Link
          to={snapshotRoute({ snapshot: rootSummary.snapshot })}
          title={`View Snapshot #${rootSummary.snapshot}`}
        >
          <h3 className="type-medium text-link m--b0">
            Snapshot #{rootSummary.snapshot} <ArrowRightIcon mt="-3px" />
          </h3>
          <p className="m--0 type-dim type-small">
            {FormattedDateString({ date: rootSummary.timestamp })}
          </p>
        </Link>
      </td>
    )

  const sortedProfiles = testProfiles.slice().sort((a, b) => {
    const primary = summary.find(
      measurement =>
        measurement.profile === a.uuid && measurement.name === sortBy
    )
    const secondary = summary.find(
      measurement =>
        measurement.profile === b.uuid && measurement.name === sortBy
    )

    return sortByInteger(
      primary && primary.value,
      secondary && secondary.value,
      sortDirection
    )
  })

  return (
    <div className="page-section">
      <React.Suspense>
        <MetricTable>
          <KpiMetricTableHeader
            TitleCell={TitleCell}
            metrics={kpiMetrics}
            sortBy={sortBy}
            onSortBy={setSortBy}
            sortDirection={sortDirection}
            onSortDirection={setSortDirection}
          />
          <tbody>
            {sortedProfiles.map((testProfile, idx) => {
              const measurements = summary.filter(
                measurement => measurement.profile === testProfile.uuid
              )
              const hasValueToDisplay = measurements.find(
                measurement => !!measurement.value
              )

              return (
                <tr key={idx}>
                  <td>
                    <ProfileSummary
                      as="div"
                      snapshot={rootSummary.snapshot}
                      link={snapshotRoute({
                        snapshot: rootSummary.snapshot,
                        profile: testProfile.uuid
                      })}
                      borderBottomWidth={0}
                      p={0}
                      {...testProfile}
                    />
                  </td>
                  {(hasValueToDisplay &&
                    kpiMetrics.map((metric, index) => {
                      const measurement = measurements.find(
                        measurement => measurement.name === metric.name
                      )
                      return (
                        <td key={index}>
                          <RichFormatter
                            value={measurement && measurement.value}
                            formatter={metric.formatter}
                            level="md"
                            grading={measurement && measurement.grading}
                          />
                        </td>
                      )
                    })) || (
                    <td className="type-dim type-tiny" colSpan="3">
                      <em>Test did not complete successfully</em>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </MetricTable>
      </React.Suspense>
    </div>
  )
}

export default SnapshotSummary
