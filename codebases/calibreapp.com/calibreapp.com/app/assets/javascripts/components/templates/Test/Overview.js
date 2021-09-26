import React, { Suspense } from 'react'
import { FormattedMessage } from 'react-intl'

import Loader from '../../Loader'
import { Heading, Text, TextLink } from '../../Type'
import StatBar from '../../StatBar'
import Video from '../../Video'
import Image from '../../Image'
import Filmstrip from '../../Filmstrip'

import { RichFormatter } from '../../../utils/MetricFormatter'
import convertRequestToAssetClassification from '../../../utils/request-asset-type-classification'
import CategoryProvider from '../../CategoryProvider'
import filteredMetrics from '../../../utils/filteredMetrics'

const HarAssetsTypeChart = React.lazy(() => import('../../HarAssetsTypeChart'))
const HarRequestTable = React.lazy(() => import('../../HarRequestTable'))
const MainThreadActivity = React.lazy(() => import('../../MainThreadActivity'))
const FeedbackBlock = React.lazy(() => import('../../FeedbackBlock'))

const EXCLUDE_MEASUREMENTS = [
  'lighthouse-performance-score',
  'lighthouse-pwa-score',
  'lighthouse-accessibility-score',
  'lighthouse-best-practices-score',
  'lighthouse-seo-score',
  'third_party_count',
  'third_party_main_thread_duration',
  'third_party_size_in_bytes',
  'firstRender',
  'first-interactive',
  'first-meaningful-paint',
  'max-potential-fid',
  'visually_complete',
  'js-parse-compile',
  'onload',
  'visually_complete_85',
  'oncontentload',
  'asset_count',
  'page_dns_timing',
  'page_tcp_timing',
  'page_ssl_timing',
  'page_download_timing',
  'page_body_size_in_bytes',
  'html_body_size_in_bytes',
  'js_body_size_in_bytes',
  'image_body_size_in_bytes',
  'video_body_size_in_bytes',
  'font_body_size_in_bytes',
  'json_body_size_in_bytes',
  'css_body_size_in_bytes',
  'page_size_in_bytes',
  'html_size_in_bytes',
  'js_size_in_bytes',
  'image_size_in_bytes',
  'video_size_in_bytes',
  'font_size_in_bytes',
  'json_size_in_bytes',
  'css_size_in_bytes',
  'estimated-input-latency'
]

const ORDERED_MEASUREMENTS = [
  'largest_contentful_paint',
  'cumulative-layout-shift',
  'total-blocking-time',
  'time-to-first-byte',
  'page_wait_timing',
  'first-contentful-paint',
  'speed_index',
  'consistently-interactive',
  'testDuration'
]

const Overview = ({
  status,
  runMode,
  runtimeError,
  error,
  errorMessage,
  errorCode,
  measurements,
  screenshotUrl,
  videoUrl,
  screenshotTimeline,
  har,
  harUrl,
  mainThreadActivity
}) => {
  const pageTimelineMetrics = filteredMetrics(
    measurements,
    EXCLUDE_MEASUREMENTS
  )
    .sort((a, b) => {
      // Sort based on ordered measurements with unlist metrics at the end
      const primary = ORDERED_MEASUREMENTS.indexOf(a.name)
      const secondary = ORDERED_MEASUREMENTS.indexOf(b.name)
      if (primary < 0) return 1
      if (secondary < 0) return -1
      return primary < secondary ? -1 : 1
    })
    .map(measurement => ({
      metric: <RichFormatter {...measurement} level="lg" />,
      label: measurement.label
    }))

  const harEntries = ((har && har.log && har.log.entries) || [])
    .slice()
    .sort((a, b) => new Date(a.startedDateTime) - new Date(b.startedDateTime))
    .map((entry, index) => {
      const assetClassification = convertRequestToAssetClassification(
        entry.response.content.mimeType
      )
      const url = new URL(entry.request.url)

      const { blocked, dns, connect, send, wait, receive, ssl } = entry.timings

      // Use a reduce so that we can gate the -1 values (which mean nulls in har-speak)
      const totalRequestTime = [
        blocked,
        dns,
        connect,
        send,
        wait,
        receive,
        ssl
      ].reduce((prev, curr) => {
        if (curr <= 0) return prev
        return prev + curr
      }, 0)
      const method =
        entry.response.status >= 300 && entry.response.status < 400
          ? 'REDIRECT'
          : entry.request.method
      const priority =
        entry._priority === 'VeryHigh'
          ? 'Very High'
          : entry._priority === 'VeryLow'
          ? 'Very Low'
          : entry._priority

      return {
        ...entry,
        sequence: index + 1,
        host: url.host,
        pathname: url.pathname,
        assetClassification,
        method,
        priority,
        totalRequestTime
      }
    })

  const harTypes =
    (harEntries && [...new Set(harEntries.map(e => e.assetClassification))]) ||
    []
  const harCategories = harTypes.map(name => ({ name }))

  const ErrorDisplay = () => {
    if (errorCode) {
      return (
        <>
          <Heading>
            <FormattedMessage id="snapshot.runtimeError">
              {fallback => (
                <>
                  <FormattedMessage
                    id={`test.error.${errorCode}.title`}
                    defaultMessage={fallback}
                  />
                  <FormattedMessage
                    id={`test.error.${errorCode}.description`}
                    defaultMessage="null"
                  >
                    {description =>
                      description[0] === 'null' ? null : `: ${description}`
                    }
                  </FormattedMessage>
                </>
              )}
            </FormattedMessage>
          </Heading>
          <FormattedMessage
            id={`test.error.${errorCode}.message`}
            defaultMessage="null"
            values={{ errorMessage }}
          >
            {message => (
              <Text as="p">
                {message[0] === 'null' ? errorMessage : message}
              </Text>
            )}
          </FormattedMessage>
          <FormattedMessage
            id={`test.error.${errorCode}.hint`}
            defaultMessage="null"
          >
            {hint =>
              hint[0] === 'null' ? null : (
                <Text as="p" fontSize={2} color="grey400">
                  {hint}
                </Text>
              )
            }
          </FormattedMessage>
        </>
      )
    }

    if (errorMessage) {
      return (
        <>
          <h2 className="type-medium">
            <FormattedMessage id="snapshot.runtimeError" />
          </h2>
          <Text as="p" color="grey300">
            {errorMessage}
          </Text>
        </>
      )
    }

    if (error || (runtimeError && runtimeError.message)) {
      return (
        <>
          <h2 className="type-medium">
            <FormattedMessage id="snapshot.runtimeError" />
          </h2>
          <Text as="p" color="grey300">
            {error || (runtimeError && runtimeError.message)}
          </Text>
        </>
      )
    }

    return null
  }

  const RunModeDisplay = () => {
    if (!runMode || runMode === 'standard_mode') return null

    return (
      <Suspense fallback={<div />}>
        <FeedbackBlock type="warning" mb={4}>
          <FormattedMessage id={`test.mode.link`}>
            {link => (
              <FormattedMessage
                id={`test.mode.${runMode}`}
                values={{
                  link: (
                    <TextLink href="/docs/guides/test-modes" target="_blank">
                      {link}
                    </TextLink>
                  )
                }}
              />
            )}
          </FormattedMessage>
        </FeedbackBlock>
      </Suspense>
    )
  }

  return (
    <div>
      <div className="page-section">
        <RunModeDisplay />
        <div className="row top-xs">
          <div className="col-xs-12 col-md-8">
            {(status === 'errored' && (
              <div>
                <ErrorDisplay />
              </div>
            )) || <StatBar items={pageTimelineMetrics} />}
          </div>
          <div className="col-xs-12 col-md-4">
            {(videoUrl && (
              <Suspense fallback={<div />}>
                <Video src={videoUrl} poster={screenshotUrl} />
              </Suspense>
            )) ||
              (screenshotUrl && (
                <Suspense fallback={<div />}>
                  <Image
                    src={screenshotUrl}
                    width="100%"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="grey100"
                  />
                </Suspense>
              )) ||
              null}
          </div>
        </div>
      </div>

      {!screenshotTimeline || (
        <div className="page-section">
          <h2 className="type-medium">Render timeline</h2>
          <Suspense fallback={<div />}>
            <Filmstrip screenshots={screenshotTimeline} />
          </Suspense>
        </div>
      )}
      {(mainThreadActivity && (
        <Suspense fallback={<Loader />}>
          <MainThreadActivity mainThreadActivity={mainThreadActivity} />
        </Suspense>
      )) || <Loader />}
      {(har && (
        <Suspense fallback={<Loader />}>
          <CategoryProvider initialState={harCategories}>
            <HarAssetsTypeChart entries={harEntries} error={har.error} />
            <HarRequestTable harUrl={harUrl} har={har} entries={harEntries} />
          </CategoryProvider>
        </Suspense>
      )) || <Loader />}
    </div>
  )
}

Overview.defaultProps = {
  measurements: []
}

export default Overview
