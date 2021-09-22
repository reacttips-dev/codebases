import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink, browserHistory } from 'react-router'
import { Pagination as PaginationHelios, Padded } from '@invisionapp/helios'

// @ts-ignore -- remove when constants is converted to TS
import constants from '../../../shared/constants'
import { selectHasBulkItems } from '../../stores/bulkItems'
import { RowItem } from '../../stores/tables'
import { Location } from '../../stores/location'

const PAGE_SIZE = constants.peopleListPageSize

type PaginationProps = {
  isTableLoaded: boolean
  items: RowItem[]
  label: string
  perPage: number
  totalItems: number
}

const Pagination = (props: PaginationProps) => {
  // convert to useLocation once we can upgrade to react router 5.1 or greater
  const [location, setLocation] = useState<Location>(browserHistory.getCurrentLocation())
  const [currentPage, setCurrentPage] = useState(1)

  const {
    isTableLoaded = false,
    items,
    label = 'People',
    perPage = PAGE_SIZE,
    totalItems = 0
  } = props

  const hasBulkItems = useSelector(selectHasBulkItems)

  const totalPages = Math.ceil(totalItems / perPage)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const goToPage = useCallback(
    (newPage: number) => {
      browserHistory.replace({
        ...location,
        query: {
          ...location.query,
          page: newPage
        }
      })
    },
    [location]
  )

  const goToFirstPage = useCallback(() => {
    goToPage(1)
  }, [goToPage])

  const goToLastPage = useCallback(() => {
    goToPage(totalPages)
  }, [goToPage, totalPages])

  const getCurrentPage = useCallback(() => {
    if (totalPages === 0) {
      return 0
    }

    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get('page')

    if (page === undefined || page === null) {
      return 1
    }

    const numericPage = typeof page === 'string' ? parseInt(page, 10) : page

    if (Number.isNaN(numericPage)) {
      goToFirstPage()
    }

    if (numericPage < 1) {
      goToFirstPage()
    }

    if (numericPage > totalPages) {
      goToLastPage()
    }

    return numericPage
  }, [goToFirstPage, goToLastPage, location.search, totalPages])

  // replace once we can upgrade to react router 5.1 or greater and can use useLocation
  const handleLocationChange = useCallback((location: Location) => {
    setLocation(location)
  }, [])

  useEffect(() => {
    // the listen function returns the function needed to stop listening.
    // so this next statement starts the listener and returns the stop function
    const unlisten = browserHistory.listen(location => {
      handleLocationChange(location)
    })

    return unlisten
  }, [handleLocationChange])

  useEffect(() => {
    setCurrentPage(getCurrentPage())
  }, [getCurrentPage, location])

  if (isTableLoaded === false || items.length === 0 || totalPages < 2 || currentPage === 0) {
    return null
  }

  return (
    <>
      <Padded top="xxl" bottom="l">
        <PaginationHelios
          aria-label={`${label} Pagination`}
          currentPage={currentPage}
          // @ts-ignore - helios not allowing RouterLink
          element={RouterLink}
          items={createPaginatedItems(location, totalPages)}
        />
      </Padded>
      {hasBulkItems && <div style={{ height: '62px' }} />}
    </>
  )
}

function createPaginatedItems(location: Location, totalPages: number) {
  const emptyItemArray = Array.from(new Array(totalPages))

  return emptyItemArray.map((_, index) => {
    const path = browserHistory.createPath({
      ...location,
      query: {
        ...location.query,
        page: index + 1
      }
    })

    return {
      to: path
    }
  })
}

export default Pagination
