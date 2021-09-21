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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import LandingPageContainer from '../../../../../../components/LandingPageContainer/NewLandingPageContainer'
import InvalidToken from '../InvalidToken'

import { AsyncRequestState } from '../../../../../../types'

interface Props {
  verifyAccountRequest: AsyncRequestState
  image: string
  darkImage: string
  title: ReactElement
}

class VerificationFailed extends PureComponent<Props> {
  render(): ReactElement {
    const { image, darkImage } = this.props
    const errorCode = this.getErrorCode()

    return (
      <LandingPageContainer
        title={this.renderTitle(errorCode)}
        subtitle={this.renderSubtitle(errorCode)}
        image={image}
        darkImage={darkImage}
      />
    )
  }

  renderTitle(errorCode: string): ReactElement | undefined {
    const { title } = this.props

    if (errorCode === 'user.token_expired' || errorCode === 'user.token_already_used') {
      return (
        <FormattedMessage
          id='password-update-via-email.title-error'
          defaultMessage='Error setting password'
        />
      )
    }

    return title
  }

  renderSubtitle(errorCode: string): ReactElement {
    if (errorCode === 'user.token_expired' || errorCode === 'user.token_already_used') {
      return <InvalidToken />
    }

    return (
      <div data-test-id='fetch-details-failed'>
        <FormattedMessage
          id='password-update-via-email.failed'
          defaultMessage="We couldn't find your details. Contact {link} for help"
          values={{
            link: (
              <a href='mailto:support@elastic.co?subject=Failed%20to%20verify%20account'>
                support@elastic.co
              </a>
            ),
          }}
        />
      </div>
    )
  }

  getErrorCode(): string {
    const { verifyAccountRequest } = this.props
    const error = verifyAccountRequest.error
    return get(error, [`body`, `errors`, `0`, `code`])
  }
}

export default VerificationFailed
