import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as AppRoutes from '../constants/AppRoutes'

import * as actionCreators from '../actions/index'

import Space from './Sidebar/Space'

import { PROJECT_VIEWED } from '../constants/ServerURLs'
import { APP_PROJECT_VIEWED } from '../constants/TrackingEvents'
import { FILTER_ALL } from '../constants/FilterTypes'

import { ParseIDURL } from '../utils/urlIDParser'
import mapDispatchToServerAction from '../utils/mapDispatchToServerActions'
import { trackEvent } from '../utils/analytics'
import request from '../utils/API'

const ProjectContainer = (props) => {
  const dispatch = useDispatch()

  const [serverActions] = useState(mapDispatchToServerAction(dispatch))
  const [actions] = useState(bindActionCreators(actionCreators, dispatch))
  const [currentPid, setCurrentPid] = useState('')

  const filteredState = useSelector((state) => ({
    account: state.account,
    config: state.config,
    createModal: state.createModal,
    documents: state.documents,
    filters: state.filters,
    metadata: state.metadata,
    modals: state.modals,
    mqs: state.mqs,
    project: state.project,
    selected: state.selected,
    space: state.space,
    spaces: state.spaces,
    tile: state.tile
  }))

  const {
    params: {
      projectId
    }
  } = props

  const {
    account,
    config,
    metadata,
    project,
    sidebarWidth
  } = filteredState

  const setViewType = (path = '') => {
    switch (path) {
      case AppRoutes.ROUTE_PROJECT_MY_DOCUMENTS:
        actions.setViewType('projectDocuments', false, false)
        break
      case AppRoutes.ROUTE_PROJECT_ARCHIVED_DOCUMENTS:
        actions.setViewType('projectDocuments', false, true)
        break
      case AppRoutes.ROUTE_PROJECT:
        if (account.userV2.flags.enableFreehandXFilteringSorting) {
          actions.updateFilters('isArchived', false)
          actions.updateFilters('type', FILTER_ALL)
        }
        actions.setViewType('projectDocuments', true, false)
        break
      default:
        actions.setViewType('projectDocuments', true, false)
        break
    }
  }

  const pid = ParseIDURL(projectId)

  useEffect(() => {
    serverActions.getProject.request(pid)

    if (pid && !metadata.initialDocumentsLoaded) {
      serverActions.getInitialDocuments.request()
    }

    setViewType(props.route.path || '')

    if (pid && pid !== currentPid) {
      // Track view with the backend
      request(PROJECT_VIEWED.replace(':id', pid), {
        method: 'PATCH',
        headers: new global.Headers({
          'Content-Type': 'application/json'
        })
      })

      trackEvent(APP_PROJECT_VIEWED, { projectID: pid })
      setCurrentPid(pid)
    }
  }, [projectId])

  useEffect(() => {
    setViewType(props.route.path || '')
  }, [props.route.path])

  if (pid) {
    return (
      <Space
        actions={actions}
        serverActions={serverActions}
        {...props}
        {...filteredState}
        spaceId={project.spaceId}
        enableArchiving={config.archivingEnabled}
        enableRhombus={config.rhombusEnabled}
        projectId={pid && account.userV2.flags.spaceProjectsEnabled ? pid : ''}
        studioWebEnabled={config.studioWebEnabled}
        sidebarWidth={sidebarWidth}
      />)
  }

  return null
}

export default withRouter(ProjectContainer)
