import React, { memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import qs from 'query-string'

import { FixedSizeList, areEqual } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'

import { Skeleton } from '@invisionapp/helios'

import Document from './Document'
import Loading from '../../Layout/Loading'
import NoDocuments from './NoDocuments'

import {
  GET_RESOURCES,
  SEARCH_RESOURCES
} from '../../../constants/ServerURLs'

import { APP_HOME_DATA_FETCHED } from '../../../constants/TrackingEvents'

import request from '../../../utils/API'
import { trackEvent } from '../../../utils/analytics'

import styles from '../../../css/modals/batch-add/documents.css'
import { FREEHAND } from '../../../constants/DocumentTypes'

let hasNextPage = true
let isNextPageLoading = false
let currentQuery = ''
let cursor = ''
let currentPage = 1

export const BatchDocument = ({ index, style, data: props }) => {
  const doc = props.documents && props.documents[index]
  const isSelected = doc && props.selected.findIndex(sel => sel.id === doc.id && sel.resourceType === doc.resourceType) >= 0
  const isActive = index === props.activeDocument
  const freehandMetadata = props?.freehandMetadata?.[doc?.id]

  return (<div className={styles.document} style={style}>
    { props.documents && props.documents[index] && (doc.resourceType !== FREEHAND || (doc.resourceType === FREEHAND && !props.enableFreehandXFilteringSorting) || (doc.resourceType === FREEHAND && freehandMetadata))
      ? <Document
        active={isActive}
        enableFreehandXFilteringSorting={props.enableFreehandXFilteringSorting}
        handleClick={props.handleDocumentClick}
        handleMouseLeave={props.handleMouseLeave}
        handleMouseOver={props.handleMouseOver}
        index={index}
        document={doc}
        freehandMetadata={freehandMetadata}
        isSelected={isSelected}
      />
      : <div className={styles.loader}>
        <Skeleton height={20} className={styles.icon} />
        <div className={styles.titleWrap}>
          <Skeleton height={13} className={styles.title} />

          <div className={styles.meta}>
            <Skeleton height={13} className={styles.meta1} />
            <Skeleton height={13} className={styles.meta2} />
          </div>
        </div>
      </div>
    }
  </div>)
}

const MemoizedDocument = memo(BatchDocument, areEqual)

const BatchDocuments = ({
  actions,
  serverActions,
  activeDocument,
  documents,
  filterText,
  freehandMetadata,
  onSelectAdd,
  selected,
  setDocuments,
  spaceId,
  projectId,
  enableFreehandXFilteringSorting
}) => {
  const gridRef = useRef(null)

  const requestDocuments = () => {
    if (isNextPageLoading) return Promise.resolve({})

    isNextPageLoading = true

    let endpoint = GET_RESOURCES
    let newRequest = false
    let params = {
      limit: 50,
      types: ['board', 'freehand', 'harmony', 'presentation', 'prototype', 'rhombus', 'spec']
    }

    if (projectId) {
      params.projectID = `!${projectId}`
    } else {
      params.spaceID = `!${spaceId}`
    }

    if (filterText !== '') {
      endpoint = SEARCH_RESOURCES
      params.search = filterText
    } else {
      params.sortBy = 'userLastAccessedAt'
      params.sortOrder = 'desc'
    }

    let query = qs.stringify(params)
    if (cursor !== '' && query === currentQuery) {
      query = `cursor=${cursor}`
      currentPage++
    } else {
      newRequest = true
      currentQuery = query
      currentPage = 1
    }

    const start = window.performance.now()

    return request(`${endpoint}?${query}`, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(res => {
      isNextPageLoading = false

      cursor = res.response.pagination.cursor || ''
      if (!res.response.resources || res.response.resources.length < 50) hasNextPage = false

      const end = window.performance.now()
      setDocuments(newRequest ? res.response.resources : documents.concat(res.response.resources))
      if (enableFreehandXFilteringSorting) {
        serverActions.getFreehandMetadata.request(res.response.resources, { page: currentPage })
      }
      trackEvent(APP_HOME_DATA_FETCHED, {
        status: 'success',
        timeToResourcesFetched: res.loadTime,
        timeToResourcesRendered: end - start,
        permissionsLoadTime: 0,
        assetsLoadTime: 0,
        requestPageCount: currentPage,
        resourcesReturned: res.response.resources ? res.response.resources.length : 0,
        pageSize: 50,
        pageContext: 'addexisting',
        sort: params.search ? 'relevance' : 'viewed',
        type: 'all'
      })
    })
  }

  const handleDocumentClick = (doc) => {
    actions.analyticsSetContext({ documentType: doc.resourceType })
    actions.selectActiveDocument(doc)
    onSelectAdd()
  }

  const handleMouseOver = (index) => {
    actions.setActiveDocument(index)
  }

  const handleMouseLeave = (index) => {
    actions.setActiveDocument(-1)
  }

  useEffect(() => {
    return () => {
      hasNextPage = true
    }
  }, [])

  useEffect(() => {
    cursor = ''
    hasNextPage = true
    requestDocuments()
  }, [filterText])

  useEffect(() => {
    if (gridRef.current && activeDocument >= 0) gridRef.current.scrollToItem(activeDocument)
  }, [activeDocument])

  const renderDocumentList = () => {
    if (documents.length === 0 && !hasNextPage) {
      return (
        <NoDocuments empty={selected.length === 0 || filterText !== ''} />
      )
    }

    const isItemLoaded = index => !hasNextPage || index < documents.length
    const loadMoreItems = () => { return requestDocuments() }

    return (
      <div className={`${styles.documentsList}`}>
        { isNextPageLoading && documents.length === 0
          ? <Loading top={16} type='batchDocuments' />
          : <AutoSizer>
            {({ width, height }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={documents.length === 0 ? 50 : documents.length + 1}
                minimumBatchSize={1}
                threshold={1}
                loadMoreItems={loadMoreItems}>
                {({ onItemsRendered, ref }) => (
                  <FixedSizeList
                    width={width}
                    height={height}
                    itemCount={documents.length === 0 ? 50 : documents.length}
                    itemSize={64}
                    onItemsRendered={onItemsRendered}
                    itemData={{
                      activeDocument,
                      documents,
                      enableFreehandXFilteringSorting,
                      freehandMetadata,
                      handleDocumentClick,
                      handleMouseOver,
                      handleMouseLeave,
                      selected
                    }}
                    ref={grid => {
                      ref(grid)
                      gridRef.current = grid
                    }}>
                    {MemoizedDocument}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        }
      </div>
    )
  }

  return (
    <div className={
      cx(styles.root, styles.rootInfinite, {
        [styles.noDocuments]: documents.length === 0
      })}>
      { renderDocumentList() }
    </div>
  )
}

BatchDocuments.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  activeDocument: PropTypes.number,
  documents: PropTypes.array,
  filterText: PropTypes.string,
  freehandMetadata: PropTypes.object,
  onSelectAdd: PropTypes.func,
  selected: PropTypes.array,
  setDocuments: PropTypes.func,
  serverActions: PropTypes.object,
  spaceId: PropTypes.string,
  projectId: PropTypes.string,
  enableFreehandXFilteringSorting: PropTypes.bool
}

export default BatchDocuments
