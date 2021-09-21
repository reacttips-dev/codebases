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

import { defineMessages } from 'react-intl'

const messages = defineMessages({
  titleFor_sso_invalid_saml_request: {
    id: `sso-errors.title-for-sso.invalid_saml_request`,
    defaultMessage: `Invalid SAML request`,
  },
  descriptionFor_sso_invalid_saml_request: {
    id: `sso-errors.description-for-sso.invalid_saml_request`,
    defaultMessage: `The request was invalid, please try again.`,
  },
  titleFor_sso_unauthorized: {
    id: `sso-errors.title-for-sso.unauthorized`,
    defaultMessage: `Authentication failed`,
  },
  descriptionFor_sso_unauthorized: {
    id: `sso-errors.description-for-sso.unauthorized`,
    defaultMessage: `You are unauthorized to perform this action.`,
  },
  titleFor_sso_forbidden: {
    id: `sso-errors.title-for-sso.forbidden`,
    defaultMessage: `Forbidden`,
  },
  descriptionFor_sso_forbidden: {
    id: `sso-errors.description-for-sso.forbidden`,
    defaultMessage: `You are not allowed to access this resource.`,
  },
  titleFor_sso_generic: {
    id: `sso-errors.title-for-sso.generic`,
    defaultMessage: `Something went wrong`,
  },
  descriptionFor_sso_generic: {
    id: `sso-errors.description-for-sso.generic`,
    defaultMessage: `That's all we know.`,
  },
})

const genericErrorDescriptor = {
  title: messages.titleFor_sso_generic,
  description: messages.descriptionFor_sso_generic,
}

const errorDescriptors = [
  {
    errorCode: `sso.invalid_saml_request`,
    title: messages.titleFor_sso_invalid_saml_request,
    description: messages.descriptionFor_sso_invalid_saml_request,
  },
  {
    errorCode: `sso.unauthorized`,
    title: messages.titleFor_sso_unauthorized,
    description: messages.descriptionFor_sso_unauthorized,
  },
  {
    errorCode: `sso.forbidden`,
    title: messages.titleFor_sso_forbidden,
    description: messages.descriptionFor_sso_forbidden,
  },
]

export function describeSsoError(errorCode: string | null) {
  const specificErrorDescriptor = errorDescriptors.find(
    (errorDescriptor) => errorDescriptor.errorCode === errorCode,
  )

  return specificErrorDescriptor || genericErrorDescriptor
}
