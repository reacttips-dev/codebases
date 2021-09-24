import React from 'react'
import classnames from 'classnames'

import { filesize } from 'humanize'
import { FormattedNumber } from 'react-intl'

import FormattedBreakWord from './FormattedBreakWord'
import FormattedDuration from './FormattedDuration'
import FormattedFileSize from './FormattedFileSize'
import {
  CheckRoundIcon,
  CrossRoundIcon,
  MinusRoundIcon,
  HelpRoundIcon,
  InfoRoundIcon
} from './Icon'

import Bugtracker from '../utils/bugtracker'
import markdown from '../utils/lighthouseMarkdown'

const NEUTRAL_SCORE_DISPLAY_MODES = ['notApplicable', 'manual', 'informative']

class LighthouseAuditItem extends React.Component {
  get scoreIcon() {
    if (this.props.score > 0.75)
      return (
        <span className="type-c-green">
          <CheckRoundIcon verticalAlign="middle" />
        </span>
      )

    if (this.props.score > 0.45 && this.props.score < 0.75)
      return (
        <span className="type-c-amber">
          <CrossRoundIcon verticalAlign="middle" />
        </span>
      )

    if (
      !NEUTRAL_SCORE_DISPLAY_MODES.includes(this.props.scoreDisplayMode) &&
      this.props.score < 0.45
    )
      return (
        <span className="type-c-red">
          <CrossRoundIcon verticalAlign="middle" />
        </span>
      )

    if (this.props.scoreDisplayMode === 'notApplicable')
      return (
        <span className="type-c-neutral">
          <MinusRoundIcon verticalAlign="middle" />
        </span>
      )

    if (this.props.scoreDisplayMode === 'informative')
      return (
        <span className="type-c-neutral">
          <InfoRoundIcon verticalAlign="middle" />
        </span>
      )

    return (
      <span className="type-c-neutral">
        <HelpRoundIcon verticalAlign="middle" />
      </span>
    )
  }

  formatTable(audit) {
    try {
      let headings

      // LH3 / LH2
      if (audit.details.headings) {
        // LH3
        headings = audit.details.headings
      } else {
        // LH 2
        headings = audit.details.itemHeaders
      }

      const { items } = audit.details

      return (
        <details>
          <summary>Details</summary>
          <table className="table table--tiny m--b1">
            <thead>
              <tr>
                {headings.map((heading, index) => (
                  <th key={index}>{heading.text || heading.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((row, index) => {
                // LH3 rows are hashes, whereas LH2 was an array of arrays
                if (!('map' in row)) {
                  // LH3
                  return this.renderItem({ headings, row, index })
                } else {
                  // LH2
                  return (
                    <tr key={index}>
                      {row.map((field, i) => (
                        <td className="markdown" key={i}>
                          <FormattedBreakWord>{field.text}</FormattedBreakWord>
                        </td>
                      ))}
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </details>
      )
    } catch (e) {
      console.error(e)
      Bugtracker.notify(e)
    }
  }

  renderItem({ headings, row, index }) {
    return (
      <React.Fragment key={index}>
        <tr>
          {headings.map((heading, i) => {
            const { key, itemType, valueType } = heading
            let value = row[key]

            return (
              <td key={i}>
                {this.renderItemValue({ value, itemType, valueType, index: i })}
              </td>
            )
          })}
        </tr>
        {row.subItems
          ? row.subItems.items.map((subItemRow, index) => {
              const subHeadings = headings.filter(
                ({ subItemsHeading }) => subItemsHeading
              )

              return (
                <tr key={index}>
                  {subHeadings.map(({ subItemsHeading }, i) => (
                    <td
                      key={i}
                      style={{ paddingLeft: i === 0 ? '20px' : '10px' }}
                      colSpan={
                        i === 0 ? headings.length - subHeadings.length + 1 : 1
                      }
                    >
                      {this.renderItemValue({
                        ...subItemsHeading,
                        itemType: subItemsHeading.key,
                        value: subItemRow[subItemsHeading.key]
                      })}
                    </td>
                  ))}
                </tr>
              )
            })
          : null}
      </React.Fragment>
    )
  }

  renderItemValue({ value, itemType, valueType }) {
    if (value == null) return null

    if (itemType === 'node') return this.renderNodeValue({ value })

    if (typeof value === 'object') {
      if (value.type === 'node') {
        value = value.snippet
      } else if (value.type === 'link') {
        value = <a href={value.url}>{value.text}</a>
      } else {
        value = value.value || value.url
      }
    }

    if (value && (itemType === 'numeric' || valueType == 'numeric'))
      return (
        <FormattedNumber value={parseFloat(String(value).replace(/,/g, ''))} />
      )

    if (value && (itemType === 'ms' || valueType == 'timespanMs'))
      return <FormattedDuration value={value} />

    if (
      value &&
      (['bytes', 'sourceBytes', 'sourceWastedBytes'].includes(itemType) ||
        ['bytes', 'sourceBytes', 'sourceWastedBytes'].includes(valueType))
    )
      return <FormattedFileSize value={value} />

    if (value && (itemType === 'thumbnail' || valueType == 'thumbnail'))
      return <img src={value} width="100" />

    return (
      <span>
        <FormattedBreakWord>{value}</FormattedBreakWord>
      </span>
    )
  }

  renderNodeValue({ value }) {
    const { explanation, snippet } = value

    return (
      <div className="m--b4">
        {explanation ? (
          <p className="type-semibold">
            <FormattedBreakWord>{explanation}</FormattedBreakWord>
          </p>
        ) : null}
        {snippet ? (
          <div className="island">
            <code>
              <FormattedBreakWord>{snippet}</FormattedBreakWord>
            </code>
          </div>
        ) : null}
      </div>
    )
  }

  formatList(audit) {
    const list = audit.details.items

    return (
      <details>
        <summary>{audit.details.header.text}</summary>
        <ul className="bullets m--t2">
          {list.map((item, idx) => {
            return (
              <li key={idx} className="bullets__item type-dim">
                <FormattedBreakWord text={item.text} />
              </li>
            )
          })}
        </ul>
      </details>
    )
  }

  renderCriticalRequestTree(chain, idx) {
    const url = new URL(chain.request.url)

    return (
      <dl key={idx}>
        <dt className="type-small">
          <span className="type-menlo">{url.pathname}</span>{' '}
          <span className="type-dim">({url.host})</span>
          &nbsp;
          {chain.request && (
            <span className="badge type-small">
              <FormattedDuration
                value={(chain.request.endTime - chain.request.startTime) * 1000}
              />
            </span>
          )}
        </dt>
        {chain.children &&
          Object.keys(chain.children).map((key, jdx) => (
            <dd key={jdx}>
              {this.renderCriticalRequestTree(chain.children[key], jdx)}
            </dd>
          ))}
      </dl>
    )
  }

  formatCriticalRequestChain(audit) {
    const { chains, longestChain } = audit.details

    return (
      <details className="m--t2">
        <summary>
          Longest chain&nbsp;
          <strong>
            <FormattedDuration value={longestChain.duration} />
          </strong>
          &nbsp;totalling&nbsp;
          <strong>{filesize(longestChain.transferSize)}</strong>
        </summary>

        {Object.keys(chains).map((key, idx) =>
          this.renderCriticalRequestTree(chains[key], idx)
        )}
      </details>
    )
  }

  formatErrors(errors) {
    return (
      <React.Fragment>
        <ul className="type-bold m--t2 m--b2">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </React.Fragment>
    )
  }

  format(audit) {
    if (
      audit.details &&
      audit.details.type === 'table' &&
      audit.details.items.length
    ) {
      return this.formatTable(audit)
    }
    if (
      audit.details &&
      audit.details.type === 'opportunity' &&
      audit.details.items.length
    ) {
      return this.formatTable(audit)
    }
    if (
      audit.details &&
      audit.details.type === 'list' &&
      audit.details.items.length
    ) {
      return this.formatList(audit)
    }
    if (
      audit.details &&
      audit.details.type === 'criticalrequestchain' &&
      audit.details.chains
    ) {
      return this.formatCriticalRequestChain(audit)
    }

    // Has failures to list
    if (
      audit.details &&
      audit.details.items &&
      audit.details.items[0] &&
      audit.details.items[0].failures
    ) {
      return this.formatErrors(audit.details.items[0].failures)
    }
  }

  // Pinched from https://github.com/GoogleChrome/lighthouse/blob/b70d1ca7b3f453618b074907a0b67a7b41aa24d3/lighthouse-core/report/html/renderer/util.js#L100-L134
  formatDisplayValue(displayValue) {
    if (typeof displayValue === 'string') return displayValue
    if (!displayValue) return ''

    const replacementRegex = /%([0-9]*(\.[0-9]+)?d|s)/
    const template = /** @type {string} */ (displayValue[0])
    if (typeof template !== 'string') {
      // First value should always be the format string, but we don't want to fail to build
      // a report, return a placeholder.
      return 'UNKNOWN'
    }

    let output = template
    for (const replacement of displayValue.slice(1)) {
      if (!replacementRegex.test(output)) {
        console.warn('Too many replacements given')
        break
      }

      output = output.replace(replacementRegex, match => {
        const granularity = Number(match.match(/[0-9.]+/)) || 1
        return match === '%s'
          ? replacement.toLocaleString()
          : (
              Math.round(Number(replacement) / granularity) * granularity
            ).toLocaleString()
      })
    }

    if (replacementRegex.test(output)) {
      console.warn('Not enough replacements given')
    }

    return output
  }

  get summary() {
    const { displayValue, debugString, errorMessage } = this.props

    const summary =
      (displayValue && this.formatDisplayValue(this.props.displayValue)) ||
      debugString ||
      errorMessage

    return <p className="type-semibold">{summary}</p>
  }

  render() {
    const classes = classnames('list-group__item', {
      'list-group__item--highlight-ok': this.props.score > 0.75,
      'list-group__item--highlight-amber':
        this.props.score > 0.45 && this.props.score < 0.75,
      'list-group__item--highlight-warning':
        !NEUTRAL_SCORE_DISPLAY_MODES.includes(this.props.scoreDisplayMode) &&
        this.props.score < 0.45,
      'list-group__item--highlight-neutral': NEUTRAL_SCORE_DISPLAY_MODES.includes(
        this.props.scoreDisplayMode
      )
    })

    let title, description

    // Lighthouse 2 or 3 differ with using this.props.result (2) and (3) being a less-structured (flat) object
    if (this.props.description) {
      // LH3
      title = this.props.title
      description = this.props.description
    } else if (this.props.result) {
      // LH2
      title = this.props.result.description
      description = this.props.result.helpText
    }

    return (
      <li className={classes}>
        <div className="media">
          <div className="media__object">{this.scoreIcon}</div>

          <div className="media__body">
            <h3
              className="m--0 type-large type-semibold markdown"
              dangerouslySetInnerHTML={markdown(title)}
            />
            <div
              className="m--0  type-c-rich-primary markdown"
              dangerouslySetInnerHTML={markdown(description)}
            />

            {this.summary}

            {this.format(this.props)}
          </div>
        </div>
      </li>
    )
  }
}

export default LighthouseAuditItem
