import React from 'react'

import Button from './Button'

const Pagination = ({ pageInfo: { hasNextPage }, onNext }) => {
  return (
    !hasNextPage || (
      <Button variant="tertiary" onClick={onNext} disabled={!hasNextPage}>
        Load more
      </Button>
    )
  )
}

export default Pagination
