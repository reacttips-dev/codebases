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

import React, { FunctionComponent } from 'react'
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { mapValues, keyBy } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFormLabel,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiTextArea,
  EuiText,
  EuiCheckboxGroup,
  EuiFormRow,
} from '@elastic/eui'

import { FeedbackType } from '../../../../../types/custom'

import messages from './messages'

type Props = {
  intl: IntlShape
  closeFeedbackModal: () => void
  stopAndHide: () => void
  stop: () => void
  feedback: string
  isInvalid: boolean
  onChangeFeedback: (e) => void
  onCheckboxChange: (id: string) => void
  selectedReasons: FeedbackType[]
}

const FeedbackModal: FunctionComponent<Props> = ({
  intl: { formatMessage },
  closeFeedbackModal,
  stop,
  feedback,
  isInvalid,
  onChangeFeedback,
  onCheckboxChange,
  selectedReasons,
}) => {
  const reasons = [
    {
      'data-test-id': `not-needed`,
      id: `not_needed`,
      label: formatMessage(messages.feedbackCompletedTesting),
    },
    {
      'data-test-id': `consolidating-accounts`,
      id: `consolidating_accounts`,
      label: formatMessage(messages.feedbackConsolidating),
    },
    {
      'data-test-id': `too-expensive`,
      id: `too_expensive`,
      label: formatMessage(messages.feedbackTooExpensive),
    },
    {
      'data-test-id': `stability-issues`,
      id: `stability_issues`,
      label: formatMessage(messages.feedbackDeploymentStability),
    },
    {
      'data-test-id': `bad-support`,
      id: `bad_support`,
      label: formatMessage(messages.feedbackSupport),
    },
    {
      'data-test-id': `bad-documentation`,
      id: `bad_documentation`,
      label: formatMessage(messages.feedbackDocumentation),
    },
    {
      'data-test-id': `other`,
      id: `other`,
      label: formatMessage(messages.feedbackOther),
    },
  ]
  const checkboxIdToSelectedMap = mapValues(keyBy(selectedReasons), () => true)

  return (
    <EuiOverlayMask>
      <EuiModal onClose={closeFeedbackModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.title'
              defaultMessage='Delete your deployment?'
            />
          </EuiModalHeaderTitle>
        </EuiModalHeader>
        <EuiModalBody>
          <EuiFormLabel>
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.feedback-segue'
              defaultMessage='If you have a moment, please let us know why you are deleting this deployment.'
            />
          </EuiFormLabel>
          <EuiText color='subdued' size='xs'>
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.feedback-segue.directions'
              defaultMessage='Please check ALL that apply'
            />
          </EuiText>
          <EuiSpacer size='m' />
          <EuiCheckboxGroup
            options={reasons}
            idToSelectedMap={checkboxIdToSelectedMap}
            onChange={(id) => onCheckboxChange(id)}
          />

          <EuiSpacer size='m' />

          <EuiFormRow
            label={
              <FormattedMessage
                id='deployment-shut-down-and-hide-deployment.feedback-text'
                defaultMessage='Got feedback for our product team?'
              />
            }
            isInvalid={isInvalid}
            error={
              <FormattedMessage
                data-test-id='invalid-selection-message'
                id='deployment-shut-down-and-hide-deployment.feedback-text.error'
                defaultMessage='Provide some details in the feedback box.'
              />
            }
            fullWidth={true}
          >
            <EuiTextArea
              fullWidth={true}
              data-test-id='delete-survey-text'
              value={feedback}
              onChange={(e) => onChangeFeedback(e)}
            />
          </EuiFormRow>
        </EuiModalBody>
        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeFeedbackModal}>
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.cancel'
              defaultMessage='Cancel'
            />
          </EuiButtonEmpty>

          <EuiButton
            disabled={!selectedReasons.length}
            onClick={stop}
            fill={true}
            color='danger'
            data-test-id='delete-survey-confirm'
          >
            <FormattedMessage
              id='deployment-shut-down-and-hide-deployment.confirm'
              defaultMessage='Delete'
            />
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  )
}

export default injectIntl(FeedbackModal)
