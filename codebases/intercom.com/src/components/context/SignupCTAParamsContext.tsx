import React, { useContext } from 'react'
import { createContext } from 'react'

// Add query parameters to all SignUpCTAs in this context
const SignupCTAParamsContext = createContext<object>({})

export function WithAdditionalSignupCtaParams({
  params,
  children,
}: {
  params: object
  children: React.ReactNode
}) {
  const existingAdditionalParams = useContext(SignupCTAParamsContext)

  return (
    <SignupCTAParamsContext.Provider value={{ ...existingAdditionalParams, ...params }}>
      {children}
    </SignupCTAParamsContext.Provider>
  )
}

export default SignupCTAParamsContext
