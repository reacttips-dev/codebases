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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage, injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'

import {
  EuiButton,
  EuiFilterButton,
  EuiIcon,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiToolTip,
} from '@elastic/eui'

import lightTheme from '../../lib/theme/light'

type Props = WrappedComponentProps & {
  help: ReactNode | null
  helpTitle: string
}

type State = {
  showHelp: boolean
}

const { euiBreakpoints } = lightTheme

const messages = defineMessages({
  openHelp: {
    id: `filter-context.open-help-label`,
    defaultMessage: `Open help menu …`,
  },
})

class FilterContextHelpImpl extends Component<Props, State> {
  state: State = {
    showHelp: false,
  }

  render() {
    const {
      intl: { formatMessage },
      help,
      helpTitle,
    } = this.props
    const { showHelp } = this.state

    return (
      <Fragment>
        <EuiFilterButton
          style={{ width: `40px` }}
          isSelected={showHelp}
          onClick={this.openHelp}
          aria-label={formatMessage(messages.openHelp)}
          data-test-id='helpButton'
        >
          <EuiToolTip content={formatMessage(messages.openHelp)}>
            <EuiIcon type='questionInCircle' />
          </EuiToolTip>
        </EuiFilterButton>

        {showHelp && (
          <EuiOverlayMask>
            <EuiModal onClose={this.closeHelp} style={{ maxWidth: euiBreakpoints.xl }}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>{helpTitle}</EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>{help}</EuiModalBody>

              <EuiModalFooter>
                <EuiButton onClick={this.closeHelp}>
                  <FormattedMessage id='filter-context.close' defaultMessage='Close' />
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        )}
      </Fragment>
    )
  }

  openHelp = () => {
    this.setState({ showHelp: true })
  }

  closeHelp = () => {
    this.setState({ showHelp: false })
  }
}

export default injectIntl(FilterContextHelpImpl)
