import React, { Component, createRef, Fragment } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'

import { Text, Spaced, Adjacent } from '@invisionapp/helios'
import { GlobalHeader, GlobalTableStickyHeaderWrapper, GlobalHeaderContainer } from '@invisionapp/helios/composites'
import queryString from 'query-string'

import * as AppRoutes from '../../constants/AppRoutes'
import DocumentsList from '../DocumentsList'
import SpacesList from '../SpacesList'
import Filters from '../../components/Filter/Filters'
import FreehandXFilters from '../../components/Filter/FreehandXFilters'
import animatedScrollTo from '../../utils/animatedScrollTo'

import DocumentTypeFilter from '../../components/Filter/DocumentTypeFilter'
import { getAddMenuItems, getCtaGroupItems, getFabMenuItems, getTemplatesFabMenuItems } from '../../components/Common/sidebar/CreateFab'
import { trackEvent } from '../../utils/analytics'
import { PAYWALL_CREATE_DOCUMENT_ACTION } from '../../constants/PaywallTypes'
import {
  ALL_FILTER_TYPES,
  FILTER_ALL,
  FILTER_RHOMBUS,
  FILTER_HARMONY,
  FILTER_SPECS,
  FILTER_FREEHANDS,
  ALL_FREEHAND_X_FILTER_TYPES,
  CREATED_BY_FILTER_TYPE,
  FILTER_ARCHIVED_ONLY,
  FILTER_CREATED_BY_ANYONE,

  FILTER_CREATE_STATES,
  FILTER_CREATE_TITLES,
  FILTER_CREATE_TYPES
} from '../../constants/FilterTypes'
import { FREEHAND, RHOMBUS } from '../../constants/DocumentTypes'
import { navigate } from '../../utils/navigation'
import generateTypeFilteredURL from '../../utils/generateTypeFilteredURL'

import {
  DOCUMENTS_SORTS,
  PAGINATED_SPACES_SORTS,
  SPACES_SORTS
} from '../../constants/SortTypes'

import {
  APP_CREATEDIALOG_CLOSED,
  APP_HARMONY_CREATED,
  APP_HOME_CREATE_OPENED,
  APP_RHOMBUS_CREATED
} from '../../constants/TrackingEvents'

import { CREATED_BY_ME, ALL_DOCUMENTS, ARCHIVED, ALL_SPACES, DOCUMENTS, SPACES } from '../../constants/ViewNavTypes'

import styles from '../../css/home/with-sidebar.css'
class SidebarHome extends Component {
  constructor (props) {
    super(props)
    this.docList = createRef()
    this.handleCreateNewModal = this.handleCreateNewModal.bind(this)
    this.handleCreateRhombus = this.handleCreateRhombus.bind(this)
    this.handleCreateStudio = this.handleCreateStudio.bind(this)
    this.handleOpenTemplateGallery = this.handleOpenTemplateGallery.bind(this)

    this.state = {
      forceReload: 0
    }
  }

  componentDidUpdate (prevProps) {
    // If searching, update the browser url as the search input changes
    if (this.isRoute(AppRoutes.ROUTE_SEARCH) &&
      prevProps.filters && this.props.filters &&
      (
        prevProps.filters.search !== this.props.filters.search ||
        prevProps.filters.documentType !== this.props.filters.documentType ||
        prevProps.filters.searchView !== this.props.filters.searchView ||
        prevProps.filters.spaceId !== this.props.filters.spaceId ||
        prevProps.filters.projectId !== this.props.filters.projectId
      )
    ) {
      const { filters: { search, documentType, projectId, spaceId, searchView } } = this.props

      let types = ''
      if (searchView === 'spaces') {
        types = 'spaces'
      } else {
        types = documentType === FILTER_ALL ? '' : documentType.toLowerCase()
      }
      const newSearchParams = queryString.stringify({
        search,
        projectID: projectId,
        spaceID: !projectId && spaceId ? spaceId : null,
        types
      }, {
        skipNull: true,
        skipEmptyString: true
      })

      navigate(`${AppRoutes.ROUTE_SEARCH}${newSearchParams.length > 0 ? '\\?' + newSearchParams : ''}`, { replace: true })
    }
  }

  handleRouterLink (url) {
    navigate(url)
  }

  toggleArchiveModal = () => {
    this.props.actions.toggleArchiveModal({})
  }

  toggleDeleteModal = () => {
    this.props.actions.toggleDeleteModal({})
  }

  toggleMoveDocumentModal = () => {
    this.props.actions.toggleMoveDocumentModal({})
  }

  toggleCreateModal = () => {
    const action = !this.props.createModal.showModal
      ? 'createModalOpen'
      : 'createModalClose'

    if (action === 'createModalClose') {
      trackEvent(APP_CREATEDIALOG_CLOSED, { action: 'createModalClose' })
    }

    this.props.actions[action]()
  }

  async handleCreateNewModal (documentType, preventTracking) {
    const Paywall = this.props.paywall
    const paywallResponse = await Paywall.checkPaywall(
      PAYWALL_CREATE_DOCUMENT_ACTION
    )
    const showPaywall = !!paywallResponse.hasPaywall

    if (showPaywall) {
      Paywall.show(PAYWALL_CREATE_DOCUMENT_ACTION)
      return
    }

    this.props.actions.createModalOpen(documentType)

    if (preventTracking !== true) {
      this.props.actions.trackCreateClick(documentType)
    }
  }

  async handleOpenTemplateGallery () {
    this.props.actions.toggleTemplateGalleryModal()
  }

  async handleCreateRhombus () {
    const Paywall = this.props.paywall
    const paywallResponse = await Paywall.checkPaywall(
      PAYWALL_CREATE_DOCUMENT_ACTION
    )
    const showPaywall = !!paywallResponse.hasPaywall

    if (showPaywall) {
      Paywall.show(PAYWALL_CREATE_DOCUMENT_ACTION)
      return
    }

    let newProject = {}
    let event = {
      name: '',
      createdFrom:
        this.props.filters.viewType === 'documents' ? 'DocsTab' : 'Home'
    }
    newProject.title = 'Untitled'

    trackEvent(APP_RHOMBUS_CREATED, event)

    this.props.actions.trackCreateClick('createRhombus')
    this.props.serverActions.createDocument.request(RHOMBUS, newProject)
  }

  async handleCreateStudio () {
    const Paywall = this.props.paywall
    const paywallResponse = await Paywall.checkPaywall(
      PAYWALL_CREATE_DOCUMENT_ACTION
    )
    const showPaywall = !!paywallResponse.hasPaywall

    if (showPaywall) {
      Paywall.show(PAYWALL_CREATE_DOCUMENT_ACTION)
      return
    }

    let event = {
      name: '',
      createdFrom:
        this.props.filters.viewType === 'documents' ? 'DocsTab' : 'Home'
    }

    trackEvent(APP_HARMONY_CREATED, event)

    this.props.actions.trackCreateClick('createHarmony')
    // Let the Studio app handle new document creation for now
    navigate('/studio/new')
  }

  filterByType = (type, isExternalDocFilterPath) => {
    const gotoURL = generateTypeFilteredURL(type, this.props.filters.viewFilter, isExternalDocFilterPath)

    // Set cookie for this view
    document.cookie = `inv-home-docs-filterby=${type};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`

    if (gotoURL) navigate(gotoURL)
  }

  filterByFreehandXType = (type) => {
    if (type === FILTER_ARCHIVED_ONLY) {
      this.props.actions.updateFilters('isArchived', true)
      this.props.actions.updateFilters('type', FILTER_ALL)
    } else {
      this.props.actions.updateFilters('isArchived', false)
      this.props.actions.updateFilters('type', type)
    }
  }

  setFreehandXViewType = type => {
    const isTeam = type === FILTER_CREATED_BY_ANYONE
    this.props.actions.setViewType(this.props.filters.viewType, isTeam, false)
  }

  searchDocuments = (value) => {
    this.props.actions.updateFilters('searchTerm', value)
  }

  searchSpaces = (value) => {
    this.props.actions.updateFilters('searchTerm', value)
  }

  setDocumentsSort = sort => {
    this.props.actions.updateFilters('documentsSort', sort)
  }

  setSpacesSort = sort => {
    this.props.actions.updateFilters('spacesSort', sort)
  }

  setSearchView = value => {
    this.props.actions.updateFilters('searchView', value)
  }

  trackFABOpenEvent = viewType => {
    trackEvent(APP_HOME_CREATE_OPENED, {
      createContext: viewType,
      entryPoint: 'fab'
    })
  }

  scrollToFilterTop = () => {
    if (this.docList.current) {
      const docsListTop = this.docList.current.getBoundingClientRect().top - 177

      // ensure that the user has scrolled past the docs list, otherwise we don't scroll them
      if (docsListTop < 0) {
        animatedScrollTo(window.scrollY + docsListTop, 350)
      }
    }
  }

  getFreehandXFilterProps = () => {
    const {
      config: {
        pagingEnabled,
        searchEnabled
      },
      documents,
      filters: {
        documentsSort,
        documentType,
        isArchived,
        searchView,
        showFilters,
        viewFilter,
        viewType
      }
    } = this.props

    if (viewType === 'search') {
      const isDocumentsSearch = searchView === 'documents' ||
        searchView === 'spaceDocuments' ||
        searchView === 'projectDocuments'

      return {
        selected: {
          type: documentType
        },
        isSearch: true,
        viewType: viewType,

        // Filters are not currently supported for spaces list search
        showFilters: searchEnabled && showFilters && isDocumentsSearch,
        filterTypes: ALL_FREEHAND_X_FILTER_TYPES,
        onFilterType: this.handleSearchFilterClick,

        // Sorting is currently not supported for search
        sortTypes: []
      }
    }

    return {
      showFilters: pagingEnabled ? showFilters : documents.documents.length > 0 || documents.viewFilter === 'archive',
      filterTypes: ALL_FREEHAND_X_FILTER_TYPES,
      onFilterType: this.filterByFreehandXType,
      createdByTypes: CREATED_BY_FILTER_TYPE,
      onCreatedByChange: this.setFreehandXViewType,
      sortTypes: DOCUMENTS_SORTS,
      onSortChange: this.setDocumentsSort,
      selected: {
        type: isArchived ? FILTER_ARCHIVED_ONLY : documentType,
        createdByType: viewFilter,
        sortType: documentsSort
      },
      viewType: viewType
    }
  }

  getFilterProps = () => {
    const { config: { pagingEnabled, searchEnabled, enableSpacesIndexPagination }, documents, spaces, filters: { documentsSort, showFilters, spacesSort, viewType, documentType, searchView } } = this.props

    if (viewType === 'search') {
      const isDocumentsSearch = searchView === 'documents' ||
        searchView === 'spaceDocuments' ||
        searchView === 'projectDocuments'

      return {
        selected: {
          type: documentType
        },

        // Filters are not currently supported for spaces list search
        showFilters: searchEnabled && showFilters && isDocumentsSearch,
        filterTypes: ALL_FILTER_TYPES,
        onFilterType: this.handleSearchFilterClick,

        // Sorting is currently not supported for search
        sortTypes: []
      }
    } else if (viewType === 'spaces') {
      const showFilters = enableSpacesIndexPagination
        ? (spaces.spacesResource.isLoading || spaces.spacesResource.spaces.length > 0)
        : (spaces.spaces.length > 0)

      return {
        onSearch: this.searchSpaces,
        onSortChange: this.setSpacesSort,
        searchPlaceholder: 'Search spaces',
        selected: {
          sortType: spacesSort
        },
        showFilters,
        sortTypes: enableSpacesIndexPagination ? PAGINATED_SPACES_SORTS : SPACES_SORTS
      }
    }

    return {
      onSearch: this.searchDocuments,
      searchPlaceholder: 'Search documents',
      selected: {
        sortType: documentsSort,
        type: documentType
      },
      showFilters: pagingEnabled ? showFilters : documents.documents.length > 0 || documents.viewFilter === 'archive',
      filterTypes: viewType === 'documents' ? [] : ALL_FILTER_TYPES,
      onFilterType: this.filterByType,
      onSortChange: this.setDocumentsSort,
      sortTypes: DOCUMENTS_SORTS
    }
  }

  isRoute = needle => {
    const { location: { pathname } } = this.props
    return pathname === needle || pathname === needle + '/'
  }

  getFilesNavItems = () => {
    const { config: { pagingEnabled }, loading, documents, filters: { documentType, viewType, viewFilter } } = this.props

    // engage-3945 - show archived if there are archived docs regardless the user role
    const archivedDocsInSpace = documents.archivedDocuments
    const enableArchiving = archivedDocsInSpace.length > 0

    const items = [
      {
        element: Link,
        to: generateTypeFilteredURL(documentType, 'team', this.props.isExternalDocType),
        label: ALL_DOCUMENTS,
        active: this.isRoute(AppRoutes.ROUTE_DOCUMENTS) || viewFilter === 'team',
        className: cx(styles.navItem, { [styles.active]: this.isRoute(AppRoutes.ROUTE_DOCUMENTS) || viewFilter === 'team' })
      },
      {
        element: Link,
        to: generateTypeFilteredURL(documentType, 'user', this.props.isExternalDocType),
        label: CREATED_BY_ME,
        active: this.isRoute(AppRoutes.ROUTE_MY_CREATED_DOCUMENTS) || viewFilter === 'user',
        className: cx(styles.navItem, { [styles.active]: this.isRoute(AppRoutes.ROUTE_MY_CREATED_DOCUMENTS) || viewFilter === 'user' })
      }
    ]
    if (pagingEnabled || (!loading && viewType === 'documents' && enableArchiving)) {
      items.push({
        element: Link,
        to: generateTypeFilteredURL(documentType, 'archive', this.props.isExternalDocType),
        label: ARCHIVED,
        active: this.isRoute(AppRoutes.ROUTE_ARCHIVED_DOCUMENTS) || viewFilter === 'archive',
        className: cx(styles.navItem, { [styles.active]: this.isRoute(AppRoutes.ROUTE_ARCHIVED_DOCUMENTS) })
      })
    }
    return items
  }

  getSpacesNavItems = () => {
    const { filters: { viewFilter } } = this.props
    return [
      {
        element: Link,
        to: AppRoutes.ROUTE_TEAM_SPACES,
        label: ALL_SPACES,
        active: this.isRoute(AppRoutes.ROUTE_TEAM_SPACES) || viewFilter === 'team',
        className: cx(styles.navItem, { [styles.active]: this.isRoute(AppRoutes.ROUTE_TEAM_SPACES) || viewFilter === 'team' })
      },
      {
        element: Link,
        to: AppRoutes.ROUTE_MY_CREATED_SPACES,
        label: CREATED_BY_ME,
        active: this.isRoute(AppRoutes.ROUTE_MY_CREATED_SPACES) || viewFilter === 'user',
        className: cx(styles.navItem, { [styles.active]: this.isRoute(AppRoutes.ROUTE_MY_CREATED_SPACES) || viewFilter === 'user' })
      }
    ]
  }

  getGlobalSearchNavItems = () => {
    const { filters: { searchView } } = this.props
    const isSpacesSearch = searchView === 'spaces'
    const isDocumentsSearch = searchView === 'documents'

    return [
      {
        element: 'div',
        label: DOCUMENTS,
        active: isDocumentsSearch,
        className: cx(styles.navItem, { [styles.active]: isDocumentsSearch }),
        onClick: () => { this.setSearchView('documents') }
      },
      {
        element: 'div',
        label: SPACES,
        active: isSpacesSearch,
        className: cx(styles.navItem, { [styles.active]: isSpacesSearch }),
        onClick: () => { this.setSearchView('spaces') }
      }
    ]
  }

  handleSearchFilterClick = (type) => {
    if (!type) {
      return
    }

    this.props.actions.updateFilters('type', type)
  }

  getGlobalSearchPageTitle () {
    const { filters: { search, searchView }, project, space } = this.props
    let searchScope
    switch (searchView) {
      case 'spaces':
        searchScope = 'spaces'
        break

      case 'projectDocuments':
        searchScope = project && project.title ? project.title : ''
        break

      case 'spaceDocuments':
        searchScope = space && space.title ? space.title : ''
        break

      default:
        searchScope = 'Documents'
    }

    return (
      <div test-qa='global-search-page-title'>
        <Text order='title'>Search results</Text>
        <Text className={styles.searchPageSubtitle} order='body'>
          <Adjacent>
            Results for
            <Spaced left='xxs'>
              <b>{search}</b>
            </Spaced>
            {
              searchScope && (
                <Fragment>
                  <Spaced horizontal='xxs'>
                    in
                  </Spaced>
                  <b>{searchScope}</b>
                </Fragment>
              )
            }
          </Adjacent>
        </Text>
      </div>
    )
  }

  getFiltersToRender (filterProps) {
    const {
      enableFreehandXFilteringSorting,
      externalDocConfig,
      externalDocFilterEntries,
      config: {
        isLoading: configIsLoading,
        enableSpacesIndexPagination,
        rhombusEnabled,
        specsEnabled,
        pagingEnabled
      },
      filters: {
        viewType,
        search
      },
      mqs,
      studioWebEnabled
    } = this.props

    if (enableFreehandXFilteringSorting && viewType !== 'spaces') {
      const freehandXFilterProps = this.getFreehandXFilterProps()

      return (
        <>
          <FreehandXFilters
            align={pagingEnabled ||
              (enableSpacesIndexPagination && !pagingEnabled && viewType === 'spaces') ||
              viewType === 'search' ? 'left' : 'right'
            }
            alignSort='right'
            analyticsSetContext={this.props.actions.analyticsSetContext}
            externalDocConfig={externalDocConfig}
            externalDocFilterEntries={externalDocFilterEntries}
            mqs={mqs}
            page={viewType === 'spaces' ? 'spaces' : 'documents'}
            path={this.props.route && this.props.route.path ? this.props.route.path : '/'}
            scrollToFilterTop={this.scrollToFilterTop}
            viewType={viewType}
            {...freehandXFilterProps}
          />
        </>
      )
    } else {
      return (
        <Filters
          align={pagingEnabled ||
            (enableSpacesIndexPagination && !pagingEnabled && viewType === 'spaces') ||
            viewType === 'search' ? 'left' : 'right'
          }
          analyticsSetContext={this.props.actions.analyticsSetContext}
          enableRhombus={rhombusEnabled}
          enableSpecs={specsEnabled}
          scrollToFilterTop={this.scrollToFilterTop}
          searchTerm={search}
          studioWebEnabled={studioWebEnabled}
          path={this.props.route && this.props.route.path ? this.props.route.path : '/'}
          mqs={mqs}
          page={viewType === 'spaces' ? 'spaces' : 'documents'}

          // We should show the legacy search if pagination is off
          // BUT we should never show it in the search results page.
          showSearch={!configIsLoading &&
            ((viewType !== 'spaces' && viewType !== 'search' && !pagingEnabled) ||
            (!pagingEnabled && !enableSpacesIndexPagination && (viewType !== 'search')))
          }
          externalDocFilterEntries={externalDocFilterEntries}
          externalDocConfig={externalDocConfig}
          {...filterProps}
        />
      )
    }
  }

  render () {
    const {
      enableRhombus,
      documents,
      externalDocConfig,
      externalDocFilterEntries,
      config: {
        specsEnabled,
        searchEnabled,
        specsGaRelease
      },
      account: {
        permissions: {
          create: createPermissions
        },
        user: {
          permissions: { createDocuments, createSpaces }
        }
      },
      filters: {
        documentType,
        viewType,
        searchView,
        isArchived
      },
      route: {
        path
      },
      sidebarWidth,
      studioWebEnabled,
      enableFreehandXFilteringSorting
    } = this.props

    const filterProps = this.getFilterProps()

    let ListComponent, filterItems, globalHeaderMenuItems, globalHeaderCtaOnClick, showCtaButton, addDocumentMenuItems, ctaGroupItems
    let pageTitle = <div style={{ color: 'red !important' }}>{documentType}</div>
    let ctaTitle = 'Create'

    const isTypeEnabled = (type) => {
      switch (type) {
        case FILTER_RHOMBUS:
          return enableRhombus
        case FILTER_HARMONY:
          return studioWebEnabled
        case FILTER_SPECS:
          return specsEnabled
        default:
          return true
      }
    }

    const isFreehandOnly = this.props.isFreeHandOnlySeat || this.props.isFreeHandOnlyTeam

    // Note: this container renders both the spaces lis, the main documents list and the search results
    // The content of the page therefore dynamically changes, according to the current view.
    // With the new GlobalHeader this gets dirty, as the CTA button either triggers a
    // context modal, or triggers an action. Hence, some of its props, such as the ctaItems are
    // set as null for Documents, but as an array of items for spaces.
    if (searchEnabled && viewType === 'search') {
      ListComponent = DocumentsList
      filterItems = searchView !== 'spaceDocuments' && searchView !== 'projectDocuments' && this.getGlobalSearchNavItems() // Tabs are not shown when searching for docs within a space
      globalHeaderMenuItems = []
      showCtaButton = false
      pageTitle = this.getGlobalSearchPageTitle()
      ctaGroupItems = []
    } else if (viewType === 'spaces') {
      ListComponent = SpacesList
      pageTitle = 'Spaces'
      filterItems = this.getSpacesNavItems()
      globalHeaderCtaOnClick = createSpaces ? () => {
        this.handleCreateNewModal('createSpace')
      } : () => null
      globalHeaderMenuItems = []
      showCtaButton = createSpaces
      ctaGroupItems = []
    } else {
      const headerTypes = ALL_FILTER_TYPES.filter(isTypeEnabled)
      ListComponent = DocumentsList
      pageTitle = !path || path === '/' ? null : <DocumentTypeFilter
        onChange={this.filterByType}
        selectedType={documentType}
        types={headerTypes}
        externalTypesConfig={externalDocConfig}
        externalDocFilterEntries={externalDocFilterEntries}
        enableFreehandXFilteringSorting={enableFreehandXFilteringSorting}
        isArchived={isArchived}
      />
      filterItems = this.getFilesNavItems()
      globalHeaderCtaOnClick = () => {
        if (documentType !== FILTER_ALL && FILTER_CREATE_STATES[documentType]) {
          if (documentType === FILTER_HARMONY) {
            this.handleCreateStudio()
          } else {
            this.handleCreateNewModal(FILTER_CREATE_STATES[documentType])
          }
        } else {
          this.trackFABOpenEvent(viewType)
        }
      }

      // freehand template menu used if enableFreehandXFilteringSorting feature flag enabled and has create permission
      const getFabMenuFn = enableFreehandXFilteringSorting && createPermissions[FREEHAND] ? getTemplatesFabMenuItems : getFabMenuItems
      globalHeaderMenuItems = documentType !== FILTER_ALL && isFreehandOnly && !enableFreehandXFilteringSorting ? [] : getFabMenuFn({
        createPermissions,
        createSpaces,
        handleCreateNewModal: this.handleCreateNewModal,
        handleCreateRhombus: this.handleCreateRhombus,
        handleCreateStudio: this.handleCreateStudio,
        handleOpenTemplateGallery: this.handleOpenTemplateGallery,
        isInSpace: this.props.isInSpace,
        isInProject: this.props.isInProject,
        rhombusEnabled: enableRhombus,
        specsEnabled,
        specsGaRelease,
        studioWebEnabled
      })

      addDocumentMenuItems = getAddMenuItems({
        filterType: documentType,

        showAddExternalDoc: false, // set to false to before getting a better design approach for the add button on external types
        // do now show the option to add existing invision documents in /documents
        skipAddInvisionDocument: true,
        handleAddInvisionDocument: null,
        externalDocConfig: externalDocConfig?.addExtResourceConfigs,
        handleAddExternalDocType: (externalDocAddAction) => async () => {
          try {
            const externalDoc = await externalDocAddAction()
            if (externalDoc) {
              this.setState({ forceReload: this.state.forceReload + 1 })
            }
          } catch (error) {
            console.error(`Adding External Document failed - ${error}`)
          }
        },
        enableFreehandXFilteringSorting: enableFreehandXFilteringSorting
      })
      showCtaButton =
        documentType !== FILTER_ALL &&
        FILTER_CREATE_STATES[documentType] &&
        createPermissions[FILTER_CREATE_TYPES[documentType]] &&
        isTypeEnabled(documentType)
      if (documentType !== FILTER_ALL && FILTER_CREATE_TITLES[documentType]) {
        ctaTitle = FILTER_CREATE_TITLES[documentType]
      }

      // Freehand-only seats have a specific experience. In this case, since they can only
      // create freehands, this code overrides all the logic to only allow that.
      if (isFreehandOnly && !enableFreehandXFilteringSorting) {
        globalHeaderMenuItems = []
        ctaTitle = FILTER_CREATE_TITLES[FILTER_FREEHANDS]
        showCtaButton = true
        globalHeaderCtaOnClick = () => {
          this.handleCreateNewModal(FILTER_CREATE_STATES[FILTER_FREEHANDS])
        }
      }

      if (this.props.isFreeHandOnlyTeam && !enableFreehandXFilteringSorting) {
        pageTitle = <DocumentTypeFilter canChange={false} selectedType='Freehands' />
      }

      ctaGroupItems = getCtaGroupItems({
        createDocumentMenuItems: createDocuments || createSpaces ? globalHeaderMenuItems : [],
        addDocumentMenuItems,
        addDocumentMenuClassName: styles.ctaAddMenu,
        freehandOnly: isFreehandOnly ? {
          onClick: () => this.handleCreateNewModal(FILTER_CREATE_STATES[FILTER_FREEHANDS])
        } : false
      })
    }

    return (
      <div className={cx(
        styles.globalHeaderWrap,
        styles.withGreyBackground,
        {
          [styles[FILTER_FREEHANDS.toLowerCase()]]: this.props.isFreeHandOnlySeat,
          [styles[documentType.toLowerCase()]]:
            viewType === 'documents' &&
            documentType !== FILTER_ALL,
          // Forces styling to use the freehand brandh color
          [styles.paddedHeader]: viewType === 'documents'
        }
      )}>
        <GlobalHeader
          disableNav={enableFreehandXFilteringSorting && viewType === 'documents'}
          globalNav={this.props.globalNav}
          title={pageTitle}
          items={(enableFreehandXFilteringSorting && viewType === 'documents') ? [] : filterItems}
          ctaLabel={showCtaButton ? ctaTitle : null}
          ctaOnClick={globalHeaderCtaOnClick}
          ctaGroupItems={ctaGroupItems}
          selectableTitle={viewType === 'documents'}
          forceExpandedGlobalNav
        />
        <GlobalHeaderContainer>
          {filterProps.showFilters && (
            <GlobalTableStickyHeaderWrapper
              alignWithCTA={enableFreehandXFilteringSorting && viewType === 'documents'}
              hasCustomChildren>
              {this.getFiltersToRender(filterProps)}
            </GlobalTableStickyHeaderWrapper>
          )}
          <div className={styles.docList} ref={this.docList}>
            <ListComponent
              {...this.props}
              documentCount={documents.documents.length}
              handleCreateNewModal={this.handleCreateNewModal}
              sidebarWidth={sidebarWidth}
              hasTopBorder={filterProps.showFilters}
              forceReload={this.state.forceReload}
            />
          </div>
        </GlobalHeaderContainer>
      </div>
    )
  }
}

export default SidebarHome
