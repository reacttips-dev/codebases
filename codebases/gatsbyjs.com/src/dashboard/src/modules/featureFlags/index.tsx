import * as React from "react"
import {
  useFlags as ldUseFlags,
  useLDClient,
  LDProvider,
} from "launchdarkly-react-client-sdk"
import { LDUser, LDFlagSet } from "launchdarkly-js-sdk-common"
import { isProduction } from "@modules/env/constants"
import { useCurrentUser } from "@modules/auth"
import { findOrCreateSessionId } from "@modules/analytics/utils"

const getUniqueId = () => {
  const sessionId = findOrCreateSessionId()
  return sessionId || undefined
}

const FeatureFlagReadyContext = React.createContext<boolean>(false)

const getLDUser = (experimentationUser: LDUser = {}): LDUser => {
  const injectedCustomFields: LDUser["custom"] = {}
  const uniqueId = getUniqueId()

  if (uniqueId) {
    // custom["uniqueId"] is required to maintain experience across both anonymous and logged-in states
    // see https://docs.launchdarkly.com/home/managing-flags/targeting-users#anonymous-users for more details
    injectedCustomFields.uniqueId = uniqueId
  }

  return {
    ...experimentationUser,
    custom: {
      ...(experimentationUser.custom || {}),
      ...injectedCustomFields,
    },
  }
}

export type AuthorizedFeatureFlagProviderProps = {
  children: React.ReactNode
}

export function AuthorizedFeatureFlagProvider({
  children,
}: AuthorizedFeatureFlagProviderProps) {
  const { currentUser } = useCurrentUser()
  const experimentationUser = currentUser?.experimentationUser

  const user = React.useMemo(() => {
    return experimentationUser ? getLDUser(experimentationUser) : undefined
  }, [experimentationUser])

  return <FeatureFlagProvider user={user}>{children}</FeatureFlagProvider>
}

export type AnonymousFeatureFlagProviderProps = {
  children: React.ReactNode
}

export function AnonymousFeatureFlagProvider({
  children,
}: AnonymousFeatureFlagProviderProps) {
  const uniqueId = getUniqueId()
  const user = React.useMemo(
    () =>
      uniqueId
        ? getLDUser({
            anonymous: true,
            key: uniqueId,
          })
        : undefined,
    [uniqueId]
  )

  return <FeatureFlagProvider user={user}>{children}</FeatureFlagProvider>
}

export function useFlags() {
  let flags = ldUseFlags()
  const ready = React.useContext(FeatureFlagReadyContext)

  // Cypress should only receive flags that are explicitely mocked via cy.mockFeatureFlags
  // All other flags coming from LaunchDarkly are disregarded
  if (!isProduction && typeof window !== "undefined" && !!window.Cypress) {
    const cyFlagsJson = window.Cypress.env("cy_featureFlags")
    const cyFlags = cyFlagsJson ? JSON.parse(cyFlagsJson) : {}

    flags = cyFlags
  }

  return { flags, ready }
}

type FeatureFlagProviderProps = {
  children: React.ReactNode
  user?: LDUser
}

function FeatureFlagProvider({ children, user }: FeatureFlagProviderProps) {
  const [ready, setReady] = React.useState<boolean>(false)

  return (
    <LDProvider
      clientSideID={process.env.GATSBY_LAUNCH_DARKLY_CLIENT_ID || ""}
      user={user}
      deferInitialization={true}
    >
      <FeatureFlagReadyContext.Provider value={ready}>
        <FeatureFlagReadinessCheck onReady={() => setReady(true)} />
        {children}
      </FeatureFlagReadyContext.Provider>
    </LDProvider>
  )
}

const logIdentifyResult = (user: LDUser, flags: LDFlagSet) => {
  /* eslint-disable no-console */

  console.groupCollapsed("🚩Feature Flags ready")
  console.log("User", user)
  if (console.table) {
    console.table(flags)
  } else {
    console.log(flags)
  }
  console.groupEnd()

  /* eslint-enable no-console */
}

type FeatureFlagReadinessCheckProps = {
  onReady: () => void
}

// This component allows to verify the readyness of launchdarkly to avoid blinking screen when flags are NOT resolved
export function FeatureFlagReadinessCheck({
  onReady,
}: FeatureFlagReadinessCheckProps) {
  const ldClient = useLDClient()

  React.useEffect(() => {
    if (ldClient) {
      ldClient.waitUntilReady().then(() => {
        onReady()
        if (!isProduction) {
          logIdentifyResult(ldClient.getUser(), ldClient.allFlags())
        }
      })
    }
  }, [ldClient])

  return null
}
