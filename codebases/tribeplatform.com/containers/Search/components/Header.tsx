import React, { ReactNode } from 'react'

import { ModalHeader } from 'tribe-components'

export interface SearchHeaderProps {
  children: ReactNode
  withBorder?: boolean
}
const SearchHeader = ({ withBorder = true, children }) => {
  return (
    <ModalHeader variant={withBorder ? 'withBorder' : 'default'}>
      {children}
    </ModalHeader>
  )
}

export default SearchHeader
