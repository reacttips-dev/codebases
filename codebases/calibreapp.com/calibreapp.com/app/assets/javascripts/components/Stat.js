import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedNumber, FormattedMessage } from 'react-intl'

import { InlineBox } from './Grid'
import { RichFormatter } from '../utils/MetricFormatter'
import Tooltip from './Tooltip'
import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from './Icon'

const StatChange = ({ item, threshold }) => {
  if (item.changePercentage) {
    const { changePercentage } = item

    const improvement = () => {
      switch (threshold) {
        case 'LessThan':
          return changePercentage > 0
        default:
          return changePercentage < 0
      }
    }

    const significantImprovement = () => {
      switch (threshold) {
        case 'LessThan':
          return changePercentage > 10
        default:
          return changePercentage < -10
      }
    }

    const significantDecline = () => {
      switch (threshold) {
        case 'LessThan':
          return changePercentage < -10
        default:
          return changePercentage > 10
      }
    }

    const iconClasses = classNames('icon', {
      'ion-arrow-down-c':
        (threshold === 'GreaterThan' && improvement()) ||
        (threshold === 'LessThan' && !improvement()),
      'ion-arrow-up-c':
        (threshold === 'GreaterThan' && !improvement()) ||
        (threshold === 'LessThan' && improvement()),
      'type-c-green': significantImprovement(),
      'type-c-red': significantDecline()
    })

    const textClasses = classNames({
      'type-c-green': significantImprovement(),
      'type-c-red': significantDecline()
    })

    return (
      <span className="stat-bar__changepercentage type-dim">
        <span className={iconClasses}>
          {(((threshold === 'GreaterThan' && improvement()) ||
            (threshold === 'LessThan' && !improvement())) && (
            <ArrowDownIcon verticalAlign="middle" />
          )) || <ArrowUpIcon verticalAlign="middle" />}
        </span>
        <span className={textClasses}>
          <FormattedNumber
            value={Math.abs(changePercentage)}
            maximumFractionDigits={1}
          />
          %
        </span>
      </span>
    )
  } else {
    return <React.Fragment />
  }
}

const Stat = ({ item, labelProp, level, help, threshold }) => {
  const metricClasses = classNames('stat-bar__metric', {
    'stat-bar__metric--with-previous': item.previous
  })

  return (
    <div data-qa={item.id} className="stat-bar__stat">
      <div className="stat-bar__metric-label">
        {item[labelProp] ? (
          item[labelProp]
        ) : (
          <FormattedMessage id={`charts.labels.${item.id}.now`} />
        )}{' '}
        {!help || (
          <InlineBox>
            <FormattedMessage id={`stats.${help}.${item.id}`}>
              {label => (
                <Tooltip label={label}>
                  <div>
                    <InfoIcon />
                  </div>
                </Tooltip>
              )}
            </FormattedMessage>
          </InlineBox>
        )}
      </div>
      <div className={metricClasses}>
        {item.metric || (
          <RichFormatter
            value={item.value}
            formatter={item.formatter}
            level={level}
            grading={item.grading}
          />
        )}
        <StatChange item={item} threshold={threshold} />
      </div>
      {!item.previous || (
        <React.Fragment>
          <div className="stat-bar__previous-label">
            <FormattedMessage id={`charts.labels.${item.id}.previous`} />{' '}
          </div>
          <div className="stat-bar__previous">{item.previous}</div>
        </React.Fragment>
      )}
    </div>
  )
}

Stat.propTypes = {
  item: PropTypes.shape({
    metric: PropTypes.node.isRequired,
    previous: PropTypes.node,
    difference: PropTypes.node,
    changePercentage: PropTypes.number,
    helpSource: PropTypes.string
  }).isRequired,
  level: PropTypes.string,
  labelProp: PropTypes.string
}

Stat.defaultProps = {
  level: 'lg',
  labelProp: 'label'
}

export default Stat
