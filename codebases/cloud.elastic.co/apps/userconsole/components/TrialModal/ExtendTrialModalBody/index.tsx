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

import React, { Fragment, Component } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelect,
  EuiTextArea,
  EuiModalFooter,
  EuiText,
} from '@elastic/eui'

import messages from './messages'

import TrialExtensionError from '../TrialExtensionError'
import ProvideBillingDetailsButton from '../ProvideBillingDetailsButton'

import { AsyncRequestState } from '../../../../../types'

type State = {
  selectedAnswer: string
  textAreaValue: string
  showTextError: boolean
  showSelectError: boolean
}

interface Props extends WrappedComponentProps {
  extendTrial: (selectedAnswer, textAreaValue) => Promise<any>
  extendTrialRequest: AsyncRequestState
  requestTrialExtension: (selectedAnswer, textAreaValue) => void
  close: () => void
}

class ExtendTrialModalBody extends Component<Props, State> {
  state: State = {
    selectedAnswer: `immediately`,
    textAreaValue: ``,
    showTextError: false,
    showSelectError: false,
  }

  render() {
    const {
      intl: { formatMessage },
      extendTrial,
      extendTrialRequest,
      close,
    } = this.props
    const { showSelectError, showTextError, textAreaValue, selectedAnswer } = this.state
    const options = [
      {
        value: `immediately`,
        text: formatMessage(messages.immediately),
      },
      {
        value: `within_a_month`,
        text: formatMessage(messages.withinMonth),
      },
      {
        value: `longer_than_month`,
        text: formatMessage(messages.longerThanMonth),
      },
      {
        value: `exploring`,
        text: formatMessage(messages.exploring),
      },
    ]

    return (
      <Fragment>
        <EuiModalHeader className='extendModalHeader'>
          <EuiModalHeaderTitle>
            <FormattedMessage data-test-id='expired-trial-modal' {...messages.title} />
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody className='trialModalBody'>
          <EuiFlexGroup direction='column'>
            <EuiFlexItem style={{ maxWidth: '420px' }}>
              <EuiForm>
                <EuiFormRow
                  isInvalid={showSelectError}
                  error={formatMessage(messages.selectError)}
                  label={formatMessage(messages.questionOne)}
                >
                  <EuiSelect
                    value={selectedAnswer}
                    onChange={(e) =>
                      this.setState({
                        selectedAnswer: e.target.value,
                      })
                    }
                    options={options}
                  />
                </EuiFormRow>

                <EuiFormRow
                  isInvalid={showTextError}
                  error={formatMessage(messages.textError)}
                  label={formatMessage(messages.questionTwo)}
                >
                  <EuiTextArea
                    onChange={(e) => this.setState({ textAreaValue: e.target.value })}
                    value={textAreaValue}
                    rows={2}
                  />
                </EuiFormRow>
                <EuiSpacer size='m' />
                <EuiText
                  className='extendModalFooter-infoMessage'
                  color='subdued'
                  textAlign='left'
                  size='xs'
                >
                  <FormattedMessage {...messages.extendTrialNotice} />
                </EuiText>
              </EuiForm>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalBody>

        <EuiModalFooter className='extendModalFooter'>
          <EuiFlexGroup direction='column'>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize='m' justifyContent='center'>
                <EuiFlexItem grow={2}>
                  <EuiButton
                    disabled={extendTrialRequest.inProgress}
                    fill={true}
                    onClick={() => this.onClick()}
                  >
                    <FormattedMessage {...messages.extendTrial} />
                  </EuiButton>
                </EuiFlexItem>
                <ProvideBillingDetailsButton grow={3} close={close} fill={false} />
              </EuiFlexGroup>
            </EuiFlexItem>
            {extendTrialRequest.error && (
              <EuiFlexItem>
                <TrialExtensionError
                  extendTrial={extendTrial}
                  extendTrialRequest={extendTrialRequest}
                />
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiModalFooter>
      </Fragment>
    )
  }

  onClick = () => {
    const { selectedAnswer, textAreaValue } = this.state
    const { requestTrialExtension } = this.props

    if (!selectedAnswer) {
      this.setState({ showSelectError: true })
    }

    if (textAreaValue.length < 1) {
      this.setState({ showTextError: true })
    } else {
      this.setState({ showTextError: false, showSelectError: false })
      requestTrialExtension(selectedAnswer, textAreaValue)
    }
  }
}

export default injectIntl(ExtendTrialModalBody)
