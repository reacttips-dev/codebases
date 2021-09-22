/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../actions/index'

import DocumentFrame from '../components/Project/DocumentFramePrototype'
import Sidebar from '../components/Project/SidebarPrototype'
import Modals from '../components/Project/ModalWrapper'

import mapDispatchToServerAction from '../utils/mapDispatchToServerActions'
import { ParseIDURL } from '../utils/urlIDParser'
import { navigate } from '../utils/navigation'
import { ROUTE_PAGES } from '../constants/AppRoutes'

import styles from '../css/project-prototype.css'

const ProjectPrototypeContainer = (props) => {
  const [selectedUrl, setSelectedUrl] = useState(ROUTE_PAGES)

  const dispatch = useDispatch()

  const [serverActions] = useState(mapDispatchToServerAction(dispatch))
  const [actions] = useState(bindActionCreators(actionCreators, dispatch))

  const filteredState = useSelector((state) => ({
    accountLoading: state.account.isLoading,
    projectsPrototypeUIEnabled: state.account.userV2.flags.projectsPrototypeUIEnabled,
    project: state.project
  }))

  const { params: { projectId } } = props
  const pid = ParseIDURL(projectId)

  useEffect(() => {
    window.inGlobalContext.appShell
      .getFeatureContext('sidebar')
      .sendCommand('updateCondensedState', { condensed: true })

    return function () {
      window.inGlobalContext.appShell
        .getFeatureContext('sidebar')
        .sendCommand('updateCondensedState', { condensed: false })
    }
  }, [])

  useEffect(() => {
    if (pid !== filteredState.project.id) {
      serverActions.getProject.request(pid)
    }
  }, [projectId])

  useEffect(() => {
    if (
      !filteredState.accountLoading &&
      !filteredState.projectsPrototypeUIEnabled) {
      navigate(`/projects/${projectId}`, { replace: true })
    }
  }, [filteredState.accountLoading])

  if (!filteredState.projectsPrototypeUIEnabled) return null

  return (
    <section className={styles.root}>
      <Sidebar
        project={filteredState.project}
        selectedUrl={selectedUrl}
        setSelectedUrl={setSelectedUrl}
        toggleDeleteModal={actions.toggleDeleteModal}
        updateProject={serverActions.updateProject.request}
      />

      <DocumentFrame selectedUrl={selectedUrl} />

      <Modals />
    </section>
  )
}

export default ProjectPrototypeContainer
