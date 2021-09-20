import React, { useContext, createContext } from 'react'
import { IProps } from 'marketing-site/src/library/elements/CTALink'

const CTALinkOverridePropsContext = createContext<Partial<IProps>>({})

export function WithAdditionalCTALinkOverrideProps({
  overrideProps,
  children,
}: {
  overrideProps: Partial<IProps>
  children: React.ReactNode
}) {
  const existingOverrideProps = useContext(CTALinkOverridePropsContext)

  return (
    <CTALinkOverridePropsContext.Provider value={{ ...existingOverrideProps, ...overrideProps }}>
      {children}
    </CTALinkOverridePropsContext.Provider>
  )
}

export default CTALinkOverridePropsContext
