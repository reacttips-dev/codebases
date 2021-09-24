import React, { Suspense } from 'react'
import humanize from 'humanize'
import classNames from 'classnames'

import FormattedBreakWord from './FormattedBreakWord'
import { RichFormatter } from '../utils/MetricFormatter'
import { Td, Tbody, Tr } from './Table'
import Dl, { Dd, Dt } from './DescriptionList'
import { TextLink } from './Type'

import Loader from './Loader'

const SegmentedControl = React.lazy(() => import('./SegmentedControl'))

class HarRequestTableRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  toggleDetails() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  renderHeaders(headers) {
    return headers.map((header, i) => {
      return (
        <Dl key={i}>
          <Dt>{header.name}</Dt>
          <Dd>{header.value}</Dd>
        </Dl>
      )
    })
  }

  renderTimings() {
    return (
      <React.Fragment>
        <Dl>
          <Dt>Blocked</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.blocked}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>DNS</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.dns}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>Connect</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.connect}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>Send</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.send}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>Wait</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.wait}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>SSL</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.ssl}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
        <Dl>
          <Dt>Receive</Dt>
          <Dd>
            <RichFormatter
              value={this.props.timings.receive}
              formatter="humanDuration"
            />
          </Dd>
        </Dl>
      </React.Fragment>
    )
  }

  panel() {
    if (this.state.expanded) {
      return (
        <Tr selectable={true}>
          <Td colSpan="11" p={0}>
            <TextLink
              href={this.props.request.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedBreakWord>{this.props.request.url}</FormattedBreakWord>
            </TextLink>

            <Suspense fallback={<Loader />}>
              <SegmentedControl
                items={[
                  {
                    label: 'Timings',
                    value: 'timings',
                    content: this.renderTimings()
                  },
                  {
                    label: 'Response headers',
                    value: 'response-headers',
                    content: this.renderHeaders(this.props.response.headers)
                  },
                  {
                    label: 'Request headers',
                    value: 'request-headers',
                    content: this.renderHeaders(this.props.request.headers)
                  }
                ]}
              />
            </Suspense>
          </Td>
        </Tr>
      )
    } else {
      return null
    }
  }

  assetType() {
    const classes = classNames({
      key: true,
      'key--blue': this.props.assetClassification == 'HTML',
      'key--orange': this.props.assetClassification == 'JavaScript',
      'key--green': this.props.assetClassification == 'CSS',
      'key--purple': this.props.assetClassification == 'Image',
      'key--red': this.props.assetClassification == 'Font',
      'key--yellow': this.props.assetClassification == 'JSON',
      'key--black': this.props.assetClassification == 'Video',
      'key--grey': this.props.assetClassification == 'Other'
    })

    return (
      <span className={classes}>
        <span className="key__label">{this.props.assetClassification}</span>
      </span>
    )
  }

  render() {
    const { sequence, pathname, host, priority, totalRequestTime } = this.props
    let transferSize = ''
    let contentSize = ''

    if (this.props.response['_transferSize'])
      transferSize = humanize.filesize(this.props.response['_transferSize'])

    if (this.props.response.content.size)
      contentSize = humanize.filesize(this.props.response.content.size)

    return (
      <Tbody
        stripedColor="grey50"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="grey100"
      >
        <Tr
          onClick={this.toggleDetails.bind(this)}
          style={{ cursor: 'pointer' }}
        >
          <Td level="xs" fontSize={2} borderColor="grey100">
            {sequence}
          </Td>
          <Td level="xs" fontSize={2} borderColor="grey100">
            <span className="badge badge--plain">{this.props.method}</span>
          </Td>
          <Td level="xs" fontSize={2} borderColor="grey100">
            <span
              className={
                this.props.response.status >= 400 ? `type-c-red` : null
              }
            >
              {this.props.response.status}
            </span>
          </Td>
          <Td
            level="xxs"
            className="type-menlo"
            fontSize={2}
            borderColor="grey100"
          >
            {pathname}
          </Td>
          <Td level="xxs" fontSize={2} borderColor="grey100">
            {host}
          </Td>
          <Td level="xxs" fontSize={2} borderColor="grey100">
            {this.props.response.httpVersion}
          </Td>
          <Td level="xs" fontSize={2} borderColor="grey100">
            {priority}
          </Td>
          <Td level="xs" fontSize={2} borderColor="grey100">
            {this.assetType()}
          </Td>
          <Td level="xs" textAlign="right" fontSize={2} borderColor="grey100">
            {transferSize}
          </Td>
          <Td level="xs" textAlign="right" fontSize={2} borderColor="grey100">
            {contentSize}
          </Td>
          <Td level="xs" textAlign="right" fontSize={2} borderColor="grey100">
            <RichFormatter value={totalRequestTime} formatter="humanDuration" />
          </Td>
        </Tr>
        {this.panel()}
      </Tbody>
    )
  }
}

export default HarRequestTableRow
