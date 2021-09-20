import { createContext } from 'react'

import { Locale } from 'contentful'

// Placeholder, replaced by locale fetched from contentful
const defaultContext: Locale = {
  code: 'en-US',
  name: '',
  default: false,
  fallbackCode: '',
  sys: {
    id: '',
    type: 'Locale',
    version: 0,
  },
}
const CurrentLocaleContext = createContext<Locale>(defaultContext)

CurrentLocaleContext.displayName = 'CurrentLocaleContext'

export default CurrentLocaleContext
