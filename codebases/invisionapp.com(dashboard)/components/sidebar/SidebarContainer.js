import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ThemeProvider } from '@invisionapp/helios-one-web'
import useRedux from './hooks/redux'
import Sidebar from './Sidebar'
import { bpSidebarVisible, sidebarWidth, sidebarWidthCondensed, projectsSidebarWidth } from './css/vars.css'

import { CREATE_PROJECT_MODAL } from '../../constants/modal-types'
import { selectIsFreeHandOnlySeat } from '../../selectors/account'
import { isFreehandOnlyTeam } from '../../selectors/subscription'

import copyStylesToFeature from '../../utils/copy-styles-to-feature'
import { useRoute } from './hooks/useRoute'
import { isValidProjectPath, getProjectIdFromPath } from '../../utils/validate-project-url'

const SidebarRoot = props => {
  const style = props.showRoot || !props.portal
    ? { pointerEvents: '' }
    : { display: 'none', pointerEvents: 'none' }
  return <Sidebar {...props} rootHidden={!props.showRoot && !!props.portal} style={style} />
}

const SidebarPortal = props => {
  return createPortal(<Sidebar {...props} />, props.portal)
}

let MOUNT_TIMEOUT = null
let INNER_MOUNT_TIMEOUT = null

const MOUNT_TIMEOUT_TIME = 450
const INNER_MOUNT_TIMEOUT_TIME = 450

let mountedInAppShell = false
let mountedFeature = ''

let hidden

const SidebarContainer = props => {
  const { onClose, onOpen } = props
  const [state, setState] = useState({
    hidden: false,
    modalData: null,
    portal: null,
    showModal: null,
    showRoot: true,
    showSidebar: false,
    transitioning: false
  })

  const [projectSidebarId, setProjectSidebarId] = useState('')

  const reduxProps = useRedux()

  const { pathname } = useRoute()

  const { appShell } = window.inGlobalContext
  const { MOUNT } = appShell.events.COMMAND_TYPES
  const appContext = appShell.getFeatureContext('sidebar')

  useEffect(() => {
    appContext.onCommand('updateVisibility', onUpdateVisibility)
    appContext.onCommand('resetModal', onResetModal)
    appContext.onCommand('triggerModal', onTriggerModal)

    if (!mountedInAppShell) {
      appContext.resolveCommand(MOUNT)
      mountedInAppShell = true
    }
  }, [])

  useEffect(() => {
    if (!isValidProjectPath(pathname)) {
      if (projectSidebarId !== '') setProjectSidebarId('')
    } else {
      setProjectSidebarId(getProjectIdFromPath(pathname))
    }
  }, [pathname])

  useEffect(() => {
    appShell.on('before:mount', onBeforeMount)
    appShell.on('after:mount', onAfterMount)
    appShell.on('before:unmount', onUnmount)
    appContext.on('before:updateCondensedState', onUpdateCondensedState)

    return function () {
      appContext.off('before:updateCondensedState', onUpdateCondensedState)
    }
  }, [reduxProps.sidebar.isCondensed])

  const mountingAppFeatureContext = featureName => {
    const context = appShell.getFeatureContext(featureName)
    return context
  }

  const sidebarInitialVisibility = appContext => {
    if (!appContext) return 'visible'

    const globalSettings = appContext.featureConfig.globalFeatureSettings
    if (globalSettings && globalSettings.sidebar && globalSettings.sidebar.initialVisibilityState) {
      return globalSettings.sidebar.initialVisibilityState()
    } else {
      return 'visible'
    }
  }

  const onBeforeMount = ({ featureName }) => {
    mountedFeature = featureName

    const appContext = mountingAppFeatureContext(featureName)
    if (!appContext) return

    const showSidebar = appContext.hasSidebarEnabled()
    const isFeatureAtRootFrame = appContext.shouldRunAsStandaloneApp() || appContext.supportsComposition()

    if (!showSidebar) {
      setState(prevState => ({ ...prevState, showSidebar: false }))
    } else {
      let newState = {}
      // if feature is at the root frame, we do not need to
      // portal and can show the sidebar as is
      if (isFeatureAtRootFrame) {
        newState.showSidebar = true
      }

      if (sidebarInitialVisibility(appContext) === 'hidden') {
        newState.hidden = true
      }

      if (Object.keys(newState) > 0) {
        setState(prevState => ({
          ...prevState,
          ...newState
        }))
      }
    }
  }

  const onAfterMount = ({ featureName }) => {
    if (!mountedFeature || mountedFeature !== featureName) return
    let portal = null

    const appContext = mountingAppFeatureContext(featureName)
    if (!appContext) return

    const showSidebar = appContext.hasSidebarEnabled()
    const isFeatureAtRootFrame = appContext.shouldRunAsStandaloneApp() || appContext.supportsComposition()

    if (isFeatureAtRootFrame) {
      // if feature is at the root frame, we do not need to
      // portal and can show the sidebar as is
      setState(prevState => ({
        ...prevState,
        portal: null,
        showRoot: showSidebar,
        showSidebar,
        transitioning: false
      }))

      handleResize(true)

      return
    }

    if (showSidebar) {
      copyStylesToFeature(appContext.getFeatureFrameWindow())
      const sidebarRoot = appContext.getSidebarRootElement()
      if (sidebarRoot && state.portal !== sidebarRoot) {
        portal = sidebarRoot
      }
    } else {
      setState(prevProps => ({ ...prevProps, showSidebar: false }))
      return
    }

    let newState = {}
    if (state.showSidebar !== showSidebar) newState.showSidebar = showSidebar
    if (state.portal !== portal) {
      newState.portal = portal
      newState.showRoot = true
    }
    props.onAppReady()

    setState(prevState => ({ ...prevState, ...newState }))

    // Set timeout to clear out root portal
    MOUNT_TIMEOUT = setTimeout(() => {
      setState(prevState => ({ ...prevState, showRoot: false }))

      // Set a later timeout to clear the transitioning flags
      INNER_MOUNT_TIMEOUT = setTimeout(() => {
        setState(prevState => ({ ...prevState, transitioning: false }))
      }, INNER_MOUNT_TIMEOUT_TIME)
    }, MOUNT_TIMEOUT_TIME)
  }

  const onUnmount = async opts => {
    const featureName = opts.featureName || ''
    const nextAppName = opts.commandContext.nextAppFeatureName || ''

    if (mountedFeature && mountedFeature !== featureName) return

    if (MOUNT_TIMEOUT) clearTimeout(MOUNT_TIMEOUT)
    if (INNER_MOUNT_TIMEOUT) clearTimeout(INNER_MOUNT_TIMEOUT)

    const nextAppContext = mountingAppFeatureContext(nextAppName)

    if (!nextAppContext) return
    mountedFeature = ''

    const showSidebar = nextAppContext.hasSidebarEnabled()
    const portal = null

    // Find initial visibility
    const initialVisibility = sidebarInitialVisibility(nextAppContext)

    // When navigating from a feature that has sidebar to one that doesn't,
    // we want to show the sidebar in the loading screen.
    // Generally, app-shell takes care of enabling the feature artifacts (e.g. stylesheets)
    // automatically when a feature is mounted. In this case though, we need to
    // enable sidebar artifacts manually because we're still in the loading screen
    // (meaning for app-shell sidebar still hasn't been "mounted").
    // If we don't manually enable the artifacts here, sidebar will show up in
    // the loading screen without any styles, because its stylesheets would still
    // be disabled.
    if (showSidebar && initialVisibility !== 'hidden' && !appShell.getFeatureContext(featureName).hasSidebarEnabled()) {
      await appShell.getFeatureContext('sidebar').enableFeatureArtifacts()
    }

    if (showSidebar && initialVisibility !== 'hidden' && window.matchMedia(`(${bpSidebarVisible})`).matches) {
      // Move loader over
      appShell.loadingIndicator.offsetLocation(parseInt(sidebarWidth.replace('px', ''), 10) / 2)
    }

    setState(prevState => ({
      ...prevState,
      hidden: initialVisibility === 'hidden',
      portal,
      showRoot: false,
      showSidebar,
      transitioning: true
    }))
  }

  const onUpdateVisibility = ({ visibilityState }) => {
    if (visibilityState) {
      setState(prevState => ({
        ...prevState,
        hidden: visibilityState === 'hidden'
      }))
    }
  }

  const onResetModal = () => {
    setState(prevState => ({
      ...prevState,
      showModal: ''
    }))
  }

  const onTriggerModal = ({ modalName, modalData }) => {
    if (modalName && ['', CREATE_PROJECT_MODAL].indexOf(modalName) >= 0) {
      setState(prevState => ({
        ...prevState,
        showModal: modalName,
        modalData
      }))
    }
  }

  const {
    account: {
      flags: {
        enableProjectsSidebar
      }
    },
    sidebar: {
      isCondensed
    }
  } = reduxProps

  const getSidebarWidth = () => {
    let width = isCondensed ? sidebarWidthCondensed : sidebarWidth
    if (projectSidebarId !== '' && enableProjectsSidebar) {
      width = `calc(${width} + ${projectsSidebarWidth})`
    }

    return width
  }

  const onUpdateCondensedState = ({ commandContext: { condensed } }) => {
    const shouldToggle = isCondensed !== condensed
    if (shouldToggle) {
      reduxProps.actions.toggleCondensedSidebar()
    }
  }

  const handleResize = useCallback((forceUpdate = false) => {
    const shouldBeHidden = !window.matchMedia(`(${bpSidebarVisible})`).matches
    const needsUpdate = hidden !== shouldBeHidden
    hidden = shouldBeHidden

    if (!needsUpdate && forceUpdate !== true) { return }

    if (hidden) {
      onClose()
    } else {
      onOpen(getSidebarWidth())
    }
  }, [isCondensed])

  useEffect(() => {
    window.addEventListener('resize', handleResize, true)
    return () => {
      window.removeEventListener('resize', handleResize, true)
    }
  }, [handleResize])

  useEffect(() => {
    if (window.matchMedia(`(${bpSidebarVisible})`).matches) {
      onOpen(getSidebarWidth())
    }
  }, [isCondensed, projectSidebarId])

  if (!state.showSidebar) {
    return (
      <div />
    )
  }

  const allProps = {
    ...props,
    ...reduxProps,
    width: !isCondensed ? sidebarWidth : sidebarWidthCondensed,
    hidden: state.hidden,
    modalData: state.modalData,
    portal: state.portal,
    showModal: state.showModal,
    showRoot: state.showRoot,
    isFreeHandOnlySeat: selectIsFreeHandOnlySeat(reduxProps),
    isFreeHandOnlyTeam: isFreehandOnlyTeam(reduxProps),
    projectSidebarId
  }

  return (
    <ThemeProvider theme='light'>
      { state.portal && <SidebarPortal {...allProps} transitioning={state.transitioning} /> }
      <SidebarRoot {...allProps} transitioning={state.transitioning} />
    </ThemeProvider>
  )
}

export default SidebarContainer
