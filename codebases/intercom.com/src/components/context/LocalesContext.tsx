import { createContext } from 'react'

import { Locale } from 'contentful'

const LocalesContext = createContext<Locale[]>([])

LocalesContext.displayName = 'LocalesContext'

export default LocalesContext
