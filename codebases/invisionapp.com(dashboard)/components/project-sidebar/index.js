import React, { useEffect } from 'react'

import useRedux from '../sidebar/hooks/redux'

import ProjectSidebar from './ProjectSidebar'

const ProjectSidebarContainer = props => {
  const reduxProps = useRedux()

  if (!reduxProps.account.flags.enableProjectsSidebar) {
    return null
  }

  if (!props.projectId) {
    return null
  }

  useEffect(() => {
    reduxProps.actions.setCondensedState(true)

    if (reduxProps.project.id !== props.projectId) {
      reduxProps.serverActions.getProject.request(props.projectId)
    }

    return function () {
      reduxProps.actions.setCondensedState(false)
    }
  }, [
    props.projectId
  ])

  return (
    <ProjectSidebar
      actions={reduxProps.actions}
      enableProjectOverviewPages={reduxProps.account.flags.enableProjectOverviewPages}
      project={reduxProps.project}
      serverActions={reduxProps.serverActions}
      sidebarCondensed={reduxProps.sidebar.isCondensed}
      sidebarOpen={reduxProps.sidebar.open}
    />
  )
}

export default ProjectSidebarContainer
