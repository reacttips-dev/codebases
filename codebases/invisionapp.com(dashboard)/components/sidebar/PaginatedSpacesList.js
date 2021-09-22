import React, { memo, useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import RSC from 'react-scrollbars-custom'

import deferrable from '../../utils/deferrable'
import { useDebouncedCallback } from 'use-debounce'

import { Skeleton, Text, Action, Icon } from '@invisionapp/helios-one-web'

import SpacesLoader from './SpacesLoader'

import { APP_SIDEBAR_DATA_FETCHED, APP_SIDEBAR_LINK_CLICKED, APP_SPACE_OPENED } from '../../constants/tracking-events'

import styles from './css/spaces.css'
import SpaceLink from './SpaceLink'

import generateSpaceURL from '../../utils/generate-space-url'

const PAGE_FRAME_SIZE = 50
const MIGRATED_SPACE_TITLE = 'Migrated Documents'
let loadingDeferrable = null
let currentUserId = -1
let spaceUpdateCount = 0
let firstLoad = true

const listRef = React.createRef()
const scrollerRef = React.createRef()
const outerRef = React.createRef()

const CustomScrollbars = ({
  children,
  forwardedRef,
  onScroll,
  style,
  className
}) => {
  const [inUse, setInUse] = useState(false)
  const [hover, setHover] = useState(false)

  const debounceScroll = useDebouncedCallback(
    // function
    (e) => {
      setInUse(false)
    },
    // delay in ms
    600
  )

  const handleScroll = (e) => {
    setInUse(true)
    debounceScroll.callback(e)
  }

  return (
    <RSC
      ref={scrollerRef}
      className={className}
      style={style}
      noScrollX
      wrapperProps={{
        renderer: props => {
          const { elementRef, ...restProps } = props
          return <div {...restProps} ref={elementRef} style={{
            ...restProps.style,
            right: 8
          }} />
        }
      }}
      thumbYProps={{
        renderer: props => {
          const { elementRef, ...restProps } = props
          return <div {...restProps} ref={elementRef} className={styles.scrollThumb} style={{ opacity: inUse || hover ? 1 : 0 }} />
        }
      }}

      trackYProps={{
        renderer: props => {
          const { elementRef, onScroll: rscOnScroll, ...restProps } = props

          return <span {...restProps}
            style={{ ...restProps.style, background: 'transparent', left: 'auto', right: '3px', width: '6px' }}
            onMouseEnter={() => { setHover(true) }}
            onMouseOut={() => { setHover(false) }}
            onMouseOver={() => { setHover(true) }}
            onWheel={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const currentScrollTop = scrollerRef.current.getScrollState(true).scrollTop
              const wheelDelta = Math.floor(e.deltaY)
              const scrollTopNewPosition = currentScrollTop + wheelDelta

              scrollerRef.current.scrollTo(0, scrollTopNewPosition)

              return false
            }}
            ref={ref => {
              forwardedRef(ref)
              elementRef(ref)
            }}
          />
        }
      }}

      scrollerProps={{
        renderer: props => {
          const { elementRef, onScroll: rscOnScroll, ...restProps } = props
          return (
            <span
              {...restProps}
              onScroll={e => {
                onScroll(e)
                rscOnScroll(e)
                handleScroll()
              }}
              ref={ref => {
                forwardedRef(ref)
                elementRef(ref)
              }}
            />
          )
        }
      }}
    >
      {children}
    </RSC>
  )
}

const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref} />
))

export const SpacesList = ({ canCreateSpaces, closeSidebar, handleTrackEvent, linkClicked, loadSpaces, selected, sidebarSpaces, spaces: globalSpaces, moveDocumentsToSpace, userId }) => {
  const spaces = sidebarSpaces.spaces
  const cursor = sidebarSpaces.cursor

  if (!sidebarSpaces.isLoading && !firstLoad && canCreateSpaces && cursor === '' && (spaces.length === 0 || (spaces.length === 1 && spaces[0].title === MIGRATED_SPACE_TITLE))) {
    spaces.push({ createNewSpaceLink: true })
  }

  const hasNextPage = () => cursor !== ''
  const itemCount = cursor !== '' ? spaces.length + 1 : spaces.length
  const isItemLoaded = index => (!hasNextPage() && !sidebarSpaces.isLoading) || index < spaces.length

  const handleCreateSpace = useCallback(() => {
    if (handleTrackEvent) {
      handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, {
        link_clicked: 'create_space_emptystate'
      })
    }
  }, [])

  const handleSpaceClick = useCallback((space, e) => {
    handleTrackEvent(APP_SPACE_OPENED, {
      spaceId: space.id,
      spaceType: space.isPublic || space.visibility === 'team' ? 'team' : 'invite-only',
      spaceContext: 'sidebar'
    })

    linkClicked(generateSpaceURL(space.id, space.title))
    closeSidebar()
  }, [])

  const SpaceListCreateSpaceLink = useMemo(() => ({ style }) => (
    <Action as='a' href={`/docs?modal=createSpace`} onClick={handleCreateSpace} style={style} className={cx(styles.space, styles.createLink)} data-app-shell-behavior='prevent-default'>
      <span className={styles.icon}>
        <Icon name='Add' color='surface-100'
          size={16}
        />
      </span>

      <Text
        align='left'
        className={styles.title}
        color='surface-100'
        as='span'
        size='body-14'>
          Create your first space
      </Text>
    </Action>
  ), [spaces])

  const SpaceListItem = useMemo(() => ({ index, style }) => {
    if (!spaces && (sidebarSpaces.isLoading || hasNextPage())) {
      return (
        <div key={`loader-line-${index}`} className={styles.skeletonWrap} style={Object.assign({}, style, {
          width: Math.floor((Math.random() * 3) * 40 + 80),
          opacity: 0.1
        })}>
          <Skeleton
            className={styles.skeleton}
            height={16}
          />
        </div>
      )
    } else if (!spaces && !sidebarSpaces.isLoading) {
      return null
    }

    const space = spaces[index]

    if (!space) {
      return null
    }
    return (
      <div style={{ ...style, width: 264 }} key={`space-link-item-${space.id}`}>
        {space.createNewSpaceLink
          ? <SpaceListCreateSpaceLink />
          : <SpaceLink
            isDragging={selected.isDragging}
            moveDocumentsToSpace={moveDocumentsToSpace}
            selected={selected.documents}
            space={space}
            open={false}
            onClick={handleSpaceClick}
          />}
      </div>
    )
  }, [spaces, selected])

  const handleLoadMore = (reset) => {
    const renderStartTime = window.performance.now()

    if (userId) {
      loadingDeferrable = deferrable()
      firstLoad = false
      loadSpaces(reset, sidebarSpaces.cursor, PAGE_FRAME_SIZE, userId)
    }

    return loadingDeferrable.then((trackingEvent) => {
      handleTrackEvent(APP_SIDEBAR_DATA_FETCHED, { timeToResourcesRendered: window.performance.now() - renderStartTime, ...trackingEvent })
    })
  }

  // When spaces comes back updated, resolve deferrable promise
  useEffect(() => {
    if (sidebarSpaces && !sidebarSpaces.isLoading && loadingDeferrable) {
      loadingDeferrable.resolves({
        fetchTime: sidebarSpaces.fetchTime,
        resourcesReturned: sidebarSpaces.pageCount,
        pageSize: PAGE_FRAME_SIZE,
        requestPageCount: sidebarSpaces.page
      })
    }
  }, [sidebarSpaces])

  useEffect(() => {
    if (userId && userId !== currentUserId) {
      currentUserId = userId
      handleLoadMore(true)
    }
  }, [userId])

  useEffect(() => {
    if (firstLoad || globalSpaces.spaceUpdates.length > spaceUpdateCount) {
      spaceUpdateCount++
      handleLoadMore(true)
    }
  }, [globalSpaces.spaceUpdates])

  return (
    <div style={{ height: '100%', display: 'flex', marginTop: '2px' }} >
      {firstLoad || (sidebarSpaces.isLoading && cursor === '') ? (
        <SpacesLoader />
      ) : (
        <AutoSizer>
          {({ width, height }) => {
            return (

              <InfiniteLoader
                itemCount={itemCount}
                isItemLoaded={isItemLoaded}
                loadMoreItems={handleLoadMore}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    ref={list => {
                      ref(list)
                      listRef.current = list
                    }}
                    height={height - 32}
                    outerElementType={CustomScrollbarsVirtualList}
                    outerRef={outerRef}
                    onItemsRendered={onItemsRendered}
                    itemCount={itemCount}
                    itemSize={36}
                    width={width}
                    className={cx(styles.spacesInfiniteList)}
                  >
                    {SpaceListItem}
                  </List>
                )}
              </InfiniteLoader>
            )
          }}
        </AutoSizer>
      )}
    </div>
  )
}

SpacesList.propTypes = {
  canCreateSpaces: PropTypes.bool.isRequired,
  handleTrackEvent: PropTypes.func,
  closeSidebar: PropTypes.func.isRequired,
  linkClicked: PropTypes.func.isRequired,
  moveDocumentsToSpace: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  loadSpaces: PropTypes.func.isRequired,
  sidebarSpaces: PropTypes.object.isRequired,
  spaces: PropTypes.object.isRequired
}

export default memo(SpacesList)
