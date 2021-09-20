import React, { createContext } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import { useRouter } from 'next/router'

interface ILocationContext {
  location: string | undefined
}

export const CareersLocationContext = createContext<ILocationContext>({ location: '' })

export default function CareersLocation({ children }: IPageBehaviorComponentProps) {
  const router = useRouter()
  const pathname = router.asPath
  const officeLocation = (pathname.match(/careers(\/(.*))/) || [])[2] || undefined
  const office = officeLocation?.split('#')[0]?.split('?')[0]?.split('/')[0]

  return (
    <CareersLocationContext.Provider value={{ location: office }}>
      {children}
    </CareersLocationContext.Provider>
  )
}
