import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import LoadFailure from '../components/Layout/LoadFailure'
import NoResults from '../components/Layout/ResponsiveNoResults'

import { AutoSizer } from 'react-virtualized'
import { ReactWindowScroller as WindowScroller } from 'react-window-scroller'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import deferable from '../utils/deferrable'

import Space from '../components/Space/Sidebar/SpaceItem'
import Project from '../components/Space/Sidebar/ProjectItem'

import SpacesListHeader from '../components/Space/Sidebar/SpacesListHeader'
import LoadingSpaceItems from '../components/Space/Sidebar/LoadingSpaceItems'
import LoadingSpace from '../components/Space/Sidebar/LoadingSpace'
import { trackEvent } from '../utils/analytics'
import { APP_SEARCH_DATA_FETCHED } from '../constants/TrackingEvents'
import styles from '../css/search-spaces-list.css'

let loadingDeferrable = null

let lastSearchTerm

const DOCUMENT_LIMIT = 50

const SearchResult = (props) => {
  const { index, data: { spacesResource } } = props
  const searchResult = spacesResource.spaces[index]

  if (!searchResult) {
    return <LoadingSpaceItems />
  }

  return searchResult.resourceType === 'project' ? <Project {...props} /> : <Space {...props} />
}

const SearchSpacesList = (props) => {
  let listRef = React.createRef()
  const [firstLoad, setFirstLoad] = useState(true)

  const reloadPage = () => window.location.reload()
  const { account, actions, forceReload, projects, serverActions, spaces: globalSpaces, searchTerm, showUserDocs, paywall } = props

  const spacesDetail = globalSpaces.spacesDetail
  const spacesSearchResource = globalSpaces.spacesSearchResource
  const spaces = spacesSearchResource.spaces
  const cursor = spacesSearchResource.cursor
  const requestError = spacesSearchResource.error

  // feature flags
  const spaceProjectsEnabled = account.userV2 && account.userV2.flags.spaceProjectsEnabled

  const itemCount = cursor !== '' ? spaces.length + 1 : spaces.length
  const isItemLoaded = index => (!hasNextPage() && !spacesSearchResource.isLoading && !spacesDetail.isLoading) || index < spaces.length
  const hasNextPage = () => {
    return cursor !== ''
  }

  const handleScroll = ({ scrollTop }) => {
    if (listRef && listRef.current) {
      listRef.current.scrollTo(scrollTop)
    }
  }

  const handleLoadMore = (reset, forceFetch = false) => {
    const renderStartTime = window.performance.now()
    loadingDeferrable = deferable()
    let newRequest = false

    // Scroll to top if its a new search
    if (!cursor && (props.searchTerm !== lastSearchTerm)) {
      newRequest = true
      handleScroll({ scrollTop: 0 })
    }

    lastSearchTerm = props.searchTerm

    if (account.user.userID && (firstLoad || forceFetch || (!spacesSearchResource.isLoading && !spacesDetail.isLoading))) {
      serverActions.getSpacesSearchResource.request(reset, searchTerm, 'spaces', 'space', cursor)
    }

    return loadingDeferrable.then((trackingData) => {
      trackEvent(APP_SEARCH_DATA_FETCHED, {
        index: props.metadata.analytics.length,
        newRequest,
        page: trackingData.requestPageCount,
        pageSize: DOCUMENT_LIMIT,
        pageContext: 'search-spaces',
        resourcesLoaded: true,
        resourcesReturned: trackingData.resourcesReturned,
        sort: 'relevance',
        spaceFilter: true,
        timeToResourcesFetched: trackingData.timeToResourceFetched,
        timeToResourcesRendered: window.performance.now() - renderStartTime,
        type: 'spaces',
        resourcesTimeToFetched: trackingData.timeToResourceFetched,
        metadataFetched: trackingData.metadataFetched,
        metadataLoadTime: trackingData.metadataLoadTime
      })
    })
  }

  useEffect(() => {
    if (!account.user.userID && showUserDocs) return

    actions.clearSelectedDocuments()
    actions.setShowGetInspired(false)
    serverActions.getSpacesSearchResource.request(true, searchTerm, 'spaces', 'space', cursor)
  }, [
    forceReload,
    account.user.userID,
    searchTerm
  ])

  useEffect(() => {
    const spacesDetail = globalSpaces.spacesDetail
    const spacesSearchResource = globalSpaces.spacesSearchResource
    if ((!spacesDetail.isLoading && !spacesSearchResource.isLoading) || (spacesSearchResource.spaces.length === 0 && !spacesSearchResource.isLoading)) {
      if (loadingDeferrable) {
        loadingDeferrable.resolves({
          metadataLoadTime: spacesSearchResource.metadataFetched ? spacesDetail.fetchTime : null,
          timeToResourceFetched: spacesSearchResource.fetchTime,
          resourcesReturned: spacesSearchResource.frameCount,
          requestPageCount: spacesSearchResource.page,
          metadataFetched: spacesSearchResource.metadataFetched
        })
      }
      setFirstLoad(false)
    }
    if (spacesDetail.error || spacesSearchResource.error) {
      loadingDeferrable.rejects(new Error('fetching space search resource failed'))
    }
  }, [spacesDetail, spacesSearchResource])

  // Something went wrong UI
  if (!spaces.length && requestError) {
    return <LoadFailure onClick={reloadPage} type='spaces' />
  }

  /// No matches
  if (!props.config.isLoading && !firstLoad && spaces.length === 0) {
    return <NoResults
      account={props.account}
      location='space'
      isFiltering
      actions={props.actions}
      documentCount={props.documentCount}
      paywall={paywall}
    />
  }

  // Loading skeletons
  if ((spacesSearchResource.isLoading || (spaces.length > 0 && spacesDetail.isLoading)) && cursor === '') {
    return (
      <>
        <SpacesListHeader spaceProjectsEnabled={spaceProjectsEnabled} />
        <LoadingSpaceItems />
      </>
    )
  }

  // List of results
  return (<div data-qa='search-spaces-list'>
    <SpacesListHeader spaceProjectsEnabled={spaceProjectsEnabled} />
    <WindowScroller
      onScroll={handleScroll}
      scrollingResetTimeInterval={0}
      throttleTime={15}
    >
      {({ ref: scrollerRef, outerRef, style, onScroll }) => (
        <AutoSizer className={styles.searchSpacesListAutoSizer}>
          {({ width, height }) => (
            <InfiniteLoader
              itemCount={itemCount}
              isItemLoaded={isItemLoaded}
              loadMoreItems={handleLoadMore}>
              {({ onItemsRendered, ref: infLoaderRef }) => (
                <FixedSizeList
                  itemSize={80}
                  ref={list => {
                    infLoaderRef(list)
                    scrollerRef.current = list
                    listRef.current = list
                  }} outerRef={outerRef}
                  onScroll={onScroll}
                  height={height}
                  itemCount={itemCount}
                  itemData={{
                    projectsDetail: projects ? projects.projectsDetail : {},
                    spacesResource: { spaces: spaces },
                    spaceProjectsEnabled,
                    withIcon: true,
                    account,
                    serverActions: props.serverActions,
                    spacesMembers: { spaces: props.spaces.spacesMembers },
                    spacesDetail: props.spaces.spacesDetail
                  }}
                  onItemsRendered={onItemsRendered}
                  style={style}
                  width={width}
                >
                  {isItemLoaded ? SearchResult : LoadingSpace}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  </div>)
}

SearchSpacesList.defaultProps = {
  hasTopBorder: true
}

SearchSpacesList.propTypes = {
  hasTopBorder: PropTypes.bool,
  searchTerm: PropTypes.string,
  documentCount: PropTypes.number.isRequired,
  paywall: PropTypes.object
}

export default SearchSpacesList
