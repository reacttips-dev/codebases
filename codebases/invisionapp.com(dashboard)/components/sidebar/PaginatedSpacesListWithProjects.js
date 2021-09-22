import React, { memo, useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import RSC from 'react-scrollbars-custom'

import deferrable from '../../utils/deferrable'
import { useDebouncedCallback } from 'use-debounce'

import { Skeleton, Text, Action, Icon } from '@invisionapp/helios-one-web'

import SpacesLoader from './SpacesLoader'

import { APP_SIDEBAR_DATA_FETCHED, APP_SIDEBAR_LINK_CLICKED, APP_SPACE_OPENED, APP_PROJECT_OPENED } from '../../constants/tracking-events'

import styles from './css/spaces.css'
import SpaceLink from './SpaceLinkWithProjects'

import { GenerateIDURL } from '../../utils/urlIDParser'

const PAGE_FRAME_SIZE = 50
const MIGRATED_SPACE_TITLE = 'Migrated Documents'
let loadingDeferrable = null
let currentUserId = -1
let spaceUpdateCount = 0
let firstLoad = true

export const listRef = React.createRef()
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

export const SpacesList = ({
  canCreateSpaces,
  closeSidebar,
  handleTrackEvent,
  linkClicked,
  loadProjects,
  loadSpaces,
  projects,
  selected,
  sidebarSpaces,
  spaces: globalSpaces,
  sidebarSpacesState,
  moveDocumentsToSpace,
  moveDocumentsToProject,
  showProjectInSpace,
  showCreateProjectModal,
  userId,
  projectsPrototypeUIEnabled
}) => {
  const spaces = sidebarSpaces.spaces
  const cursor = sidebarSpaces.cursor

  if (!sidebarSpaces.isLoading && !firstLoad && canCreateSpaces && cursor === '' && (spaces.length === 0 || (spaces.length === 1 && spaces[0].title === MIGRATED_SPACE_TITLE))) {
    spaces.push({ createNewSpaceLink: true })
  }

  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0)
  const [projectLoaded, setProjectLoaded] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

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

    linkClicked(`/spaces/${GenerateIDURL(space.id, space.title)}`)
    closeSidebar()
  }, [])

  const handleProjectClick = useCallback((project, e) => {
    handleTrackEvent(APP_PROJECT_OPENED, {
      projectID: project.id,
      projectContext: 'sidebar'
    })

    linkClicked(`/projects/${GenerateIDURL(project.id, project.title)}`)
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

    const spaceUIState = (sidebarSpacesState && sidebarSpacesState[space.id]) ? sidebarSpacesState[space.id] : {}

    return (
      <div style={{ ...style, width: 264 }} className={styles.spaceItem} key={`space-link-item-${space.id}`}>
        {space.createNewSpaceLink
          ? <SpaceListCreateSpaceLink />
          : <SpaceLink
            canCreateSpaces={canCreateSpaces}
            getProjects={loadProjects}
            handleTrackEvent={handleTrackEvent}
            isDragging={selected.isDragging}
            moveDocumentsToSpace={moveDocumentsToSpace}
            moveDocumentsToProject={moveDocumentsToProject}
            selected={selected.documents}
            projects={projects.projects[space.id]}
            space={space}
            isProjectsOpened={spaceUIState.isOpen}
            index={index}
            showProjectInSpace={showProjectInSpace}
            showCreateProjectModal={showCreateProjectModal}
            onSpaceClick={handleSpaceClick}
            onProjectClick={handleProjectClick}
            setActiveSpaceIndex={() => setActiveSpaceIndex(index)}
            projectsPrototypeUIEnabled={projectsPrototypeUIEnabled}
          />}
      </div>
    )
  }, [spaces, sidebarSpacesState, projects.projects, selected])

  const handleLoadMore = (reset) => {
    const renderStartTime = window.performance.now()

    if (userId) {
      loadingDeferrable = deferrable()
      firstLoad = false
      loadSpaces(reset, sidebarSpaces.cursor, PAGE_FRAME_SIZE, userId)
    }

    if (!projects.isLoading) {
      setInitialLoad(false)
    }

    return loadingDeferrable.then((trackingEvent) => {
      handleTrackEvent(APP_SIDEBAR_DATA_FETCHED, {
        timeToResourcesRendered: window.performance.now() - renderStartTime,
        resource: 'projects',
        timeToResourcesFetched: projects.fetchTime,
        resourcesReturned: projects.resourcesSize,
        sortOrder: projects.sortOrder,
        sortBy: projects.sortBy,
        spaceID: projects.projectsSpaceIdFetched,
        ...trackingEvent
      })
    })
  }

  const getItemSize = index => {
    const itemHeight = 32 // Project Item height is 32px
    const space = spaces[index]

    if (!space) {
      return itemHeight
    }

    const spacesUIState = sidebarSpacesState[space.id] || {}

    const spaceProjects = projects.projects[space.id]
    if (space.hasContainers && spacesUIState.isOpen && spaceProjects) {
      return itemHeight * (spaceProjects.length + 1) + 4
    }

    return itemHeight
  }

  useEffect(() => {
    listRef && listRef.current && listRef.current.resetAfterIndex(activeSpaceIndex)
  }, [projects.projects, sidebarSpaces])

  useEffect(() => {
    listRef && listRef.current && listRef.current.resetAfterIndex(0)
  }, [sidebarSpacesState])

  // When spaces comes back updated, resolve deferrable promise
  useEffect(() => {
    if (sidebarSpaces && !sidebarSpaces.isLoading && loadingDeferrable) {
      loadingDeferrable.resolves({
        fetchTime: sidebarSpaces.fetchTime,
        resourcesReturned: sidebarSpaces.pageCount,
        pageSize: PAGE_FRAME_SIZE,
        requestPageCount: sidebarSpaces.page
      })
      setInitialLoad(false)
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

  useEffect(() => {
    const projectUpdates = projects.projectUpdates
    const lastUpdate = projectUpdates[projectUpdates.length - 1]

    if (lastUpdate && lastUpdate.action === 'update' && !lastUpdate.data.isDescriptionUpdate) {
      loadProjects(lastUpdate.spaceId)
    }
  }, [projects.projectUpdates])

  const setStateProjectsLoaded = async (projectLoadedState) => {
    await setProjectLoaded(projectLoadedState)
  }

  useEffect(() => {
    if (!initialLoad && projects && !projects.isLoading && projectLoaded === projects.isLoading && handleTrackEvent) {
      handleTrackEvent(APP_SIDEBAR_DATA_FETCHED, {
        resource: 'projects',
        timeToResourcesRendered: (window.performance.now() - projects.initialEventTime),
        timeToResourcesFetched: projects.fetchTime,
        resourcesReturned: projects.resourcesSize,
        sortOrder: projects.sortOrder,
        sortBy: projects.sortBy,
        spaceID: projects.projectsSpaceIdFetched
      })
    }
    setStateProjectsLoaded(!projects.isLoading)

    if (!projects.isLoading) {
      setInitialLoad(false)
    }
  }, [projects.isLoading])

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
                    itemSize={getItemSize}
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
  spaces: PropTypes.object.isRequired,
  projects: PropTypes.object,
  showProjectInSpace: PropTypes.func,
  showCreateProjectModal: PropTypes.func,
  projectsPrototypeUIEnabled: PropTypes.bool
}

export default memo(SpacesList)
