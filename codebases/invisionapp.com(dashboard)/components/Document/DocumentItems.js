import React, { memo, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import qs from 'query-string'
import AutoSizer from 'react-virtualized-auto-sizer'
import { ReactWindowScroller as WindowScroller } from 'react-window-scroller'
import { FixedSizeGrid } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import 'react-virtualized/styles.css'
import { Skeleton } from '@invisionapp/helios'
import cloneDeep from 'lodash/cloneDeep'

import DragSelect from '../Common/DragSelect'
import DropSelections from '../Common/DropSelections'
import dropToSidebar from '../../hooks/dropToSidebar'

import TileContainer from './TileContainer'
import LoadFailure from '../Layout/LoadFailure'
import NoResults from '../Layout/ResponsiveNoResults'
import generateGlobalSearchQueryParams from '../../utils/generateGlobalSearchQueryParams'

import { mapSidebarPathname } from '../../utils/mapPaths'
import { trackEvent } from '../../utils/analytics'
import generateInitialDocumentsURL from '../../utils/generateInitialDocumentsURL'

import hotjar from '../../utils/hotjar'

import { APP_HOME_DATA_FETCHED } from '../../constants/TrackingEvents'

import {
  SORT_CREATED,
  SORT_UPDATED,
  SORT_ALPHA
} from '../../constants/SortTypes'
import { GET_RESOURCES, SEARCH_RESOURCES } from '../../constants/ServerURLs'

import {
  FILTER_ALL,
  FILTER_HARMONY,
  FILTER_PROTOTYPES,
  FILTER_BOARDS,
  FILTER_SPECS,
  FILTER_FREEHANDS,
  FILTER_RHOMBUS,
  FILTER_EMPTY_STATES,
  FILTER_INVISION
} from '../../constants/FilterTypes'

import { generateColumnCount, generateGutter } from '../../utils/documentGrid'
import request from '../../utils/API'
import areEqual from '../../utils/areEqual'
import { generateThumbnailUrl } from '../../utils/thumbnailUrlHelper'

import styles from '../../css/grid.css'
import { FREEHAND } from '../../constants/DocumentTypes'

let initialLoad = true
const { appShell } = window.inGlobalContext
appShell.getFeatureContext('home').on('before:unmount', () => {
  initialLoad = true
})

const DOCUMENT_LIMIT = 50

let hasNextPage = true
let isNextPageLoading = false
let currentQuery = ''
let cursor = ''

export const Document = ({ columnIndex, rowIndex, style, data: props }) => {
  const { metadata: { permissions, spaceOverrides, freehands }, isLoading = false } = props
  const docIndex = (rowIndex * props.columnCount) + columnIndex
  const document = props.documents && props.documents[docIndex]
  const gutter = generateGutter(props.mqs)

  if (!document && (isNextPageLoading || hasNextPage || isLoading)) {
    return (
      <div
        style={{
          ...style,
          left: style.left + gutter,
          width: style.width - gutter,
          height: style.height - gutter
        }}
      >
        <Skeleton height={style.height - gutter} />
      </div>
    )
  } else if (!document && !isNextPageLoading) {
    return null
  }

  let permissionsProps = null

  // Set permissions from metadata
  if (permissions[`${document.resourceType}-${document.id}`]) {
    permissionsProps = permissions[`${document.resourceType}-${document.id}`]
  }

  // Set thumbnail
  const thumbnailUrl = document.thumbnailAssetURL
    ? generateThumbnailUrl(
      document.thumbnailAssetURL,
      document.resourceType,
      null,
      400,
      props.config.cloudflareEnabled,
      'bounds'
    ) : ''

  if (!document.space) {
    document.space = {
      id: '',
      title: '',
      discoverable: true
    }
  }

  // Override space from metadata if needed
  let overrideSpace = ''
  if (spaceOverrides[`${document.resourceType}-${document.id}`]) {
    overrideSpace = spaceOverrides[`${document.resourceType}-${document.id}`].id || 'none'
    document.space.id = spaceOverrides[`${document.resourceType}-${document.id}`].id
    document.space.title = spaceOverrides[`${document.resourceType}-${document.id}`].title
    document.space.discoverable = true
  }

  const isDragSelected = props.dragSelections.findIndex(item => item.type === document.resourceType && item.id + '' === document.id + '') >= 0
  const isDocSelected = props.selected.selected.findIndex(item => item.type === document.resourceType && item.id + '' === document.id + '') >= 0 ||
    (props.selected.firstSelected && props.selected.firstSelected.type === document.resourceType && props.selected.firstSelected.id + '' === document.id + '')

  const isSelected = isDocSelected || isDragSelected
  const isDraggable = isSelected || (props.selected.selected.length === 0 && permissionsProps && permissionsProps.canMove)
  const isSelectable = props.selected.selected.length > 0
  const documentOrder = docIndex + 1
  const isTemplate = freehands[document.id] && freehands[document.id].isTemplate

  return (
    <div key={docIndex} style={{
      ...style,
      left: style.left + gutter,
      width: style.width - gutter,
      opacity: props.isDropping && isDocSelected ? '0.5' : '1'
    }}>
      <TileContainer
        actions={props.actions}
        canCreateSpaces={props.canCreateSpaces}
        canTransferDocuments={props.canTransferDocuments}
        config={props.config}
        document={document}
        documentOrder={documentOrder}
        enableArchiving={props.enableArchiving}
        externalTypesConfig={props.externalTypesConfig}
        getExtDocFallbackIcon={props.getExtDocFallbackIcon}
        iconSrc={props.enableFreehandXFilteringSorting && document.resourceType === FREEHAND
          ? props.metadata.freehands[document.id]?.iconAssetURL : undefined}
        fromCache={props.fromCache}
        homeSection={props.homeSection}
        index={docIndex}
        location={props.location}
        multipleTeams={props.multipleTeams}
        page={1}
        space={props.space}
        isInSpace={props.isInSpace}
        isInProject={props.isInProject}
        isDraggable={isDraggable}
        isSelectable={isSelectable}
        isSelected={isSelected}
        isTemplate={isTemplate}
        mqs={props.mqs}
        sortType={props.sortType}
        permissions={permissionsProps}
        overrideSpace={overrideSpace}
        thumbnailUrl={thumbnailUrl}
      />
    </div>
  )
}

// This is split out for testing reasons, so enzyme can find the name of Document easily
const MemoizedDocument = memo(Document, areEqual)

function generateRowHeight (columnWidth, gutterWidth) {
  const tileBorder = 0
  const infoPanelHeight = 80
  const imageRatio = 0.75
  const imageWidth = columnWidth - gutterWidth
  const imageHeight = imageWidth * imageRatio
  const rowHeight = imageHeight + infoPanelHeight + gutterWidth + tileBorder * 2
  return rowHeight
}

const DocumentItems = (props) => {
  const { mqs, showGetInspired, showUserDocs, isFreeHandOnlySeat, isFreeHandOnlyTeam, sortType, filterType, externalDocFilterEntries } = props

  const gridRef = useRef()

  const [documents, setDocuments] = useState([])

  const [requestError, setRequestError] = useState('')
  const [internalReload, setInternalReload] = useState(false)

  const [dragSelections, setDragSelections] = useState('[]')
  const [isDropping, setIsDropping] = useState(false)
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0, isHovering: false })
  const supportedExternalTypes = externalDocFilterEntries ? Object.keys(externalDocFilterEntries) : []

  const generateQueryString = () => {
    let params = {}
    params.limit = DOCUMENT_LIMIT

    // Document creator
    if (showUserDocs) {
      params.createdByMe = true
    }

    // Document type
    if (filterType !== FILTER_ALL) {
      let filterTypes = []

      switch (props.filterType) {
        case FILTER_INVISION:
          filterTypes = ['harmony', 'prototype', 'presentation', 'board', 'spec', 'freehand', 'rhombus']
          break
        case FILTER_HARMONY:
          filterTypes = ['harmony']
          break
        case FILTER_PROTOTYPES:
          filterTypes = ['prototype', 'presentation']
          break
        case FILTER_BOARDS:
          filterTypes = ['board']
          break
        case FILTER_SPECS:
          filterTypes = ['spec']
          break
        case FILTER_FREEHANDS:
          filterTypes = ['freehand']
          break
        case FILTER_RHOMBUS:
          filterTypes = ['rhombus']
          break
        default:
          filterTypes = [filterType]
      }
      params.types = externalDocFilterEntries && externalDocFilterEntries[filterType] ? externalDocFilterEntries[filterType].filterTypes : filterTypes
    }

    // Sorts
    let sortBy = 'userLastAccessedAt'
    let sortOrder = 'desc'

    switch (sortType) {
      case SORT_CREATED:
        sortBy = 'createdAt'
        sortOrder = 'desc'
        break
      case SORT_UPDATED:
        sortBy = 'updatedAt'
        sortOrder = 'desc'
        break
      case SORT_ALPHA:
        sortBy = 'title'
        sortOrder = 'asc'
        break
    }

    params.sortBy = sortBy
    params.sortOrder = sortOrder

    // Set a cookie with the sort preference to pass to cloud-ui
    document.cookie = `inv-home-docs-sortby=${sortBy};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`

    // Archived filtering
    params.isArchived = props.showArchived || props.isArchived

    // Space docs
    if (props.isInSpace && props.spaceId && !props.projectId) {
      params.spaceID = props.spaceId
    }

    if (props.projectId && props.projectId !== '') {
      params.projectID = props.projectId
    }

    return qs.stringify(params)
  }

  const requestDocuments = async (abortSignal = null) => {
    const start = window.performance.now()

    if (initialLoad) {
      initialLoad = false
    }

    if (isNextPageLoading || (props.isInSpace && !props.spaceId && !props.projectId)) return {}

    // When hitting enter in the global search ui component, it redirects to home/search
    // Home then parses the URL, extracts the search term and other params, sets its filters
    // and triggers the search.
    // There is a timming issue in which home hasn't parsed the query params quite yet,
    // which could causes this component to render without the minimum number of search terms
    // and leading the global-nav to throw 4xx
    if ((props.viewType === 'search') && (!props.searchTerm || props.searchTerm.length < 1)) {
      return {}
    }

    isNextPageLoading = true

    let newRequest = false
    let params = ''
    let query = props.viewType === 'search'
      ? generateGlobalSearchQueryParams({
        projectId: props.projectId,
        spaceId: props.spaceId,
        filterType,
        searchTerm: props.searchTerm,
        searchView: props.searchView,
        supportedExternalTypes,
        externalDocFilterEntries
      })
      : generateQueryString()

    if (cursor !== '' && query === currentQuery) {
      params = `cursor=${cursor}`
    } else {
      newRequest = true
      params = query
      currentQuery = query

      if (gridRef && gridRef.current) {
        gridRef.current.scrollTo({
          scrollLeft: 0,
          scrollTop: 0
        })
      }
    }

    const queryParams = params.length > 0 ? `?${params}&includeAssetURLs=true` : '?includeAssetURLs=true'
    const res = await request(`${props.viewType === 'search' ? SEARCH_RESOURCES : GET_RESOURCES}${queryParams}`, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      signal: abortSignal
    })

    isNextPageLoading = false

    if (res.error) {
      if (res.error.name && res.error.name === 'AbortError') {
        return
      }

      hasNextPage = false
      setRequestError(res.error)

      if (!cursor) {
        setDocuments([])
      } else {
        props.actions.showAlert('danger', `Oops! We're having trouble loading more documents.`, true)
      }

      trackEvent(APP_HOME_DATA_FETCHED, {
        status: 'failure',
        requestPageCount: newRequest ? 1 : props.metadata.page + 1
      })

      return
    }

    setRequestError('')
    cursor = res.response.pagination.cursor || ''
    hasNextPage = cursor !== ''
    if (!res.response.resources || res.response.resources.length < DOCUMENT_LIMIT) {
      hasNextPage = false
      props.actions.setShowGetInspired(true)
    }

    setDocuments(newRequest ? res.response.resources : documents.concat(res.response.resources))
    const end = window.performance.now()

    window.requestAnimationFrame(() => {
      let analyticsSortName = 'viewed'

      if (props.viewType === 'search') {
        analyticsSortName = 'relevance'
      } else {
        switch (props.sortType) {
          case SORT_CREATED:
            analyticsSortName = 'created'
            break
          case SORT_UPDATED:
            analyticsSortName = 'updated'
            break
          case SORT_ALPHA:
            analyticsSortName = 'alphabetical'
            break
        }
      }

      let analyticsTypeName = 'all'

      switch (props.filterType) {
        case FILTER_HARMONY:
          analyticsTypeName = 'designs'
          break
        case FILTER_PROTOTYPES:
          analyticsTypeName = 'prototypes'
          break
        case FILTER_BOARDS:
          analyticsTypeName = 'boards'
          break
        case FILTER_SPECS:
          analyticsTypeName = 'specs'
          break
        case FILTER_FREEHANDS:
          analyticsTypeName = 'freehands'
          break
        case FILTER_RHOMBUS:
          analyticsTypeName = 'docs'
          break
        default:
          analyticsTypeName = props.filterType
          break
      }

      props.serverActions.getDocumentsMetadata.request(res.response.resources, {
        index: props.metadata.analytics.length,
        newRequest,
        page: newRequest ? 1 : props.metadata.page + 1,
        pageSize: DOCUMENT_LIMIT,
        pageContext: props.viewType === 'search' ? 'search-documents' : mapSidebarPathname(props.location.pathname),
        resourcesLoaded: true,
        resourcesReturned: res.response.resources.length || 0,
        sort: analyticsSortName,
        spaceFilter: false,
        timeToResourcesFetched: res.loadTime,
        timeToResourcesRendered: end - start,
        type: analyticsTypeName
      })
    })
  }

  const loadInitialDocuments = (
    externalDocFilterEntries,
    isExternalDocType,
    docType,
    enableFreehandXFilteringSorting
  ) => {
    if (props.metadata.initialDocumentsError) {
      setRequestError('error')
      return
    }

    if (props.viewType !== 'search' && externalDocFilterEntries) {
      const currentURL = generateInitialDocumentsURL(
        window.location.pathname,
        externalDocFilterEntries,
        isExternalDocType,
        docType,
        enableFreehandXFilteringSorting
      ).url

      if (
        currentURL === props.metadata.cachedUrl &&
        (documents.length === 0 || !props.metadata.initialDocumentsLoading)
      ) {
        if (!props.metadata.initialDocumentsLoading) {
          initialLoad = false
        }

        if (props.metadata.initialDocuments.length > 0 || props.metadata.initialDocumentsLoaded) {
          cursor = props.metadata.initialDocumentsCursor || ''
          currentQuery = props.metadata.cachedUrl.split('?')[1]

          if (!cursor) {
            hasNextPage = false
          }

          setDocuments(cloneDeep(props.metadata.initialDocuments))
        }
      }
    }
  }

  useEffect(() => {
    hotjar.triggerEvent('paginated_doc_list')
    loadInitialDocuments()
  }, [])

  // Load in initial documents from the cache
  useEffect(() => {
    if (props.account.isLoading) return

    loadInitialDocuments(
      props.externalDocFilterEntries,
      props.isExternalDocType,
      props.docType,
      props.account.userV2.flags.enableFreehandXFilteringSorting
    )
  }, [
    props.account.isLoading,
    props.account.userV2.flags.enableFreehandXFilteringSorting,
    props.metadata.initialDocuments,
    props.metadata.initialDocumentsLoading,
    props.externalDocFilterEntries,
    props.isExternalDocType,
    props.docType
  ])

  useEffect(() => {
    setInternalReload(false)

    if (props.isInSpace && !props.spaceId && !props.projectId) {
      return
    }

    if (
      props.metadata.initialDocumentsLoading &&
      props.viewType !== 'search'
    ) {
      return
    }

    props.actions.clearSelectedDocuments()
    props.actions.setShowGetInspired(false)
    cursor = ''

    const aController = new window.AbortController()
    const abortSignal = aController.signal

    isNextPageLoading = false
    hasNextPage = true
    setDocuments([])
    requestDocuments(abortSignal)

    return function () {
      aController.abort()
    }
  }, [
    props.filterType,
    props.forceReload,
    props.sortType,
    props.showArchived,
    props.isArchived,
    props.isInSpace,
    props.showUserDocs,
    props.spaceId,
    props.searchTerm,
    props.viewType,
    props.searchView,
    props.projectId,
    internalReload
  ])

  useEffect(() => {
    const removedItems = props.metadata.removals

    if (removedItems.length > 0) {
      removeDocuments(removedItems)
    }
  }, [props.metadata.removals.length])

  useEffect(() => {
    if (!props.isInSpace && !props.isInProject) return

    let removedItems = []
    for (let key in props.metadata.spaceOverrides) {
      const toRemove = props.metadata.spaceOverrides[key]
      removedItems.push({ id: toRemove.documentId, type: toRemove.documentType })
    }

    if (removedItems.length > 0) {
      removeDocuments(removedItems)
    }
  }, [props.metadata.spaceOverrides])

  const removeDocuments = (documentsToRemove = []) => {
    let updatedDocuments = documents.slice(0)
    if (documentsToRemove.length > 0 && updatedDocuments.length > 0) {
      documentsToRemove.forEach(rem => {
        const docIndex = updatedDocuments.findIndex(d => d.id === rem.id && d.resourceType === rem.type)
        if (docIndex >= 0) {
          updatedDocuments.splice(docIndex, 1)
        }
      })
    }

    setDocuments(updatedDocuments)
  }

  const isItemLoaded = index => {
    return !hasNextPage || !!documents[index]
  }

  const loadMoreItems = () => {
    return requestDocuments()
  }

  // Add document drag events
  dropToSidebar(
    props.config.dragDropEnabled,
    props.selected.selected,
    setIsDropping,
    setMouseCoords,
    props.spaces
  )

  if (!documents.length && (props.errors.length > 0 || requestError)) {
    if (props.showFilters) {
      props.actions.setShowFilters(false)
    }

    return <LoadFailure onClick={() => { setInternalReload(true) }} type='documents' />
  }

  if (!isNextPageLoading && !props.isSubscriptionLoading && !initialLoad && !documents.length && !requestError) {
    // As per ENGAGE-3421, the layout of this component changes when "More to Discover" is shown, which is conditional to the
    // number of documents listed and the filter applied
    const isFiltering = props.filterType !== FILTER_ALL || props.searchTerm !== ''

    if (!props.account.userV2.flags.enableFreehandXFilteringSorting && props.showFilters && !isFiltering) {
      props.actions.setShowFilters(false)
    }
    if (!props.showArchived && (isFreeHandOnlySeat || isFreeHandOnlyTeam)) {
      return FILTER_EMPTY_STATES[FILTER_FREEHANDS]
    }

    if (
      props.filterType !== FILTER_ALL &&
      FILTER_EMPTY_STATES[props.filterType] &&
      !props.showArchived &&
      props.viewType !== 'search'
    ) {
      return FILTER_EMPTY_STATES[props.filterType]
    }

    return <NoResults
      account={props.account}
      location='document'
      isArchived={!isFiltering && props.showArchived}
      isFiltering={isFiltering}
      actions={props.actions}
      documentCount={props.documentCount}
      horizontal={showGetInspired}
      viewType={props.viewType}
      paywall={props.paywall}
    />
  }

  if (!props.showFilters) {
    props.actions.setShowFilters(true)
  }

  return <div ref={props.dragRef}>
    <WindowScroller isGrid throttleTime={15}>
      {({ ref: scrollerRef, outerRef, style, onScroll }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            const gutter = generateGutter(mqs)
            const columnCount = generateColumnCount(width, gutter)
            const columnWidth = (width + gutter) / columnCount
            const rowHeight = generateRowHeight(columnWidth, gutter, true)
            const rowCount = Math.ceil(documents.length / columnCount)
            const skeletonRowCount = 8

            if (documents.length === 0 && (props.metadata.initialDocumentsLoading || isNextPageLoading || hasNextPage)) {
              return (
                <FixedSizeGrid
                  ref={scrollerRef}
                  outerRef={outerRef}
                  style={style}
                  onScroll={onScroll}
                  className={`${cx(styles.grid, styles.responsiveRoot)}`}
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={skeletonRowCount * rowHeight}
                  rowCount={skeletonRowCount}
                  rowHeight={rowHeight}
                  width={width}>
                  {({ style }) => (<div style={{
                    ...style,
                    left: style.left + gutter,
                    width: style.width - gutter,
                    height: style.height - gutter
                  }}>
                    <Skeleton height={style.height - gutter} isDarker />
                  </div>
                  )}
                </FixedSizeGrid>)
            }

            return <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={documents.length + 1}
              minimumBatchSize={1}
              threshold={1}
              loadMoreItems={loadMoreItems}>
              {({ onItemsRendered, ref }) => (
                <FixedSizeGrid
                  ref={grid => {
                    ref(grid)
                    scrollerRef.current = grid
                    gridRef.current = grid
                  }}
                  outerRef={outerRef}
                  style={style}
                  onScroll={onScroll}
                  className={`${cx(styles.grid, styles.responsiveRoot)}`}
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  overscanRowCount={2}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  height={1000}
                  width={width}
                  itemData={{
                    // Props from redux
                    mqs: props.mqs,
                    canCreateSpaces: props.account.user.permissions.createSpaces,
                    canTransferDocuments: props.account.user.permissions.transferDocuments,
                    actions: props.actions,
                    config: props.config,
                    enableArchiving: props.enableArchiving,
                    enableRhombus: props.enableRhombus,
                    enableSpecs: props.enableSpecs,
                    externalTypesConfig: props.externalTypesConfig,
                    enableFreehandXFilteringSorting: props.account?.userV2?.flags?.enableFreehandXFilteringSorting,
                    getExtDocFallbackIcon: props.getExtDocFallbackIcon,
                    isInSpace: props.isInSpace,
                    isInProject: props.isInProject,
                    location: props.location,
                    metadata: props.metadata,
                    multipleTeams: props.account.user.multipleTeams,
                    selected: props.selected,
                    studioWebEnabled: props.studioWebEnabled,
                    sortType: props.sortType,

                    // Generated props
                    isDropping,
                    dragSelections: JSON.parse(dragSelections),
                    columnCount,
                    documents,
                    hasNextPage,
                    // isNextPageLoading,
                    spaceOverridesLength: Object.keys(props.metadata.spaceOverrides).length,
                    permissionsLength: Object.keys(props.metadata.permissions).length
                  }}
                  onItemsRendered={gridProps => {
                    const {
                      visibleRowStartIndex,
                      visibleColumnStartIndex,
                      visibleColumnStopIndex
                    } = gridProps

                    const start = visibleRowStartIndex * columnCount + visibleColumnStartIndex
                    // If the infinite loader starts to act janky, this is the place to start playing with. Essentially
                    // this determines what the "visible range" of the rows are, to determine where to start loading
                    const end = start + ((Math.ceil(window.innerHeight / rowHeight) + 2) * columnCount + visibleColumnStopIndex)

                    onItemsRendered({
                      visibleStartIndex: start,
                      visibleStopIndex: end
                    })
                  }}>
                  {MemoizedDocument}
                </FixedSizeGrid>
              )}
            </InfiniteLoader>
          }}
        </AutoSizer>
      )}
    </WindowScroller>

    <DragSelect
      actions={props.actions}
      config={props.config}
      gridRef={gridRef}
      onSelection={setDragSelections}
      permissions={props.metadata.permissions}
    />

    {props.config.dragDropEnabled && (
      <DropSelections
        isDropping={isDropping}
        externalTypesConfig={props.externalTypesConfig}
        getExtDocFallbackIcon={props.getExtDocFallbackIcon}
        enableFreehandXFilteringSorting={props.account?.userV2?.flags?.enableFreehandXFilteringSorting}
        {...mouseCoords}
      />
    )}
  </div>
}

DocumentItems.defaultProps = {
  documents: [],
  forceReload: false
}

DocumentItems.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  documentCount: PropTypes.number,
  documents: PropTypes.array,
  enableSpaces: PropTypes.bool,
  enableRhombus: PropTypes.bool,
  externalTypesConfig: PropTypes.object,
  getExtDocFallbackIcon: PropTypes.func,
  errors: PropTypes.array,
  forceReload: PropTypes.bool,
  homeSection: PropTypes.string,
  selected: PropTypes.object,
  serverActions: PropTypes.object,
  tile: PropTypes.object,
  location: PropTypes.object,
  page: PropTypes.number,
  isWithSidebar: PropTypes.bool,
  isInSpace: PropTypes.bool,
  isInProject: PropTypes.bool,
  mqs: PropTypes.object,
  studioWebEnabled: PropTypes.bool,
  viewType: PropTypes.string,
  paywall: PropTypes.object
}

export default DocumentItems
