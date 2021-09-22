import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Text, Box, Skeleton, Toast } from '@invisionapp/helios-one-web'

import SpacesLoader from './SpacesLoader'
import cx from 'classnames'

import Portal from '../common/Portal'
import PaginatedSpacesList from './PaginatedSpacesList'
import PaginatedSpacesListWithProjects from './PaginatedSpacesListWithProjects'
import { SpacesList } from './SpacesList'
import { sortSpaces } from '../../selectors/spaces'

import styles from './css/spaces.css'
import AddSpaceActionButton from './AddSpaceActionButton'

const MySpacesComponent = ({ canCreateSpaces, handleTrackEvent, showCreateSpaceModal, numberOfSpaces }) => {
  if (!canCreateSpaces && numberOfSpaces < 1) {
    return null
  }

  return (
    <Box alignItems='center' justifyContent='between' className={cx(styles.myspaceHeader)}>
      <Text size='heading-16' color='surface-100'>My Spaces</Text>
      {canCreateSpaces && <AddSpaceActionButton
        handleTrackEvent={handleTrackEvent}
        showCreateSpaceModal={showCreateSpaceModal}
      />}
    </Box>
  )
}

const MySpaceHeaderSkeleton = () => (
  <div className={styles.myspaceHeaderSkeleton}>
    <Skeleton height={16} />
    <Skeleton height={16} />
    <Skeleton height={16} />
  </div>
)

const PaginatedList = (props) => (
  props.enableProjectsSupport
    ? <PaginatedSpacesListWithProjects {...props} />
    : <PaginatedSpacesList {...props} />
)

export class Spaces extends Component {
  static propTypes = {
    canCreateSpaces: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    handleTrackEvent: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    linkClicked: PropTypes.func.isRequired,
    linkCount: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    moveDocumentsToSpace: PropTypes.func.isRequired,
    moveDocumentsToProject: PropTypes.func.isRequired,
    loadProjects: PropTypes.func.isRequired,
    loadSpaces: PropTypes.func.isRequired,
    projects: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    sidebarSpaces: PropTypes.object.isRequired,
    sidebarSpacesState: PropTypes.object.isRequired,
    spaces: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    enablePaginatedSpacesSidebar: PropTypes.bool,
    enableProjectsSupport: PropTypes.bool,
    showProjectInSpace: PropTypes.func,
    showCreateProjectModal: PropTypes.func,
    isCondensed: PropTypes.bool,
    shouldShowHiddenUI: PropTypes.bool
  }

  render () {
    const {
      canCreateSpaces,
      permissionsLoading,
      closeSidebar,
      error,
      showCreateSpaceModal,
      showCreateProjectModal,
      handleTrackEvent,
      isLoading,
      linkClicked,
      linkCount,
      moveDocumentsToSpace,
      moveDocumentsToProject,
      open,
      loadProjects,
      loadSpaces,
      selected,
      sidebarSpaces,
      sidebarSpacesState,
      projects,
      spaces,
      userId,
      showProjectInSpace,
      isCondensed,
      shouldShowHiddenUI,
      enablePaginatedSpacesSidebarListing, // TODO: remove this when feature flag is no longer needed
      enableProjectsSupport, // TODO: remove this when Projects/Subspaces is fully supported,
      projectsPrototypeUIEnabled // TODO: remove this when Projects/Subspaces is fully supported,
    } = this.props

    const currentSpacesList = (isLoading || error)
      ? <SpacesLoader />
      : <SpacesList
        canCreateSpaces={canCreateSpaces}
        linkClicked={linkClicked}
        linkCount={linkCount}
        moveDocumentsToSpace={moveDocumentsToSpace}
        moveDocumentsToProject={moveDocumentsToProject}
        selected={selected}
        sortedSpaces={spaces}
        handleTrackEvent={handleTrackEvent}
        closeSidebar={closeSidebar}
        open={open}
      />

    return (
      <div className={cx(styles.root, {
        [styles.hideUi]: isCondensed && !shouldShowHiddenUI,
        [styles.spacesWidthWithoutScrollbar]: enablePaginatedSpacesSidebarListing === false
      })}>
        {error &&
          <Portal>
            <Toast
              className={styles.errorToast}
              status='danger'
              placement='top-center'
              isDismissable
              hasTimeout={false}>
              Spaces failed to load. <a className={styles.errorLink} onClick={loadSpaces}>Try again.</a>
            </Toast>
          </Portal>
        }
        {permissionsLoading || (!enablePaginatedSpacesSidebarListing && isLoading) || (enablePaginatedSpacesSidebarListing && spaces.sidebarSpaces.isLoading && spaces.sidebarSpaces.spaces.length < 1)
          ? <MySpaceHeaderSkeleton />
          : <MySpacesComponent
            canCreateSpaces={canCreateSpaces}
            showCreateSpaceModal={showCreateSpaceModal}
            handleTrackEvent={handleTrackEvent}
            numberOfSpaces={enablePaginatedSpacesSidebarListing ? spaces.sidebarSpaces.spaces.length : spaces.length}
          />
        }
        {enablePaginatedSpacesSidebarListing && (
          <PaginatedList
            enableProjectsSupport={enableProjectsSupport}
            canCreateSpaces={canCreateSpaces}
            linkClicked={linkClicked}
            moveDocumentsToSpace={moveDocumentsToSpace}
            moveDocumentsToProject={moveDocumentsToProject}
            selected={selected}
            handleTrackEvent={handleTrackEvent}
            closeSidebar={closeSidebar}
            loadProjects={loadProjects}
            loadSpaces={loadSpaces}
            projects={projects}
            sidebarSpaces={sidebarSpaces}
            sidebarSpacesState={sidebarSpacesState}
            spaces={spaces}
            userId={userId}
            showProjectInSpace={showProjectInSpace}
            showCreateProjectModal={showCreateProjectModal}
            projectsPrototypeUIEnabled={projectsPrototypeUIEnabled}
          />
        )
        }
        {((isLoading && enablePaginatedSpacesSidebarListing === false) || typeof enablePaginatedSpacesSidebarListing === 'undefined') && <div style={{ marginTop: 2 }}><SpacesLoader /></div>}
        {!isLoading && enablePaginatedSpacesSidebarListing === false && currentSpacesList}

      </div>
    )
  }
}

export default connect((state, ownProps) => ({
  spaces: ownProps.enablePaginatedSpacesSidebarListing ? state.spaces : sortSpaces(state),
  sidebarSpaces: state.spaces.sidebarSpaces,
  sidebarSpacesState: state.spaces.sidebarSpacesState,
  projects: state.projects,
  userId: state.account.user.id
}))(Spaces)
