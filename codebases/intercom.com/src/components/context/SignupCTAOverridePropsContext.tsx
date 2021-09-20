import React, { useContext, createContext } from 'react'
import { IProps } from 'marketing-site/src/library/components/SignUpCTA'

const SignupCTAOverridePropsContext = createContext<Partial<IProps>>({})

export function WithAdditionalSignupCTAOverrideProps({
  overrideProps,
  children,
}: {
  overrideProps: Partial<IProps>
  children: React.ReactNode
}) {
  const existingOverrideProps = useContext(SignupCTAOverridePropsContext)

  return (
    <SignupCTAOverridePropsContext.Provider value={{ ...existingOverrideProps, ...overrideProps }}>
      {children}
    </SignupCTAOverridePropsContext.Provider>
  )
}

export default SignupCTAOverridePropsContext
