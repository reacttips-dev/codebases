import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { ReactWindowScroller as WindowScroller } from 'react-window-scroller'
import debounce from 'lodash/debounce'

import { AutoSizer } from 'react-virtualized'
import InfiniteLoader from 'react-window-infinite-loader'
import { VariableSizeList as List } from 'react-window'
import 'react-virtualized/styles.css'

import NoResults from '../../Layout/ResponsiveNoResults'

import { APP_HOME_DATA_FETCHED } from '../../../constants/TrackingEvents'
import { trackEvent } from '../../../utils/analytics'
import deferable from '../../../utils/deferrable'

import styles from '../../../css/space/sidebar/space-items.css'

import LoadingSpaceItems from './LoadingSpaceItems'
import LoadingSpace from './LoadingSpace'
import Space from './SpaceItem'

let loadingDeferrable = null
const listItemHeight = 80
const projectItemHeight = 65

const SpaceItems = (props) => {
  let listRef = React.createRef()

  const {
    account,
    actions,
    documentCount,
    paywall,
    projects,
    searchTerm,
    serverActions,
    spacesSort,
    spacesResource,
    spacesDetail,
    viewType,
    viewFilter
  } = props
  const [firstLoad, setFirstLoad] = useState(true)

  const handleScroll = ({ scrollTop }) => {
    if (listRef) {
      listRef.current.scrollTo(scrollTop)
    }
  }

  const spaces = spacesResource.spaces
  const cursor = spacesResource.cursor
  const hasNextPage = () => {
    return cursor !== ''
  }

  const getItemSize = index => {
    if (!spaces[index]) {
      return listItemHeight
    }

    const spaceProjects = projects.projects[spaces[index].id]

    if (spaces[index].hasContainers && spaces[index].isOpen && spaceProjects) {
      return listItemHeight + projectItemHeight * (spaceProjects.length)
    }

    return listItemHeight
  }

  const itemCount = cursor !== '' ? spaces.length + 1 : spaces.length
  const isItemLoaded = index => (!hasNextPage() && !spacesResource.isLoading && !spacesDetail.isLoading) || index < spaces.length

  const debouncedGetSpacesResources = debounce((reset) => {
    serverActions.getSpacesResource.request(reset, spacesSort, viewFilter, spacesResource.cursor, account.user.userID)
  }, { 'maxWait': 300 })

  const handleLoadMore = (reset, forceFetch = false) => {
    const renderStartTime = window.performance.now()
    loadingDeferrable = deferable()

    if (account.user.userID && (firstLoad || forceFetch || (!spacesResource.isLoading && !spacesDetail.isLoading))) {
      debouncedGetSpacesResources(reset)
    }

    return loadingDeferrable.then((trackingData) => {
      trackEvent(APP_HOME_DATA_FETCHED, {
        status: 'success',
        timeToResourceRendered: window.performance.now() - renderStartTime,
        pageContext: viewFilter === 'user' ? 'spaces-createdbyme' : 'spaces-all',
        ...trackingData
      })
    })
  }

  useEffect(() => {
    if ((!spacesDetail.isLoading && !spacesResource.isLoading) || (spacesResource.spaces.length === 0 && !spacesResource.isLoading)) {
      loadingDeferrable.resolves({
        metadataLoadTime: spacesResource.metadataFetched ? spacesDetail.fetchTime : null,
        timeToResourceFetched: spacesResource.fetchTime,
        resourcesReturned: spacesResource.frameCount,
        requestPageCount: spacesResource.page,
        metadataFetched: spacesResource.metadataFetched
      })
      setFirstLoad(false)
    }
    if (spacesDetail.error || spacesResource.error) {
      loadingDeferrable.rejects(new Error('fetching space resource failed'))
    }
  }, [spacesDetail, spacesResource])

  useEffect(() => {
    handleLoadMore(true, true)
  }, [account])

  useEffect(() => {
    setFirstLoad(true)
    handleLoadMore(true, true)
  }, [spacesSort, viewFilter])

  useEffect(() => {
    listRef && listRef.current && listRef.current.resetAfterIndex(0)
  }, [projects, spacesResource])

  return (
    <div className={cx(styles.spaceItemsWrap, styles.withSidebar)}>
      {spacesResource.spaces.length > 0 ? (
        <WindowScroller
          onScroll={handleScroll}
          scrollingResetTimeInterval={0}
          throttleTime={15}
        >
          {({ ref: scrollRef, outerRef, style, onScroll }) => (
            <AutoSizer disableHeight className={styles.spaceAutoSizer}>
              {({ width }) => {
                if (firstLoad || (spacesResource.isLoading && spacesResource.cursor === '')) {
                  return <LoadingSpaceItems />
                }
                return (
                  <InfiniteLoader
                    itemCount={itemCount}
                    isItemLoaded={isItemLoaded}
                    loadMoreItems={handleLoadMore}
                  >
                    {({ onItemsRendered, ref: infLoaderRef }) => (
                      <List
                        ref={list => {
                          infLoaderRef(list)
                          scrollRef.current = list
                          listRef.current = list
                        }}
                        onItemsRendered={onItemsRendered}
                        style={style}
                        outerRef={outerRef}
                        onScroll={onScroll}
                        height={2000}
                        itemCount={itemCount}
                        itemSize={getItemSize}
                        width={width}
                        itemData={{
                          spaces,
                          projects,
                          spaceProjectsEnabled: account.userV2.flags.spaceProjectsEnabled,
                          ...props
                        }}
                        className={styles.spaceItemsList}
                      >
                        {isItemLoaded ? Space : LoadingSpace}
                      </List>
                    )}
                  </InfiniteLoader>
                )
              }}
            </AutoSizer>
          )}
        </WindowScroller>
      ) : (
        !firstLoad ? <NoResults
          account={account}
          location='space'
          isFiltering={searchTerm !== ''}
          actions={actions}
          documentCount={documentCount}
          viewType={viewType}
          paywall={paywall}
        /> : <LoadingSpaceItems />
      )}
    </div>
  )
}

SpaceItems.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  documentCount: PropTypes.number,
  projects: PropTypes.object,
  projectsDetail: PropTypes.object,
  serverActions: PropTypes.object,
  spaceDocuments: PropTypes.object,
  spaces: PropTypes.array,
  spacesSort: PropTypes.string,
  tile: PropTypes.object,
  viewFilter: PropTypes.string,
  viewType: PropTypes.string,
  searchTerm: PropTypes.string,
  spacesDetail: PropTypes.object,
  spacesMembers: PropTypes.object,
  spacesResource: PropTypes.object,
  paywall: PropTypes.object
}

export default SpaceItems
