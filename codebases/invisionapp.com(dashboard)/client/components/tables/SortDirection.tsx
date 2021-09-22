import React from 'react'

import { DirectDown, Down, Up } from '@invisionapp/helios/icons'

type SortDirectionProps = {
  direction?: 'asc' | 'desc' | undefined
}

const SortDirection = (props: SortDirectionProps) => {
  const { direction } = props

  return (
    <>
      {direction === 'asc' && <Up size={16} fill="text-lighter" />}
      {direction === 'desc' && <Down size={16} fill="text-lighter" />}
      {!direction && <DirectDown />}
    </>
  )
}

export default SortDirection
