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

import React, { Component, Fragment } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import { EuiButton, EuiSpacer } from '@elastic/eui'

import { PlanAttemptErrorDetails } from '../../../lib/stackDeployments'
import { CuiCodeBlock } from '../../../cui'
import stringify from '../../../lib/stringify'

type Props = {
  details: PlanAttemptErrorDetails
}

type State = {
  isExpanded: boolean
}

const messages = defineMessages({
  collapsed: {
    id: 'configuration-change-errors.show-details',
    defaultMessage: 'Show details',
  },
  expanded: {
    id: 'configuration-change-errors.hide-details',
    defaultMessage: 'Hide details',
  },
})

class StackConfigurationChangeErrorDetails extends Component<Props, State> {
  state: State = {
    isExpanded: false,
  }

  render() {
    const { details } = this.props
    const { isExpanded } = this.state
    const message = isExpanded ? messages.expanded : messages.collapsed

    return (
      <Fragment>
        <EuiButton
          color='warning'
          iconSide='right'
          iconType={isExpanded ? `arrowUp` : `arrowDown`}
          onClick={this.onButtonClick}
          size='s'
        >
          <FormattedMessage {...message} />
        </EuiButton>

        <EuiSpacer size='s' />

        {isExpanded && (
          <div style={{ width: `100%` }}>
            <CuiCodeBlock language='json' overflowHeight={400}>
              {stringify(details)}
            </CuiCodeBlock>
          </div>
        )}
      </Fragment>
    )
  }

  onButtonClick = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }))
  }
}

export default StackConfigurationChangeErrorDetails
