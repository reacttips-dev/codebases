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

import { get, isEmpty } from 'lodash'

import React, { Component, Fragment, ReactNode } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import {
  EuiCallOut,
  EuiFieldText,
  EuiLoadingContent,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTextArea,
} from '@elastic/eui'

import { CuiAlert } from '../../../../../cui/Alert'

import SearchDeployments from './SearchDeployments'
import SupportCaseCategorySelector from './SupportCaseCategorySelector'

import SpinButton from '../../../../../components/SpinButton'
import PrivacySensitiveContainer from '../../../../../components/PrivacySensitiveContainer'

import { userSettingsUrl } from '../../../../../lib/urlBuilder'

import { AsyncRequestState, ElasticsearchCluster, ProfileState } from '../../../../../types'
import { SearchRequest } from '../../../../../lib/api/v1/types'
import { SupportCaseData } from '../../../actions/supportCases'

const messages = defineMessages({
  howCanWeHelpYou: {
    id: `help.description-placeholder`,
    defaultMessage: `How can we help you? Please include as much information as you can.`,
  },
})

export interface Props extends WrappedComponentProps {
  isHeroku: boolean
  profile: NonNullable<ProfileState>
  searchResults: {
    matchCount: number
    totalCount: number
    record: ElasticsearchCluster[]
  }
  searchRequest: AsyncRequestState
  search: (query: SearchRequest) => void
  supportCaseRequest: AsyncRequestState
  createSupportCase: (supportCaseData: SupportCaseData) => Promise<any>
  resetCreateSupportCaseRequest: () => void
}

type Errors = {
  [field: string]: ReactNode
}

interface State {
  deploymentId: string | null
  category: string
  description: string
  errors: Errors
}

class SupportCaseForm extends Component<Props, State> {
  state: State = {
    deploymentId: null,
    category: ``,
    description: ``,
    errors: {},
  }

  componentWillUnmount() {
    this.props.resetCreateSupportCaseRequest()
  }

  render() {
    const {
      intl: { formatMessage },
      isHeroku,
      profile,
      searchResults,
      searchRequest,
      search,
      supportCaseRequest,
    } = this.props

    const { errors, category, description } = this.state

    const reporterLabel = (
      <FormattedMessage id='supportCaseForm.reporter.label' defaultMessage='Reported by' />
    )
    const descriptionLabel = (
      <FormattedMessage id='supportCaseForm.description.label' defaultMessage='Issue description' />
    )

    const issueDescriptionPlaceholder = formatMessage(messages.howCanWeHelpYou)

    const email = getProfileEmail({ profile, isHeroku })

    if (!email) {
      // means we have a fake profile stub and not the actual account details
      return <EuiLoadingContent />
    }

    const reporterHelpText = profile.email_verified ? null : (
      <FormattedMessage
        data-test-id='support-form-reporter-help-text'
        id='supportCaseForm.reporter.helpText'
        defaultMessage='All replies will be sent to {email}. If needed, update and verify your primary email address.'
        values={{
          email,
          update: (
            <Link to={userSettingsUrl()}>
              <FormattedMessage
                id='supportCaseForm.reporter.helpText.update'
                defaultMessage='update'
              />
            </Link>
          ),
        }}
      />
    )

    return (
      <div>
        {supportCaseRequest.isDone && !supportCaseRequest.error && (
          <Fragment>
            <EuiCallOut
              color='success'
              title={
                <FormattedMessage
                  id='supportCaseForm.success'
                  defaultMessage='Support case created'
                />
              }
            />
            <EuiSpacer />
          </Fragment>
        )}

        <EuiText>
          <FormattedMessage
            id='help.support-description'
            defaultMessage='If you cannot find the answer to your question in our documentation, contact us using this form.'
          />
        </EuiText>

        <EuiSpacer size='m' />

        <PrivacySensitiveContainer>
          <EuiFormRow label={reporterLabel} helpText={reporterHelpText}>
            <EuiFieldText readOnly={true} value={email} />
          </EuiFormRow>
        </PrivacySensitiveContainer>

        <EuiSpacer size='m' />

        <SupportCaseCategorySelector
          value={category}
          onChange={(category) => this.setState({ category })}
          error={errors.category}
        />

        <EuiSpacer size='m' />

        <SearchDeployments
          error={errors.deploymentId}
          onDeploymentChosen={this.onDeploymentChosen}
          search={search}
          searchRequest={searchRequest}
          searchResults={searchResults}
        />

        <EuiSpacer size='m' />

        <PrivacySensitiveContainer>
          <EuiFormRow
            label={descriptionLabel}
            isInvalid={!!errors.description}
            error={errors.description}
          >
            <EuiTextArea
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder={issueDescriptionPlaceholder}
              isInvalid={!!errors.description}
            />
          </EuiFormRow>
        </PrivacySensitiveContainer>

        <EuiSpacer size='m' />

        {supportCaseRequest.error && (
          <Fragment>
            <CuiAlert type='error'>{supportCaseRequest.error}</CuiAlert>
            <EuiSpacer />
          </Fragment>
        )}

        <EuiSpacer size='m' />

        <SpinButton
          color='primary'
          fill={true}
          onClick={this.onSubmit}
          spin={supportCaseRequest.inProgress}
        >
          <FormattedMessage id='supportCaseForm.sendButton' defaultMessage='Send' />
        </SpinButton>
      </div>
    )
  }

  onDeploymentChosen = (deploymentId: string | null) => {
    this.setState({ deploymentId })
  }

  onSubmit = () => {
    const clientErrors = makeClientErrors(this.state)

    if (!isEmpty(clientErrors)) {
      this.setState({ errors: clientErrors })
      return
    }

    const { createSupportCase } = this.props
    const { deploymentId, category } = this.state

    return createSupportCase({
      deploymentId,
      category,
      description: this.getDescriptionPayload(),
    }).then(() => {
      this.setState({
        description: ``,
        errors: {},
      })
      return undefined
    })
  }

  getDescriptionPayload = (): string => {
    const { profile, isHeroku } = this.props
    const { description } = this.state
    const email = getProfileEmail({ profile, isHeroku })

    if (!email) {
      return description // sanity
    }

    const br = `\n========================\n\n`

    const cloudTeamInternalAccountEmails = [
      `cloud-analytics-admin@elastic.co`,
      `cloud-analytics-clusters@elastic.co`,
      `cloud-business-ops@elastic.co`,
      `cloud-monitor@elastic.co`,
      `cloud-observability@elastic.co`,
      `operations@found.no`,
    ]

    if (
      cloudTeamInternalAccountEmails.some((internalAccountEmail) => internalAccountEmail === email)
    ) {
      return `CLOUD TEAM INTERNAL CASE — please do not route back to the Cloud team!${br}${description}`
    }

    if (email.endsWith(`@elastic.co`)) {
      return `ELASTIC INTERNAL CASE${br}${description}`
    }

    return description
  }
}

export { SupportCaseForm }
export default injectIntl(SupportCaseForm)

function getProfileEmail({
  profile,
  isHeroku,
}: {
  profile: NonNullable<ProfileState>
  isHeroku: boolean
}): string {
  const herokuEmail = get(profile.data, [`heroku`, `owner_email`])
  const email = isHeroku && herokuEmail ? herokuEmail : profile.email

  return email
}

function makeClientErrors(state: State): Errors {
  const requiredError = (
    <FormattedMessage id='supportCaseForm.requiredError' defaultMessage='Required' />
  )

  const errors: Errors = {}
  const requiredFields = [`description`, `category`]
  const needsDeploymentCategories = [`config`, `down`, `impaired`]

  requiredFields.forEach((fieldName) => {
    if (state[fieldName].length === 0) {
      errors[fieldName] = requiredError
    }
  })

  if (needsDeploymentCategories.includes(state.category)) {
    if (state.deploymentId === null) {
      errors.deploymentId = requiredError
    }
  }

  return errors
}
