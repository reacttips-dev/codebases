import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { ROUTE_HOME } from '../constants/AppRoutes'
import { DEFAULT_FILTER_TYPE, FILTER_PATHS } from '../constants/FilterTypes'
import { isFreehandOnlySeat } from '../selectors/account'
import { isFreehandOnlyTeam } from '../selectors/subscription'

import * as actionCreators from '../actions/index'
import setViewTypeFromPath from '../utils/setViewTypeFromPath'
import mapDispatchToServerAction from '../utils/mapDispatchToServerActions'

import setFilterFromPath from '../utils/setFilterFromPath'

import Home from './Home'

export class HomeContainer extends React.Component {
  constructor (props) {
    super(props)

    this.setViewType = this.setViewType.bind(this)
    this.state = {
      isExternalDocType: false,
      docType: 'all'
    }
  }

  componentDidMount () {
    this.setViewType(this.props.route.path || '')

    this.setDocumentTitle(this.props.filters.viewType)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.shouldSetViewType(prevProps, this.props)) {
      this.setViewType(this.props.route.path)
    } else if (!!prevProps.route.path && !this.props.route.path) {
      this.setViewType(ROUTE_HOME)
    }

    if (this.props.config.defaultTabNavigation !== prevProps.config.defaultTabNavigation) {
      this.setViewType(this.props.route.path)
    }

    if (prevProps.filters.viewType !== this.props.filters.viewType) {
      this.setDocumentTitle(this.props.filters.viewType)
    }

    if (prevProps.account.userV2 !== this.props.account.userV2) {
      this.setViewType(this.props.route.path)
    }

    const typeRegex = /\/docs\/((?!created-by-me|archived|all)((\w)*-)*(\w)+)(?:|\/|\/created-by-me|\/archived)?\/?$/i
    const typeParser = window.location.pathname.match(typeRegex)
    const docType = typeParser?.[1] || 'all'
    const isExternalDocType = typeof FILTER_PATHS[docType] === 'undefined'
    if (
      !this.props.account.isLoading &&
      this.props.route.path && this.props.route.path !== '/' &&
      !this.props.metadata.initialDocumentsLoaded &&
      (this.props.externalDocFilterEntries || !isExternalDocType)) {
      this.setState({ isExternalDocType, docType })
      this.props.serverActions.getInitialDocuments.request(
        this.props.externalDocFilterEntries,
        isExternalDocType,
        docType,
        this.props.enableFreehandXFilteringSorting
      )
    }

    if (
      this.props.route.path && this.props.route.path !== '/' &&
      this.props.metadata.initialDocumentsLoaded &&
      prevState.docType !== docType &&
      prevState.isExternalDocType !== isExternalDocType) {
      this.setState({ isExternalDocType, docType })
    }
  }

  shouldSetViewType (prevProps, props) {
    if (props.route.path && props.route.path !== '') {
      if (!prevProps.route.path || prevProps.route.path !== props.route.path) {
        return true
      }
    }

    if (props.routeParams.type) {
      if (!prevProps.routeParams.type || prevProps.routeParams.type !== props.routeParams.type) {
        return true
      }
    }

    return false
  }

  setViewTypePayload = (path) => {
    return setViewTypeFromPath(path)
  }

  setDocumentTitle (viewType) {
    if (viewType === 'search') {
      document.title = 'Search results - InVision'
    } else {
      document.title = viewType === 'spaces' ? 'Spaces - InVision' : 'Documents - InVision'
    }
  }

  setViewType = path => {
    const payload = this.setViewTypePayload(path)
    const { viewType, isTeam, isArchived } = payload

    const analyticsContext = {
      homeView: window.location.pathname,
      page: 0,
      sidebarEnabled: true
    }

    this.props.actions.analyticsSetContext(analyticsContext)
    this.props.actions.pageOpened(analyticsContext)
    this.props.actions.setViewType(viewType, isTeam, isArchived)

    if (this.props.routeParams && this.props.routeParams.type && !this.props.enableFreehandXFilteringSorting) {
      this.props.actions.updateFilters('type', setFilterFromPath(this.props.routeParams.type))
    } else {
      this.props.actions.updateFilters('type', DEFAULT_FILTER_TYPE)
    }
  }

  render () {
    return (
      <Home
        config={this.props.config}
        enableArchiving={this.props.config.archivingEnabled}
        enableRhombus={this.props.config.rhombusEnabled}
        space={this.props.space}
        studioWebEnabled={this.props.config.studioWebEnabled}
        enableSpaces
        isExternalDocType={this.state.isExternalDocType}
        docType={this.state.docType}
        {...this.props}
        {...this.state}
      />
    )
  }
}

HomeContainer.propTypes = {
  actions: PropTypes.object,
  data: PropTypes.object,
  route: PropTypes.object,
  serverActions: PropTypes.object
}

function mapStateToProps (state) {
  return {
    account: state.account,
    createModal: state.createModal,
    templateGalleryModal: state.templateGalleryModal,
    documents: state.documents,
    metadata: state.metadata,
    recents: state.recents,
    project: state.project,
    selected: state.selected,
    spaces: state.spaces,
    tile: state.tile,
    config: state.config,
    filters: state.filters,
    mqs: state.mqs,
    isFreeHandOnlySeat: isFreehandOnlySeat(state),
    isFreeHandOnlyTeam: isFreehandOnlyTeam(state),
    enableFreehandXFilteringSorting: state.account.userV2.flags.enableFreehandXFilteringSorting
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    serverActions: mapDispatchToServerAction(dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeContainer))
