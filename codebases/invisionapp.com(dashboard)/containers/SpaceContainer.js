import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Space from './Sidebar/Space'

import { GenerateIDURL, ParseIDURL } from '../utils/urlIDParser'
import * as AppRoutes from '../constants/AppRoutes'
import * as actionCreators from '../actions/index'
import { navigate } from '../utils/navigation'
import mapDispatchToServerAction from '../utils/mapDispatchToServerActions'
import { FILTER_ALL } from '../constants/FilterTypes'

let calledSpaceAPI = false

const { appShell } = window.inGlobalContext
appShell.getFeatureContext('home').on('before:unmount', () => {
  calledSpaceAPI = false
})

const isMember = (members, userId) => (members.findIndex(member => member.userId === userId))
class SpaceContainer extends Component {
  static getDerivedStateFromProps (props, state) {
    if (props.space && props.space.cuid === props.params.cuid) {
      return {
        redirectWithSlug: true
      }
    }

    // If the state was true but the criteria is't, we have redirected
    // the user and if we don't reset our flag it could cause an
    // infinite loop in some circumstances
    if (state.redirectWithSlug) {
      return {
        redirectWithSlug: false
      }
    }

    return null
  }

  state = {
    redirectWithSlug: false
  };

  constructor (props) {
    super(props)

    this.spaceCUID = ParseIDURL(this.props.params.cuid)
    this.projectId = this.props.params.projectId ? ParseIDURL(this.props.params.projectId) : ''
  }

  componentDidMount () {
    const { metadata, route } = this.props
    this.setViewType(route.path || '')

    if (!metadata.initialDocumentsLoaded) {
      this.props.serverActions.getInitialDocuments.request()
    }
  }

  componentDidUpdate (prevProps) {
    const { account, config, params, serverActions, spaces } = this.props

    if (this.props.route.path && (!prevProps.route.path || prevProps.route.path !== this.props.route.path)) {
      this.setViewType(this.props.route.path)
    } else if (!!prevProps.route.path && !this.props.route.path) {
      this.setViewType(AppRoutes.ROUTE_SPACE)
    }

    const discoverApiEnabled = config.pagingEnabled
    const configLoaded = !config.isLoading

    if (!discoverApiEnabled && configLoaded &&
      (prevProps.config.pagingEnabled !== discoverApiEnabled)) {
      const space = spaces.spaces.find(space => space.id === this.spaceCUID)
      if (space) {
        this.props.serverActions.getSpace.request(this.spaceCUID, isMember(space.data.members || [], config.userID) > -1)
      } else {
        this.props.serverActions.getSpace.request(this.spaceCUID, false)
      }
    }

    // TODO: Remove block when feature flag pagingEnabled is fully rolled out
    if (prevProps.params.cuid !== params.cuid || prevProps.params.projectId !== params.projectId) {
      if (account.userV2.flags.enableFreehandXFilteringSorting) {
        this.resetSelectedFilters(this.props.route.path)
      }

      this.spaceCUID = ParseIDURL(params.cuid)
      this.projectId = this.props.params.projectId ? ParseIDURL(this.props.params.projectId) : ''
      if (discoverApiEnabled) {
        serverActions.getSpaceV2.request(this.spaceCUID, true)
        serverActions.getSpaceMembersDetail.request(this.spaceCUID)
        calledSpaceAPI = true

        if (this.projectId) {
          serverActions.getProject.request(this.projectId)
        }
      } else {
        if (config.userID) {
          const space = spaces.spaces.find(space => space.id === this.spaceCUID)

          if (space) {
            serverActions.getSpace.request(this.spaceCUID, isMember(space.data.members || [], config.userID) > -1)
            calledSpaceAPI = true
          }
        }
      }
    } else if (configLoaded !== prevProps.config.isLoading && configLoaded) {
      if (!calledSpaceAPI) {
        if (discoverApiEnabled) {
          serverActions.getSpaceV2.request(this.spaceCUID, true)
          serverActions.getSpaceMembersDetail.request(this.spaceCUID)
          calledSpaceAPI = true

          if (this.projectId) {
            serverActions.getProject.request(this.projectId)
          }
        } else {
          if (config.userID) {
            const space = spaces.spaces.find(space => space.id === this.spaceCUID)
            if (space) {
              serverActions.getSpace.request(this.spaceCUID, isMember(space.data.members || [], config.userID) > -1)
              calledSpaceAPI = true
            }
          }
        }
      }
    }
  }

  componentWillUnmount () {
    this.props.actions.resetSpace()
    calledSpaceAPI = false
  }

  resetSelectedFilters = (path = '') => {
    switch (path) {
      case AppRoutes.ROUTE_SPACE_PROJECTS:
        this.props.actions.setViewType('spaceProjects', true, false)
        this.props.actions.updateFilters('isArchived', false)
        this.props.actions.updateFilters('type', FILTER_ALL)
        break
      default:
        this.props.actions.setViewType('spaceDocuments', true, false)
        this.props.actions.updateFilters('isArchived', false)
        this.props.actions.updateFilters('type', FILTER_ALL)
        break
    }
  }

  setViewType = (path = '') => {
    switch (path) {
      case AppRoutes.ROUTE_SPACE_PROJECTS:
        this.props.actions.setViewType('spaceProjects', false, false)
        break
      case AppRoutes.ROUTE_PROJECT_MY_DOCUMENTS:
        this.props.actions.setViewType('spaceDocuments', false, false)
        break
      case AppRoutes.ROUTE_PROJECT_ARCHIVED_DOCUMENTS:
        this.props.actions.setViewType('spaceDocuments', false, true)
        break
      case AppRoutes.ROUTE_PROJECT:
        this.props.actions.setViewType('spaceDocuments', true, false)
        break
      case AppRoutes.ROUTE_SPACE_MY_DOCUMENTS:
        this.props.actions.setViewType('spaceDocuments', false, false)
        break
      case AppRoutes.ROUTE_SPACE_ARCHIVED_DOCUMENTS:
        this.props.actions.setViewType('spaceDocuments', false, true)
        break
      case AppRoutes.ROUTE_SPACE:
      case AppRoutes.ROUTE_SPACE_ALL:
      default:
        this.props.actions.setViewType('spaceDocuments', true, false)
        break
    }
  }

  handleRouterLink (url) {
    navigate(url)
  }

  render () {
    const { router, space, sidebarWidth } = this.props

    if (space && this.state.redirectWithSlug) {
      router.replace(AppRoutes.ROUTE_SPACE.replace(':cuid', GenerateIDURL(space.cuid, space.title)))
      return null
    }

    return <Space
      {...this.props}
      spaceId={this.spaceCUID}
      enableArchiving={this.props.config.archivingEnabled}
      enableRhombus={this.props.config.rhombusEnabled}
      projectId={this.projectId && this.props.account.userV2.flags.spaceProjectsEnabled ? this.projectId : ''}
      studioWebEnabled={this.props.config.studioWebEnabled}
      sidebarWidth={sidebarWidth}
    />
  }
}

function mapStateToProps ({
  account,
  config,
  createModal,
  documents,
  filters,
  metadata,
  modals,
  mqs,
  project,
  selected,
  space,
  spaces,
  templateGalleryModal,
  tile
}) {
  return {
    account,
    config,
    createModal,
    documents,
    filters,
    metadata,
    modals,
    mqs,
    project,
    selected,
    space,
    spaces,
    templateGalleryModal,
    tile
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    serverActions: mapDispatchToServerAction(dispatch)
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SpaceContainer)
)
