import React, { Suspense } from 'react'
import { FormattedMessage } from 'react-intl'

import Loader from './Loader'

import { Heading, Text } from './Type'
import { Box } from '@rebass/grid'

const LighthouseAggregationGroup = React.lazy(() =>
  import('./LighthouseAggregationGroup')
)

import markdown from '../utils/lighthouseMarkdown'

const FILTERED_METRIC_IDS = [
  'metrics',
  'performance-budget',
  'diagnostics',
  'resource-summary',
  'main-thread-tasks'
]

const NoAuditsAvailable = () => {
  return (
    <div className="align align--center align--middle stretch-height">
      <div className="align__content">
        <h1 className="m--b0">
          <FormattedMessage id="test.no_audits.title" />
        </h1>
      </div>
    </div>
  )
}

const LighthouseReport = ({ lighthouseReport, reportCategory }) => {
  let report
  let name
  let description

  let passedAudits = []
  let failedAudits = []
  let notApplicable = []
  let informative = []
  let manual = []

  const auditDidPass = auditScore => auditScore >= 0.75

  if (
    !lighthouseReport ||
    lighthouseReport.error ||
    // If it's lighthouse before version 2, we're bailing out.
    lighthouseReport.aggregations ||
    !Object.keys(lighthouseReport).length
  ) {
    return <NoAuditsAvailable />
  }

  // If > lighthouse 2
  if (
    lighthouseReport.lhr ||
    parseInt(lighthouseReport.lighthouseVersion, 10) >= 7
  ) {
    const { audits = {}, categories = {} } =
      lighthouseReport.lhr || lighthouseReport

    report = categories[reportCategory]
    if (!report) return <NoAuditsAvailable />

    name = report.title
    description = report.description

    report.auditRefs
      .map(ref => audits[ref.id])
      .filter(audit => audit !== undefined)
      .filter(audit => !FILTERED_METRIC_IDS.includes(audit.id))
      .filter(
        audit => !(audit.scoreDisplayMode === 'numeric' && !audit.details)
      )
      .forEach(audit => {
        if (audit.scoreDisplayMode === 'notApplicable') {
          notApplicable.push(audit)
        } else if (audit.scoreDisplayMode === 'manual') {
          manual.push(audit)
        } else if (audit.scoreDisplayMode === 'informative') {
          informative.push(audit)
        } else if (audit.score >= 0.75) {
          passedAudits.push(audit)
        } else {
          failedAudits.push(audit)
        }
      })
  } else {
    // Lh2
    report = lighthouseReport.reportCategories.find(
      rp => rp.id == reportCategory
    )

    name = report.name
    description = report.description

    // Don't include the any audit items if they're classified as metrics by lighthouse
    passedAudits = report.audits
      .filter(audit => audit.group !== 'perf-metric')
      .filter(audit => auditDidPass(audit.score / 100))

    failedAudits = report.audits
      .filter(audit => audit.group !== 'perf-metric')
      .filter(audit => !auditDidPass(audit.score / 100))
  }

  return (
    <Suspense fallback={<Loader />}>
      <header className="section-header">
        <Heading as="h1" level="md">
          {name}
        </Heading>
        <Box width={2 / 3}>
          <Text
            as="p"
            color="grey300"
            mt={1}
            dangerouslySetInnerHTML={markdown(description)}
          />
        </Box>
      </header>

      <div className="page-section">
        {!failedAudits.length || (
          <>
            <h4 className="type-medium m--2">Opportunities</h4>
            <LighthouseAggregationGroup audits={failedAudits} />
          </>
        )}

        {!passedAudits.length || (
          <>
            <h4 className="type-medium m--2">Passed audits</h4>
            <LighthouseAggregationGroup audits={passedAudits} />
          </>
        )}

        {!informative.length || (
          <>
            <h4 className="type-medium m--2">Informative</h4>
            <LighthouseAggregationGroup audits={informative} />
          </>
        )}

        {!manual.length || (
          <>
            <h4 className="type-medium m--2">Items to manually check</h4>
            <LighthouseAggregationGroup audits={manual} />
          </>
        )}

        {!notApplicable.length || (
          <>
            <h4 className="type-medium m--2">Not applicable</h4>
            <LighthouseAggregationGroup audits={notApplicable} />
          </>
        )}
      </div>
    </Suspense>
  )
}

export default LighthouseReport
