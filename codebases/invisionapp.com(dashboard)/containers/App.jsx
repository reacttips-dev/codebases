import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import { GlobalHeaderProvider } from '@invisionapp/helios/composites'
import Tour from '@invisionapp/tour-library'

import * as actionCreators from '../actions/index'
import * as serverActions from '../actions/serverActions'
import * as AppRoutes from '../constants/AppRoutes'
import { FILTER_FREEHANDS, FILTER_URL_PATHS } from '../constants/FilterTypes'
import { MOBILE_GENERAL_CHECK, MOBILE_BRAND_NAME_CHECK } from '../constants/AppStoreConstants'
import { isFreehandOnlySeat, selectUserV2Flags } from '../selectors/account'
import { isFreehandOnlyTeam, isSubscriptionLoading } from '../selectors/subscription'

import Alerts from '../components/Common/Alerts'
import MobileWarningView from '../components/Common/MobileWarningView'
import LoadingPaths from '../components/Layout/LoadingPaths'
import ErrorContainer from '../components/Modals/Error/ErrorContainer.jsx'
import { GlobalNavigation } from '../components/Common/GlobalNavigation'

import { useLoadPaywalls } from '../utils/paywalls'
import { PAYWALL_CREATE_DOCUMENT_ACTION } from '../constants/PaywallTypes'
import { trackEvent } from '../utils/analytics'
import { navigate } from '../utils/navigation'
import { getItem } from '../utils/cache'
import getCookie from '../utils/getCookie'
import generateTypeFilteredURL from '../utils/generateTypeFilteredURL'

import styles from '../css/base.css'

export const navigateToFilteredHome = (enableFreehandXFilteringSorting) => {
  let filterCookie = getCookie('inv-home-docs-filterby')
  filterCookie = filterCookie === 'All-documents' ? 'all' : filterCookie
  const filter = FILTER_URL_PATHS[filterCookie] || filterCookie

  navigate(generateTypeFilteredURL(filter, 'team', true, enableFreehandXFilteringSorting), { replace: true })
}

export class App extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    alert: PropTypes.object,
    actions: PropTypes.object,
    children: PropTypes.object,
    config: PropTypes.object,
    data: PropTypes.object,
    error: PropTypes.object,
    filters: PropTypes.object,
    params: PropTypes.object,
    project: PropTypes.object,
    route: PropTypes.object,
    serverActions: PropTypes.object,
    space: PropTypes.object,
    isFreeHandOnlySeat: PropTypes.bool,
    enableFocusedFreehand: PropTypes.bool,
    paywall: PropTypes.object,
    enableFreehandXFilteringSorting: PropTypes.bool
  }

  hasHandledMountCommand = false

  constructor (props) {
    super(props)
    this.handleGlobalNavigationChanges = this.handleGlobalNavigationChanges.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)

    this._checkIfMQsChanged = debounce(this.props.actions.checkIfMQsChanged, 100)

    this.state = {
      renderAppInAppShell: true,
      openModal: '',
      externalDocConfig: null,
      externalDocFilterEntries: null,
      getExtDocFallbackIcon: null,
      targetDocuments: {
        canChangeSpaceVisibility: false,
        documents: []
      }
    }
  }

  componentWillMount () {
    this.props.serverActions.getConfig.request()
    this.getUserAgent()
  }

  componentDidMount () {
    // ensure config is available and Pass the config into reducers that need it
    if (this.props.config.teamID) {
      this.props.actions.configLoaded(this.props.config)
    }

    this.props.actions.loadStoredSorts()

    // Request the user account
    this.props.serverActions.getAccount.request()
    this.props.serverActions.getAccountPermissions.request()

    // Load the team's subscription data
    this.props.serverActions.getSubscription.request()

    // Updates the store with the active MQs
    this.props.actions.checkIfMQsChanged()
    window.addEventListener('resize', this._checkIfMQsChanged)

    const cachedDocuments = getItem('home.metadata.initialDocuments', false)

    if (cachedDocuments !== false && window.rum) {
      window.rum.markTime('spaDataFullyLoaded', {
        featureName: 'home',
        cachedAppData: true
      })
    }

    // load integrations-ui
    const appShell = window.inGlobalContext && window.inGlobalContext.appShell
    const integrationUI = appShell.getFeatureContext('integrations-ui')
    const initExtDocLinker = window.inGlobalContext?.externals?.integrations?.initExtDocLinker

    const getExternalDocFilterEntries = (configs) => (
      configs.flatMap(filterGroup => (
        filterGroup.flatMap(subFilterGroup => (subFilterGroup.children)
          ? subFilterGroup.children.flat().map(subFilter => ({ ...subFilter, parentTitle: subFilterGroup.title })) : subFilterGroup)
      )).reduce((filterMap, filter) => {
        filterMap[filter.id] = filter
        return filterMap
      }
      , {})
    )
    if (integrationUI) {
      if (initExtDocLinker) {
        initExtDocLinker('home').then((homeExtDocLinker) => {
          this.setState({
            externalDocFilterEntries: getExternalDocFilterEntries(homeExtDocLinker.config.filterExtResourceConfigs),
            externalDocConfig: homeExtDocLinker.config,
            getExtDocFallbackIcon: homeExtDocLinker.fallbackIcon
          })
        })
      } else {
        if (integrationUI.getManifest) {
          integrationUI.getManifest()
            .then(({ namedCriticalPathFiles }) => {
              const tag = document.createElement('script')
              document.head.appendChild(tag)
              tag.src = namedCriticalPathFiles['integrations-ui-api.js']
              tag.onload = async () => {
                if (window.inGlobalContext?.externals?.integrations?.initExtDocLinker) {
                  const homeExtDocLinker = await window.inGlobalContext.externals.integrations.initExtDocLinker('home')
                  if (homeExtDocLinker?.config) {
                    this.setState({
                      externalDocFilterEntries: getExternalDocFilterEntries(homeExtDocLinker.config.filterExtResourceConfigs),
                      getExtDocFallbackIcon: homeExtDocLinker.fallbackIcon,
                      externalDocConfig: homeExtDocLinker.config
                    })
                  }
                }
              }
            }).catch(() => {
              console.error('Unable to load Integration UI')
            })
        }
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._checkIfMQsChanged)
    if (window.inGlobalContext && window.inGlobalContext.external && window.inGlobalContext.external.integrations) {
      window.inGlobalContext.external.integrations.mount.unmount()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.config !== this.props.config) {
      this.props.actions.configLoaded(this.props.config)
    }

    if (prevProps.tile.moveDocumentModal.showModal !== this.props.tile.moveDocumentModal.showModal) {
      this.handleOpenModal('MoveDocument')
    }

    if (prevProps.space.manageAccessModalOpen !== this.props.space.manageAccessModalOpen) {
      this.handleOpenModal('ManageAccess', this.props.space.manageAccessModalOpen)
    }

    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (this.props.location.pathname === '/' && window.location.pathname === '/') {
        navigateToFilteredHome(this.props.enableFreehandXFilteringSorting)
      }

      window.scrollTo(0, 0)
    }

    const isRouteableHomePath = (this.props.location.pathname === '/' || this.props.location.pathname === '/docs')
    const shouldRouteToFreehand = !this.props.account.isLoading && isRouteableHomePath && this.props.isFreeHandOnlySeat
    // Freehand-only teams should never see other document type pages
    const shouldOnlyAllowFreehandRoute = !this.props.isSubscriptionLoading &&
      this.props.location.pathname.startsWith('/docs') &&
      !this.props.location.pathname.startsWith('/docs/freehands') &&
      this.props.isFreeHandOnlyTeam

    // Freehand-only seats were introduced which require any visits '/' to deafult to filtering
    // to the freehand document list based off of the Freehand seat type
    if (this.props.enableFocusedFreehand && shouldRouteToFreehand) {
      navigate(generateTypeFilteredURL(FILTER_FREEHANDS, 'team'), {
        replace: true
      })
    } else if (shouldOnlyAllowFreehandRoute) {
      navigate(generateTypeFilteredURL(FILTER_FREEHANDS, 'team'), {
        replace: true
      })
    } else if (!this.props.account.isLoading && prevProps.account.isLoading && !this.props.account.loadFailed) {
      // Redirect if the user is at / at this point, to avoid redirect loops
      if (this.props.route.path === '/' && window.location.pathname === '/') {
        navigateToFilteredHome(this.props.enableFreehandXFilteringSorting)
      }
    }

    // Track event to trigger Pendo messaging for artifacts publishing
    const { artifactsTrayEnabled } = this.props.account.userV2.flags
    if (this.props.account.userV2 !== prevProps.account.userV2 && artifactsTrayEnabled) {
      setTimeout(() => trackEvent('App.ArtifactsPublish.FeatureFlag.Visited'), 2000)
    }
  }

  getUserAgent () {
    // Force Mobile warning page from Url.
    const forcedMobileFromUrl = window.location.search.indexOf('__mobile') > -1

    const showWarningPage = window.localStorage.getItem('mobile-warning-dimissed') !== 'true' || forcedMobileFromUrl
    const isAndroid = !!navigator.userAgent.match(/Android/i)
    const isIphone = !!navigator.userAgent.match(/iPhone/i)

    const isMobile = (function () {
      let check = false
      if (MOBILE_BRAND_NAME_CHECK.test(navigator.userAgent) || MOBILE_GENERAL_CHECK.test(navigator.userAgent.substr(0, 4))) {
        check = true
      }
      return check
    })()

    if (isMobile && (isAndroid || isIphone) && showWarningPage) {
      const osType = isAndroid ? 'android' : 'ios'
      this.props.actions.setBrowserInfo(osType, true)
    }
  }

  componentWillReceiveProps (nextProps) {
    // Logic for detectng create modal visibility changes that
    // should result in a programatic call to exit the tour if the
    // user is in the onboarding walkthrough tour.
    const { initTouringForUser } = Tour

    // detect user change
    if (this.props.account.user !== nextProps.account.user) {
      if (nextProps.account.user.userID) {
        initTouringForUser(nextProps.account.user.userID, 'home-ui')
        const zendeskChatEnabled = this.props.config.zendeskChatEnabled

        this.handleOnboardingModal()

        if (zendeskChatEnabled && zendeskChatEnabled.daysSinceConversion) {
          this.handleZendesk(this.props.config.zendeskChatEnabled.daysSinceConversion, this.props.config.teamID)
        }
      }
    }

    if ((this.props.config !== nextProps.config) && !nextProps.config.isLoading && this.props.config.isLoading) {
      this.props.actions.configLoaded(nextProps.config)
    }

    const configLoaded = !nextProps.config.isLoading
    const accountLoaded = !nextProps.account.isLoading
    const configUnauthorized = configLoaded && nextProps.config.authError
    const accountUnauthorized = accountLoaded && nextProps.account.authError

    const appShell = window.inGlobalContext && window.inGlobalContext.appShell
    const appContext = appShell.getFeatureContext('home')
    const { MOUNT } = appShell.events.COMMAND_TYPES

    if (!this.hasHandledMountCommand) {
      // if this is the first app to be loaded in the page lifecycle, it needs to
      // check for account/config info before rendering the shell. Otherwise
      // users see a flash of home then redirect.
      const hasLoadedData = configLoaded || accountLoaded
      const hadUnauthedDataResponse = configUnauthorized || accountUnauthorized
      if (appShell.user.hasAuthedSessionHint() || (hasLoadedData && !hadUnauthedDataResponse)) {
        this.hasHandledMountCommand = true
        appContext.resolveCommand(MOUNT)
        // provide the hint to app shell that the user is authenticated
        appShell.user.hasAuthedSessionHint(true)
      } else if (hasLoadedData && hadUnauthedDataResponse) {
        this.hasHandledMountCommand = true
        appContext.rejectCommand(MOUNT)
        appShell.navigate(`/auth/sign-in?redirectTo=${window.location.pathname}`)
        this.setState({ renderAppInAppShell: false })
      }
    }
  }

  handleZendesk (numberOfDaysToShowZendesk, teamID) {
    Tour.WalkthroughTour.getTourInitialState('', () => {
      const state = Tour._state.getState()
      const context = state['serverContext']
      const hasConversionData = context && context.conversion && context.conversion.data
      const hasConversionDate = hasConversionData && !!context.conversion.data.conversionDate
      const hasTeamID = hasConversionData && !!context.conversion.data.teamID

      if (hasConversionDate && hasTeamID && teamID === context.conversion.data.teamID) {
        // example date: 2020-08-19T17:20:10.644Z
        const lastDayToShowZendesk = new Date(context.conversion.data.conversionDate)

        if (isNaN(lastDayToShowZendesk.valueOf())) {
          return
        }

        const now = new Date()

        lastDayToShowZendesk.setDate(lastDayToShowZendesk.getDate() + numberOfDaysToShowZendesk)

        if (now.valueOf() <= lastDayToShowZendesk.valueOf()) {
          window.inGlobalContext.thirdPartyManager.load(
            window.inGlobalContext.thirdPartyManager.thirdParties.ZENDESK,
            {
              mountWindow: window.inGlobalContext.appShell.getFeatureContext('home').getFeatureFrameWindow(),
              labels: ['V7 Converts']
            }
          )

          // show/hide the zendesk widget when navigating away and then back to home
          // we need to do this to avoid zendesk being place above other feature UI elements
          const appShell = window.inGlobalContext && window.inGlobalContext.appShell
          if (appShell) {
            const appContext = appShell.getFeatureContext('home')
            const { MOUNT, UNMOUNT } = appShell.events.COMMAND_TYPES
            const { BEFORE, AFTER } = appShell.events.EVENT_PREFIXES

            // uses the zendesk command interface
            // https://developer.zendesk.com/embeddables/docs/widget/core

            appContext.on(`${BEFORE}:${UNMOUNT}`, () => {
              if (window.zE) {
                window.zE('webWidget', 'hide')
              }
            })

            appContext.on(`${AFTER}:${MOUNT}`, () => {
              if (window.zE) {
                window.zE('webWidget', 'show')
              }
            })
          }
        }
      }
    })
  }

  handleOnboardingModal () {
    const params = new URLSearchParams(window.location.search)
    const subview = params.get('onboardingModal')

    if (subview && (subview === 'prototypeTypes' || subview === 'createFreehand')) {
      this.props.actions.createModalOpenOnboarding(subview)
    }
  }

  handleGlobalNavigationChanges (e) {
    switch (e.type) {
      case 'SPACE_COLOR_CHANGED':
        this.props.actions.updateSpaceColor(e.data)
        break

      case 'SPACE_ACCESS_UPDATED':
        this.props.actions.updateAccessManagement({
          response: {
            data: e.data
          }
        })
        break

      case 'MODAL_CLOSED':
        if (this.state.openModal === 'MoveDocument') {
          this.props.actions.toggleMoveDocumentModal({})
        }

        if (this.state.openModal === 'ManageAccess') {
          this.setState({ openModal: '' })
        }
        break

      case 'MANAGE_ACCESS_MODAL':
        this.props.actions.openManageAccessModal(e.data.accessModalOpen)
        break

      case 'DOCUMENTS_MOVED':
        e.data.documents.forEach(doc => {
          this.props.actions.documentMoved(
            doc.documentType,
            doc.documentId,
            e.data.spaceCUID,
            e.data.spaceTitle
          )
        })

        this.props.actions.clearSelectedDocuments()
        break

      default:
    }
  }

  handleRouterLink (url) {
    navigate(url)
  }

  handleCreateSpace = async () => {
    const Paywall = this.props.paywall

    const paywallResponse = await Paywall.checkPaywall(
      PAYWALL_CREATE_DOCUMENT_ACTION
    )
    const showPaywall = !!paywallResponse.hasPaywall

    if (showPaywall) {
      Paywall.show(PAYWALL_CREATE_DOCUMENT_ACTION)
      return
    }

    this.props.actions.createModalOpen('createSpace')
  }

  handleOpenModal (type, isOpen = true) {
    const { config: { canChangeSpaceVisibility }, selected: { selected }, tile: { moveDocumentModal } } = this.props
    const { openModal } = this.state

    if (type === 'ManageAccess') {
      const openModalState = isOpen ? 'ManageAccess' : ''

      if (openModal === 'ManageAccess' && isOpen) {
        this.setState({
          openModal: ''
        }, () => {
          this.setState({
            openModal: 'ManageAccess'
          })
        })
      } else {
        this.setState({
          openModal: openModalState
        })
      }
    } else if (type === 'MoveDocument') {
      let targetDocuments = {
        canChangeSpaceVisibility,
        documents: []
      }

      if (selected.length > 0) {
        targetDocuments.documents = selected.map(sel => {
          return { ...sel }
        })
      } else {
        targetDocuments.documents.push({
          ...moveDocumentModal.document,
          id: moveDocumentModal.document.id + ''
        })
      }

      if (moveDocumentModal.showModal) {
        if (openModal !== 'MoveDocument') {
          this.setState({
            openModal: moveDocumentModal.id !== '' ? 'MoveDocument' : '',
            targetDocuments
          })
        } else {
          this.setState({
            openModal: ''
          }, () => {
            this.setState({
              openModal: moveDocumentModal.id !== '' ? 'MoveDocument' : '',
              targetDocuments
            })
          })
        }
      } else if (openModal !== '') {
        this.setState({
          openModal: ''
        })
      }
    }
  }

  getActiveURI = () => {
    const {
      ROUTE_DOCUMENTS,
      ROUTE_TEAM_SPACES,
      ROUTE_MY_DOCUMENTS,
      ROUTE_MY_SPACES,
      ROUTE_MY_CREATED_DOCUMENTS,
      ROUTE_ARCHIVED_DOCUMENTS,
      ROUTE_MY_CREATED_SPACES,
      ROUTE_PAGES
    } = AppRoutes
    const pathname = this.props.router.getCurrentLocation().pathname
    let returnPath = pathname

    if (
      pathname === '/' ||
      pathname.indexOf(ROUTE_MY_CREATED_DOCUMENTS) >= 0 ||
      pathname.indexOf(ROUTE_ARCHIVED_DOCUMENTS) >= 0 ||
      pathname.indexOf(ROUTE_MY_DOCUMENTS) >= 0 ||
      pathname.indexOf(ROUTE_DOCUMENTS) >= 0
    ) {
      returnPath = '/docs/'
    } else if (
      pathname.indexOf(ROUTE_TEAM_SPACES) >= 0 ||
      pathname.indexOf(ROUTE_MY_SPACES) >= 0 ||
      pathname.indexOf(ROUTE_MY_CREATED_SPACES) >= 0 ||
      pathname.indexOf(ROUTE_PAGES) >= 0
    ) {
      returnPath = '/spaces/'
    }

    return returnPath
  }

  render () {
    const {
      config: { showMobileWarning, osType },
      filters: { searchView },
      mqs,
      project,
      space,
      paywall
    } = this.props

    // detecting if a redirect is needed because the user is not authenticated
    // happens within the initial state system in the react app. If
    // we know we are no longer going to finish rendering the app, we intercept
    // it here an stop rendering.
    if (!this.state.renderAppInAppShell) {
      return null
    }

    const { pathname } = this.props.location
    const activeLinkURI = pathname.indexOf('/files') >= 0 ? '/' : pathname

    // Pass details of the current user space (if within a space) to the GlobalSearchUi component,
    // rendered by the GlobalNavigation. This will initialize its filter tags.
    let globalSearchUi = {
      filter: {},

      viewType: this.props.filters.viewType
    }

    // If in a space, pass along the space details to the global-search, so that it can render the
    // filter tag
    const isInSpace = this.getActiveURI().indexOf('/spaces/') !== -1
    if ((isInSpace || searchView === 'spaceDocuments') && space && space.title && space.id) {
      globalSearchUi.filter.spaces = [
        {
          id: space.id,
          title: space.title,

          // As per engage-4211, users are not allowed to remove a filter for space if within a space
          canRemove: !isInSpace
        }
      ]
    }

    const isInProject = this.getActiveURI().indexOf('/projects/') !== -1
    if ((isInProject || searchView === 'projectDocuments') && project && project.title && project.id) {
      globalSearchUi.filter.projects = [
        {
          id: project.id,
          title: project.title,
          canRemove: !isInProject
        }
      ]
    }

    // NOTE: In the new Helios GlobalHeader component, which is now used for NavRefresh, globalNav is a prop element.
    // Our current implementation of the global nav is tightly coupled with the App handlers and states, which
    // makes it makes it quite challenging to change without breaking existing modals and other elements from the
    // global header. Re-implementing is bigger than plugging global-nav in the new GlobalHeader, but we should
    // consider doing so when removing classic.

    // NOTE 2: Internally, the globalHeader highjacks the globalHeader.onChange prop, in order to determine if it should
    // remain stuck at the top, if its menus items (e.g., inbox) were clicked. Therefore, do not wrap this component when
    // passing it as a prop.
    const globalNav = <GlobalNavigation
      activeLinkURI={activeLinkURI}
      context='space'
      darkBackground={false}
      avatarColor={'dark'}
      globalNavigationWebURL='/global-navigation-web'
      hideDocumentShare
      handleRouterLink={this.handleRouterLink}
      isDocument={false}
      location='home'
      onChange={this.handleGlobalNavigationChanges}
      openModal={this.state.openModal}
      sidebarEnabled
      targetDocuments={this.state.targetDocuments}
      useReactRouter
      globalSearchUi={globalSearchUi}
    />

    return (
      <GlobalHeaderProvider>
        <Fragment>
          {!showMobileWarning
            ? <div>
              <Alerts actions={this.props.actions} alert={this.props.alert} />
              {React.cloneElement(this.props.children, {
                openModal: this.state.openModal,
                globalNav,
                space: this.props.space,
                externalDocConfig: this.state.externalDocConfig,
                externalDocFilterEntries: this.state.externalDocFilterEntries,
                getExtDocFallbackIcon: this.state.getExtDocFallbackIcon,
                isInSpace,
                isInProject,
                paywall
              })}

              { this.props.error.showModal
                ? <ErrorContainer isOpen={this.props.error.showModal} actions={this.props.actions} message={this.props.error.errorMessage} />
                : null }

              <LoadingPaths mqs={mqs} />
            </div>
            : <div className={styles.warningroot}> <MobileWarningView osType={osType} actions={this.props.actions} /> </div>
          }
        </Fragment>
      </GlobalHeaderProvider>
    )
  }
}

function Wrapper (props) {
  const { paywall, actions } = props
  const [isPaywallLoading, loadPaywalls] = useLoadPaywalls()

  useEffect(() => {
    const getPaywall = async () => {
      const response = await loadPaywalls()
      actions.setPaywall(response)
    }

    if (!isPaywallLoading && isEmpty(paywall)) {
      getPaywall()
    }

    if (paywall) {
      paywall.checkBanners('home-ui-v7')
    }
  }, [isPaywallLoading, paywall])

  return <App {...props} paywall={paywall} />
}

function mapStateToProps (state) {
  return {
    account: state.account,
    alert: state.alert,
    config: state.config,
    createModal: state.createModal,
    documents: state.documents,
    error: state.error,
    filters: state.filters,
    metadata: state.metadata,
    mqs: state.mqs,
    project: state.project,
    selected: state.selected,
    space: state.space,
    spaces: state.spaces,
    tile: state.tile,
    isFreeHandOnlySeat: isFreehandOnlySeat(state),
    isFreeHandOnlyTeam: isFreehandOnlyTeam(state),
    isSubscriptionLoading: isSubscriptionLoading(state),
    enableFocusedFreehand: selectUserV2Flags(state).enableFocusedFreehand,
    paywall: state.paywall,
    enableFreehandXFilteringSorting: selectUserV2Flags(state).enableFreehandXFilteringSorting
  }
}

function createServerActions (dispatch) {
  return Object.keys(serverActions).reduce((acc, key) => {
    acc[key] = bindActionCreators(serverActions[key], dispatch)
    return acc
  }, {})
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    serverActions: createServerActions(dispatch)
  }
}

const AppWrapper = connect(mapStateToProps, mapDispatchToProps)(Wrapper)
export default withRouter(AppWrapper)
