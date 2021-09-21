/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import jif from 'jif'
import cx from 'classnames'

import {
  EuiFlexGrid,
  EuiCard,
  EuiFlexItem,
  EuiFormHelpText,
  EuiIconTip,
  EuiTextColor,
  EuiTitle,
  EuiSpacer,
} from '@elastic/eui'

import DocLink from '../../DocLink'
import OtherSize from './OtherSize'
import { Zone1, Zone2, Zone3 } from './ZoneIcons'

import './availabilityZone.scss'
import '../customImageButton.scss'

const messages = defineMessages({
  moreInformation: {
    id: `deployment-configure-availability-zone.icontip.aria`,
    defaultMessage: `More information`,
  },
  previousChoice: {
    id: `deployment-configure-availability-zone.icontip.message`,
    defaultMessage: `You chose {newValue, number} {newValue, plural, one {zone} other {zones}} (it was {oldValue, number} before).`,
  },
})

const availabilityZones = [
  {
    numberOfZones: 1,
    svg: Zone1,
    title: (
      <FormattedMessage
        id='deployment-configure-availability-zone.one-az.title'
        defaultMessage='1 Availability Zone'
      />
    ),
    label: (
      <FormattedMessage
        id='deployment-configure-availability-zone.one-az'
        defaultMessage='Great for testing and development'
      />
    ),
  },
  {
    numberOfZones: 2,
    svg: Zone2,
    title: (
      <FormattedMessage
        id='deployment-configure-availability-zone.two-az.title'
        defaultMessage='2 Availability Zones'
      />
    ),
    label: (
      <FormattedMessage
        id='deployment-configure-availability-zone.two-az'
        defaultMessage='For production use'
      />
    ),
  },
  {
    numberOfZones: 3,
    svg: Zone3,
    title: (
      <FormattedMessage
        id='deployment-configure-availability-zone.three-az.title'
        defaultMessage='3 Availability Zones'
      />
    ),
    label: (
      <FormattedMessage
        id='deployment-configure-availability-zone.three-az'
        defaultMessage='For mission critical environments'
      />
    ),
  },
]

function AvailabilityZone({
  intl,
  numberOfZones,
  previousNumberOfZones,
  onUpdate,
  availableNumberOfZones,
  allowMoreThanThreeZones,
  isFixed,
  alwaysAllow2Zones,
}) {
  const options = availabilityZones.slice(0, availableNumberOfZones).map((option) => ({
    ...option,
    disabled: isFixed && option.numberOfZones !== numberOfZones,
  }))
  const otherSize = allowMoreThanThreeZones && availableNumberOfZones > 3

  return (
    <div>
      <EuiTitle size='xs'>
        <h3>
          <FormattedMessage
            id='deployment-configure-availability-zone.fault-tolerance'
            defaultMessage='Fault tolerance'
          />
        </h3>
      </EuiTitle>

      <EuiFlexGrid gutterSize='l' className='availabilityGroup'>
        {options.map((option, index) => {
          const twoZonesAndTwoZoneRegion =
            option.numberOfZones === 2 && availableNumberOfZones === 2 && !alwaysAllow2Zones

          return (
            <Fragment key={option.numberOfZones}>
              {jif(index > 0, () => (
                <EuiSpacer size='s' />
              ))}
              <EuiFlexItem>
                <EuiCard
                  id={`fault-tolerance-${option.numberOfZones}`}
                  data-test-id={`configure-deployment-fault-tolerance--${option.numberOfZones}`}
                  className={cx({
                    'faultToleranceCard-selected': option.numberOfZones === numberOfZones,
                  })}
                  icon={<span className='tooltip-bump'>{option.svg}</span>}
                  title={option.title}
                  description={option.label}
                  disabled={twoZonesAndTwoZoneRegion || option.disabled}
                  onClick={() => onUpdate(option.numberOfZones)}
                />

                {jif(twoZonesAndTwoZoneRegion, () => (
                  <EuiFlexItem>
                    <EuiFormHelpText>
                      <EuiTextColor color='warning'>
                        <FormattedMessage
                          id='deployment-configure-availability-zone.not-ha'
                          defaultMessage='Not available when you only have two zones. See {learnMore} in the documentation to learn more.'
                          values={{
                            learnMore: (
                              <DocLink link='faultToleranceDocLink'>
                                <FormattedMessage
                                  id='deployment-configure-availability-zone.not-ha-learn-more'
                                  defaultMessage='Fault Tolerance'
                                />
                              </DocLink>
                            ),
                          }}
                        />
                      </EuiTextColor>
                    </EuiFormHelpText>
                  </EuiFlexItem>
                ))}
              </EuiFlexItem>
            </Fragment>
          )
        })}
      </EuiFlexGrid>
      {jif(otherSize, () => (
        <OtherSize
          numberOfZones={numberOfZones}
          availableNumberOfZones={availableNumberOfZones}
          onUpdate={onUpdate}
          renderTooltip={() => renderTooltip(intl, numberOfZones, previousNumberOfZones)}
        />
      ))}
    </div>
  )
}

function renderTooltip(intl, currentNumberOfZones, previousNumberOfZones) {
  if (previousNumberOfZones === undefined || previousNumberOfZones === currentNumberOfZones) {
    return null
  }

  return (
    <EuiIconTip
      aria-label={intl.formatMessage(messages.moreInformation)}
      content={intl.formatMessage(messages.previousChoice, {
        newValue: currentNumberOfZones,
        oldValue: previousNumberOfZones,
      })}
      type='iInCircle'
    />
  )
}

AvailabilityZone.propTypes = {
  numberOfZones: PropTypes.number.isRequired,
  previousNumberOfZones: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  availableNumberOfZones: PropTypes.number.isRequired,
  allowMoreThanThreeZones: PropTypes.bool,
}

AvailabilityZone.defaultProps = {
  allowMoreThanThreeZones: false,
}

export default injectIntl(AvailabilityZone)
