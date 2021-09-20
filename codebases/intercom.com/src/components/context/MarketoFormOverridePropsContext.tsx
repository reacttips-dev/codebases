import { IProps } from 'marketing-site/src/library/components/MarketoFormV2'
import React, { createContext, useContext } from 'react'

const MarketoFormOverridePropsContext = createContext<Partial<IProps>>({})

export function WithAdditionalMarketoFormOverrideProps({
  overrideProps,
  children,
}: {
  overrideProps: Partial<IProps>
  children: React.ReactNode
}) {
  const existingOverrideProps = useContext(MarketoFormOverridePropsContext)

  return (
    <MarketoFormOverridePropsContext.Provider
      value={{ ...existingOverrideProps, ...overrideProps }}
    >
      {children}
    </MarketoFormOverridePropsContext.Provider>
  )
}

export default MarketoFormOverridePropsContext
