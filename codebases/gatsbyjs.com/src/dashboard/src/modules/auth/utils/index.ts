import * as uuid from "uuid"
import { navigate } from "gatsby"
import * as qs from "query-string"
import { rot13 } from "simple-rot13"

import { DEFAULT_AUTH_URL, MOCK_USER_ID } from "../constants"
import { LocalStorageItems } from "../../localStorage/constants"
import { LoginOption } from "@modules/userAccount/constants"

const GATSBY_DASHBOARD_AUTHENTICATION_URL =
  process.env.GATSBY_DASHBOARD_AUTHENTICATION_URL || DEFAULT_AUTH_URL

export function isAuthenticated(): boolean {
  const token = localStorage.getItem(LocalStorageItems.GatsbyToken)
  if (token === `undefined` || token === `null`) {
    return false
  }

  return !!token
}

export function processLoginAttempt(
  queryString: string,
  loginOption: LoginOption = LoginOption.Github
): void {
  const parsed = qs.parse(queryString)
  if (!parsed.csrfToken && !parsed.invitationToken) {
    parsed.csrfToken = uuid.v4()
  }

  parsed.dashboard = `true`

  if (process.env.GATSBY_MOCK_MODE) {
    localStorage.setItem(LocalStorageItems.GatsbyToken, `1234`)
    localStorage.setItem(LocalStorageItems.GatsbyUserId, MOCK_USER_ID)
    navigate(`/dashboard/sites`)
    return
  }

  // When testing with Cypress, this call will break the tests - you cannot navigate to superdomains in Cypress tests
  // As such, you must authenticate manually with GitHub in Cypress tests
  window.location.assign(
    `${GATSBY_DASHBOARD_AUTHENTICATION_URL}/oauth/${loginOption.toLowerCase()}?${qs.stringify(
      parsed
    )}`
  )
}

export function processSignupAttempt(
  loginOption: LoginOption,
  params: {
    [k: string]: string | string[] | number | boolean | null | undefined
  } = {},
  welcomeFormValues: {
    [k: string]: string | undefined
    firstName?: string
    lastName?: string
    companyEmail?: string
    projectType?: string
    country?: string
    region?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    referrerUrl?: string
  }
): void {
  const finalParams = {
    ...params,
  }

  if (!finalParams.csrfToken) {
    finalParams.csrfToken = uuid.v4()
  }

  finalParams.dashboard = `true`

  // Map each welcomeFormValues property to finalParams
  Object.keys(welcomeFormValues).forEach(key => {
    // Don't send empty strings back as lead capture values
    if (!welcomeFormValues[key]) return

    finalParams[key] = ["firstName", "lastName", "companyEmail"].includes(key)
      ? rot13(welcomeFormValues[key])
      : welcomeFormValues[key]
  })

  // When testing with Cypress, this call will break the tests - you cannot navigate to superdomains in Cypress tests
  // As such, you must authenticate manually with GitHub in Cypress tests
  window.location.assign(
    `${GATSBY_DASHBOARD_AUTHENTICATION_URL}/oauth/${loginOption.toLowerCase()}?${qs.stringify(
      finalParams
    )}`
  )

  return
}

const GATSBY_PREVIEW_AUTHENTICATION_URL  =
  process.env.GATSBY_PREVIEW_AUTHENTICATION_URL || `http://localhost:8083`

export function authenticatePreview(
  queryString: string,
  loginOption: LoginOption = LoginOption.Github
) {
  const parsed = qs.parse(queryString)
  if (!parsed.csrfToken) {
    parsed.csrfToken = uuid.v4()
  }

  return window.location.assign(
    `${GATSBY_PREVIEW_AUTHENTICATION_URL}/oauth/${loginOption.toLowerCase()}?${qs.stringify(
      {
        ...parsed,
        authType: `PREVIEW_AUTH`,
      }
    )}`
  )
}
