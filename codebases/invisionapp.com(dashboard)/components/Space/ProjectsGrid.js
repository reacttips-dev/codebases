import React, { memo, useRef, useEffect, useState } from 'react'
import cx from 'classnames'
import qs from 'query-string'
import AutoSizer from 'react-virtualized-auto-sizer'
import { ReactWindowScroller as WindowScroller } from 'react-window-scroller'
import { FixedSizeGrid, areEqual } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import 'react-virtualized/styles.css'
import { Skeleton } from '@invisionapp/helios'

import ProjectTile from '../../components/Document/ProjectTile'

import {
  PROJECT_COLORS,
  PROJECT_SHAPE_NONE,
  PROJECT_SHAPE_SQUARE_UP,
  PROJECT_SHAPE_SQUARE_DOWN,
  PROJECT_SHAPE_CIRCLE_UP,
  PROJECT_SHAPE_CIRCLE_DOWN,
  PROJECT_SHAPE_ARCH_UP,
  PROJECT_SHAPE_ARCH_DOWN
} from '../../constants/ProjectTiles'

import { GET_RESOURCES } from '../../constants/ServerURLs'

import { generateColumnCount, generateGutter } from '../../utils/documentGrid'
import request from '../../utils/API'
import { navigate } from '../../utils/navigation'

import styles from '../../css/grid.css'

// Grid settings
const DOCUMENT_LIMIT = 50

let hasNextPage = true
let isNextPageLoading = false
let currentQuery = ''
let cursor = ''

const randomShape = index => {
  const shapeOrder = [
    PROJECT_SHAPE_SQUARE_UP,
    PROJECT_SHAPE_CIRCLE_DOWN,
    PROJECT_SHAPE_ARCH_UP,
    PROJECT_SHAPE_SQUARE_DOWN,
    PROJECT_SHAPE_CIRCLE_UP,
    PROJECT_SHAPE_ARCH_DOWN
  ]

  return shapeOrder[index % shapeOrder.length]
}

const randomColor = index => {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}

export const Project = ({ columnIndex, rowIndex, style, data: props }) => {
  const idx = (rowIndex * props.columnCount) + columnIndex
  const project = props.projects && props.projects[idx]
  const gutter = generateGutter(props.mqs)

  const color = useRef(null)
  const shape = useRef(null)

  if (!project && (isNextPageLoading || hasNextPage)) {
    return (
      <div style={{
        ...style,
        left: style.left + gutter,
        width: style.width - gutter,
        height: style.height - gutter
      }}>
        <Skeleton height={style.height - gutter} />
      </div>
    )
  } else if (!project && !isNextPageLoading) {
    return null
  }

  const deleteProject = () => props.actions.toggleDeleteModal({
    type: 'project',
    id: project.id,
    cuid: project.space.id,
    spaceName: project.space.title
  })

  // Get the metadata
  const metadata = props.projectsMetadata && props.projectsMetadata[project.id] ? props.projectsMetadata[project.id] : null
  if (metadata) {
    if (metadata.color !== '') {
      color.current = metadata.color
    } else {
      color.current = randomColor(idx)
    }

    if (metadata.shape !== PROJECT_SHAPE_NONE) {
      shape.current = metadata.shape
    } else {
      shape.current = randomShape(idx)
    }
  }

  return (
    <div key={idx} style={{
      ...style,
      left: style.left + gutter,
      width: style.width - gutter,
      height: style.height - gutter
    }}>
      <ProjectTile
        canDelete={props.canDelete}
        color={color.current}
        documentCount={metadata ? metadata.documentCount : 0}
        id={project.id}
        description={metadata ? metadata.description : null}
        onDeleteProject={deleteProject}
        path={`${project.path}${props.projectsPrototypeUIEnabled ? '/new' : ''}`}
        shape={shape.current}
        spaceId={project.space.id}
        spaceName={project.space.title}
        title={metadata && metadata.title ? metadata.title : project.title}
        updatedDate={project.contentUpdatedAt}
        viewedDate={project.userLastAccessedAt}
      />
    </div>
  )
}

const ProjectMemo = memo(Project, areEqual)

function generateRowHeight (columnWidth, gutterWidth) {
  const tileBorder = 0
  const infoPanelHeight = 80
  const imageRatio = 0.49
  const imageWidth = columnWidth - gutterWidth
  const imageHeight = imageWidth * imageRatio
  const rowHeight = imageHeight + infoPanelHeight + gutterWidth + tileBorder * 2
  return rowHeight
}

const ProjectsGrid = props => {
  if (!props.projectsEnabled && props.spacePath) {
    navigate(props.spacePath, { replace: true })
  }

  const gridRef = useRef()

  const [projects, setProjects] = useState([])
  const [requestError, setRequestError] = useState('')

  const generateQueryString = () => {
    return qs.stringify({
      limit: DOCUMENT_LIMIT,
      types: ['project'],
      spaceID: props.spaceId,
      sortBy: 'userLastAccessedAt'
    })
  }

  const requestProjects = async (abortSignal = null) => {
    if (isNextPageLoading || !props.spaceId) return {}

    isNextPageLoading = true
    let newRequest = false
    let params = ''
    let query = generateQueryString()

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

    const queryParams = params.length > 0 ? `?${params}` : ''
    const res = await request(`${GET_RESOURCES}${queryParams}`, {
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
        setProjects([])
      } else {
        props.actions.showAlert('danger', `Oops! We're having trouble loading more projects.`, true)
      }

      return
    }

    setRequestError('')
    cursor = res.response.pagination.cursor || ''
    hasNextPage = cursor !== ''
    if (!res.response.resources || res.response.resources.length < DOCUMENT_LIMIT) {
      hasNextPage = false
    }

    const listOfProject = newRequest ? res.response.resources : projects.concat(res.response.resources)
    setProjects(listOfProject)
    props.actions.setProjectCount(listOfProject.length)

    if (res.response.resources && res.response.resources.length > 0) {
      props.serverActions.getProjectsDetail.request(res.response.resources.map(project => project.id))
    }
  }

  useEffect(() => {
    if (!props.spaceId) return
    cursor = ''

    const aController = new window.AbortController()
    const abortSignal = aController.signal

    isNextPageLoading = false
    hasNextPage = true
    setProjects([])

    requestProjects(abortSignal)

    return function () {
      hasNextPage = true
      isNextPageLoading = false
      currentQuery = ''
      cursor = ''
      aController.abort()
    }
  }, [props.spaceId, props.forceReload])

  const isItemLoaded = index => !hasNextPage || !!projects[index]
  const loadMoreItems = () => {
    return requestProjects()
  }

  if (!projects.length && (requestError || (!hasNextPage && !isNextPageLoading)) && props.spacePath) {
    navigate(props.spacePath, { replace: true })
  }

  return <section style={{ marginTop: 16 }}>
    <WindowScroller isGrid throttleTime={15}>
      {({ ref: scrollerRef, outerRef, style, onScroll }) => (
        <AutoSizer disableHeight>
          {({ width }) => {
            const gutter = generateGutter(props.mqs)
            const columnCount = generateColumnCount(width, gutter, 400)
            const columnWidth = (width + gutter) / columnCount
            const rowHeight = generateRowHeight(columnWidth, gutter)
            const rowCount = Math.ceil(projects.length / columnCount)
            const skeletonRowCount = 8

            if (projects.length === 0 && (isNextPageLoading || hasNextPage)) {
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
                </FixedSizeGrid>
              )
            }

            return <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={projects.length + 1}
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
                    actions: props.actions,
                    canDelete: props.canDelete,
                    mqs: props.mqs,
                    projectsMetadata: props.projectsMetadata,
                    projectsPrototypeUIEnabled: props.projectsPrototypeUIEnabled,

                    // Generated props
                    columnCount,
                    projects,
                    hasNextPage,
                    isNextPageLoading
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
                  {ProjectMemo}
                </FixedSizeGrid>
              )}
            </InfiniteLoader>
          }}
        </AutoSizer>
      )}
    </WindowScroller>
  </section>
}

export default ProjectsGrid
