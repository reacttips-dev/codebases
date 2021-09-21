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

import React, { FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import LandingPageContainer from '../../../../../../components/LandingPageContainer/NewLandingPageContainer'

interface Props {
  image: string
  darkImage: string
  title: ReactNode
}

const FetchingDetails: FunctionComponent<Props> = ({ image, darkImage, title }) => (
  <LandingPageContainer
    title={title}
    subtitle={
      <div color='subdued' data-test-id='fetching-details'>
        <FormattedMessage
          id='password-update-via-email.fetching-details'
          defaultMessage='Fetching your details …'
        />
      </div>
    }
    image={image}
    darkImage={darkImage}
  />
)

export default FetchingDetails
