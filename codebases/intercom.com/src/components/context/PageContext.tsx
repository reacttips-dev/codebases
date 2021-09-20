import { createContext, useContext } from 'react'
import { IPage } from 'marketing-site/@types/generated/contentful'

const PageContext = createContext<IPage | null>(null)
PageContext.displayName = 'PageContext'

export const usePage = () => useContext(PageContext)

export default PageContext
