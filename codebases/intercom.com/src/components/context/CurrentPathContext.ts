import { createContext } from 'react'

export interface ICurrentPath {
  /** The path with the locale excluded, e.g. `/security` */
  plain: string

  /** The path with the locale included, e.g. `/de/security` */
  localized: string

  /** The fully-qualified, localized path, e.g. `https://www.intercom.com/de/security` */
  canonical: string
}

const CurrentPathContext = createContext<ICurrentPath>({
  plain: '',
  localized: '',
  canonical: 'https://www.intercom.com',
})

CurrentPathContext.displayName = 'CurrentPathContext'

export default CurrentPathContext
