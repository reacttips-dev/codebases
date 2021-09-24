import React from 'react'

import { logger } from 'lib/logger'

export type SearchContextProps = {
  onSearchClose: () => void
  modalRef?: React.MutableRefObject<HTMLInputElement>
}
export const SearchContext = React.createContext<
  SearchContextProps | undefined
>(undefined)

export const useSearchContext = () => {
  const context = React.useContext(SearchContext)
  if (!context) {
    const error =
      'Search compound components cannot be rendered outside the Search modal'
    logger.error(error)
    throw new Error(error)
  }
  return context
}
