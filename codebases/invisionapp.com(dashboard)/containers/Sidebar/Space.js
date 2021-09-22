import React, { createRef, PureComponent } from 'react'
import { Link } from 'react-router'
import { connect, Provider } from 'react-redux'
import cx from 'classnames'
import ProjectHeader from '../../components/SpaceView/ProjectHeader'
import ProjectsGrid from '../../components/Space/ProjectsGrid'
import SpaceHeader from '../../components/SpaceView/Header'
import Filters from '../../components/Filter/Filters'
import FreehandXFilters from '../../components/Filter/FreehandXFilters'
import DocumentsList from '../DocumentsList'
import ArchiveContainer from '../../components/Modals/Archive/ArchiveContainer'
import CreateModalContainer from '../../components/Modals/Create/CreateModalContainer'
import DeleteContainer from '../../components/Modals/Delete/DeleteContainer'
import ModalPortal from '../../components/Modals/ModalPortal'
import BatchAddModalLegacy from '../../components/Modals/BatchAdd/_legacy'
import BatchAddModal from '../../components/Modals/BatchAdd'
import MigratedDocsModal from '../../components/Modals/MigratedDocs'
import MultiSelect from '../../components/MultiSelect/MultiSelect'
import LegacyMultiSelect from '../../components/MultiSelect/_legacy/MultiSelect'

import { APP_SPACE_VIEWED, APP_HOME_CREATE_OPENED, APP_RHOMBUS_CREATED, APP_HARMONY_CREATED } from '../../constants/TrackingEvents'
import { MODAL_MIGRATED_DOCS } from '../../constants/ModalTypes'
import { spaceHasArchivedDocuments } from '../../selectors/documents'
import animatedScrollTo from '../../utils/animatedScrollTo'
import { trackEvent } from '../../utils/analytics'
import { getTemplatesFabMenuItems, getCtaGroupItems, getAddMenuItems, getFabMenuItems } from '../../components/Common/sidebar/CreateFab'

import * as AppRoutes from '../../constants/AppRoutes'
import {
  PAYWALL_CREATE_DOCUMENT_ACTION
} from '../../constants/PaywallTypes'
import {
  ALL_FILTER_TYPES,
  FILTER_ALL,
  FILTER_FREEHANDS,
  FILTER_CREATE_STATES,
  FILTER_ARCHIVED_ONLY,
  ALL_FREEHAND_X_FILTER_TYPES,
  CREATED_BY_FILTER_TYPE,
  FILTER_CREATED_BY_ANYONE
} from '../../constants/FilterTypes'
import { DOCUMENTS_SORTS } from '../../constants/SortTypes'
import { FREEHAND, RHOMBUS } from '../../constants/DocumentTypes'
import { spaceData } from '../../selectors/space'
import { isFreehandOnlySeat } from '../../selectors/account'
import { isFreehandOnlyTeam, isSubscriptionLoading } from '../../selectors/subscription'
import { GenerateIDURL } from '../../utils/urlIDParser'
import { mapSidebarPathname } from '../../utils/mapPaths'
import { navigate } from '../../utils/navigation'

import { storeRef } from '../../store/store'

import styles from '../../css/home/with-sidebar.css'
import { GlobalHeader, GlobalTableStickyHeaderWrapper, GlobalHeaderContainer } from '@invisionapp/helios/composites'
import { ALL_DOCUMENTS, CREATED_BY_ME, SPACE_DOCUMENTS, DOCUMENTS, PROJECTS, ARCHIVED } from '../../constants/ViewNavTypes'

import TemplateGallery from '../../components/Modals/TemplateGallery'

let reloadTimeout
let viewedEvent = ''

class Space extends PureComponent {
  static defaultProps = {
    account: {
      user: {
        permissions: {
          createDocuments: false,
          createSpaces: false
        }
      }
    },
    showArchivedTab: false
  }

  constructor (props) {
    super(props)
    this.docList = createRef()
    this.handleCreateNewModal = this.handleCreateNewModal.bind(this)
    this.handleCreateRhombus = this.handleCreateRhombus.bind(this)
    this.handleCreateStudio = this.handleCreateStudio.bind(this)
    this.handleOpenTemplateGallery = this.handleOpenTemplateGallery.bind(this)
    this.onSelectTemplate = this.onSelectTemplate.bind(this)
  }

  componentDidMount () {
    this.props.actions.resetFilters()

    if (!this.props.space.isLoading) {
      this.trackSpaceViewed(this.props.space)
      this.props.serverActions.getProjects.request(this.props.space.id, 1, false)
    }

    if (!this.props.config.pagingEnabled) {
      this.props.serverActions.getSpace.request(this.props.spaceId, true)
    }
  }

  componentWillUpdate (nextProps) {
    if (
      (this.props.space.isLoading && !nextProps.space.isLoading) ||
      (this.props.space.id !== nextProps.space.id) ||
      (this.props.filters.viewFilter !== nextProps.filters.viewFilter) ||
      (this.props.filters.viewType !== nextProps.filters.viewType)
    ) {
      this.trackSpaceViewed(nextProps.space)

      // NOTE - right now this is just checking to show the projects tab
      // by fetching a single space.  There will be a followup to preload
      // the first 50 projects found to prepopulate the grid, but that will
      // be for when this is past the internal stage.
      if (!this.props.projectId) {
        this.props.serverActions.getProjects.request(nextProps.space.id, 1, false)
      }
    }

    if (
      !nextProps.projectId &&
      nextProps.space.hasProjects &&
      nextProps.route.path === AppRoutes.ROUTE_SPACE &&
      nextProps.account.userV2.flags.spaceProjectsEnabled
    ) {
      // If the user is on the main space route and they do have projects, we should
      // redirect them to the Projects tab.
      navigate(AppRoutes.ROUTE_SPACE_PROJECTS.replace(':cuid', nextProps.routeParams.cuid))
    }

    if (nextProps.space.forceReload && !this.props.forceReload && reloadTimeout) {
      reloadTimeout = setTimeout(() => {
        if (this.props.config.pagingEnabled) {
          this.props.serverActions.getSpaceV2.request(this.props.space.id, true)
        } else {
          this.props.serverActions.getSpace.request(this.props.space.id, true)
        }
        reloadTimeout = null
      }, 250)
    }
  }

  onSelectTemplate (template) {
    if (!template) {
      this.props.actions.toggleTemplateGalleryModal({})
    } else {
      const newFHBaseURI = '/freehand/new'
      const projectId = `${this.props.project.id ? `&projectId=${this.props.project.id}` : ''}`
      const spaceId = `${this.props.space.id ? `&spaceId=${this.props.space.id}` : ''}`
      if (template.type === 'curated') {
        navigate(`${newFHBaseURI}?template=${template.id}&name=Untitled${spaceId}${projectId}`)
      } else {
        navigate(`${newFHBaseURI}?customTemplate=${template.id}&name=Untitled${spaceId}${projectId}`)
      }
    }
  }

  setSort = sort => {
    this.props.actions.updateFilters('documentsSort', sort)
  }

  trackSpaceViewed = space => {
    const props = JSON.stringify({
      spaceId: space.id,
      spaceType: space.isPublic ? 'team' : 'invite-only',
      spaceContext: mapSidebarPathname(this.props.location.pathname)
    })

    if (space.isLoading || viewedEvent === props) return

    viewedEvent = props
    if (!this.props.projectId) {
      trackEvent(APP_SPACE_VIEWED, JSON.parse(props))
    }
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
    const action = !this.props.createModal.showModal ? 'createModalOpen' : 'createModalClose'

    if (action === 'createModalClose') {
      trackEvent('App.CreateDialog.Closed', { action: 'createModalClose' })
    }

    this.props.actions[action]()
  }

  async handleOpenTemplateGallery () {
    this.props.actions.toggleTemplateGalleryModal()
  }

  handleAddExistingModal = () => {
    // This is a workaround to force the CTA dropdown to close by simulating a click outside the component.
    // The composite component takes a list of items of react elements when rendering the CTA,
    // and internally handles closing it for click in list items only, but the "add to existing modal" is
    // wrapper div, with own handler. The only way to trigger the close without a major helios/composite change
    // is to trigger a click outside it prior to opening the modal.
    document.body.click()

    this.props.actions.openBatchAddModal('fab')
  }

  async handleCreateNewModal (documentType, preventTracking) {
    const Paywall = this.props.paywall
    const paywallResponse = await Paywall.checkPaywall(PAYWALL_CREATE_DOCUMENT_ACTION)
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

  async handleCreateRhombus () {
    const Paywall = this.props.paywall
    const paywallResponse = await Paywall.checkPaywall(PAYWALL_CREATE_DOCUMENT_ACTION)
    const showPaywall = !!paywallResponse.hasPaywall

    if (showPaywall) {
      Paywall.show(PAYWALL_CREATE_DOCUMENT_ACTION)
      return
    }

    let newProject = {}
    let event = { name: '', createdFrom: this.props.filters.viewType === 'documents' ? 'DocsTab' : 'Home' }
    newProject.title = 'Untitled'
    newProject.spaceCUID = this.props.space.cuid

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
    navigate(`/studio/new?space=${this.props.space.cuid}`)
  }

  handleCreateNewProject = () => {
    document.body.click()
    window.inGlobalContext.appShell
      .getFeatureContext('sidebar')
      .sendCommand('triggerModal', {
        modalName: 'CREATE_PROJECT_MODAL',
        modalData: {
          spaceName: this.props.space.title,
          spaceId: this.props.space.id,
          context: 'fab'
        }
      })
    this.props.actions.trackCreateClick('createProject')
  }

  filterByType = (type) => {
    this.props.actions.updateFilters('type', type)
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

  scrollToFilterTop = () => {
    if (this.docList.current) {
      const docsListTop = this.docList.current.getBoundingClientRect().top - 177

      // ensure that the user has scrolled past the docs list, otherwise we don't scroll them
      if (docsListTop < 0) {
        animatedScrollTo(window.scrollY + docsListTop, 350)
      }
    }
  }

  getSpaceDocsNavItems = () => {
    const {
      config: { pagingEnabled },
      documents,
      loading,
      filters: { viewFilter, viewType },
      projectId,
      enableFreehandXFilteringSorting
    } = this.props

    // engage-3945 - show archived if there are archived docs regardless the user role
    const archivedDocsInSpace = documents.archivedDocuments.filter(doc => {
      return doc.data.spaceID && doc.data.spaceID === this.props.space.id
    })
    const enableArchiving = archivedDocsInSpace.length > 0

    const routes = {
      [ALL_DOCUMENTS]: projectId
        ? AppRoutes.ROUTE_PROJECT
          .replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title))
          .replace(':projectId', GenerateIDURL(projectId, this.props.project.title))
        : AppRoutes.ROUTE_SPACE_ALL.replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title)),

      [CREATED_BY_ME]: projectId
        ? AppRoutes.ROUTE_PROJECT_MY_DOCUMENTS
          .replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title))
          .replace(':projectId', GenerateIDURL(projectId, this.props.project.title))
        : AppRoutes.ROUTE_SPACE_MY_DOCUMENTS.replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title)),

      [ARCHIVED]: projectId
        ? AppRoutes.ROUTE_PROJECT_ARCHIVED_DOCUMENTS
          .replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title))
          .replace(':projectId', GenerateIDURL(projectId, this.props.project.title))
        : AppRoutes.ROUTE_SPACE_ARCHIVED_DOCUMENTS.replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title)),

      [PROJECTS]: AppRoutes.ROUTE_SPACE_PROJECTS
        .replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title))
    }

    const items = []

    if (this.props.space.hasProjects && !projectId && this.props.account.userV2.flags.spaceProjectsEnabled && enableFreehandXFilteringSorting) {
      items.push({
        element: Link,
        to: routes[ALL_DOCUMENTS],
        label: enableFreehandXFilteringSorting ? DOCUMENTS : SPACE_DOCUMENTS,
        active: enableFreehandXFilteringSorting ? viewType !== 'spaceProjects' : viewFilter === 'team',
        className: cx(styles.navItem, { [styles.active]: viewFilter === 'team' })
      })
    }

    if (!enableFreehandXFilteringSorting) {
      items.push({
        element: Link,
        to: routes[ALL_DOCUMENTS],
        label: SPACE_DOCUMENTS,
        active: enableFreehandXFilteringSorting ? viewType !== 'spaceProjects' : viewFilter === 'team',
        className: cx(styles.navItem, { [styles.active]: viewFilter === 'team' })
      })
      items.push({
        element: Link,
        to: routes[CREATED_BY_ME],
        label: CREATED_BY_ME,
        active: viewFilter === 'user' && viewType !== 'spaceProjects',
        className: cx(styles.navItem, { [styles.active]: viewFilter === 'user' && viewType !== 'spaceProjects' })
      })

      if (pagingEnabled || (!loading && enableArchiving)) {
        items.push({
          element: Link,
          to: routes[ARCHIVED],
          label: ARCHIVED,
          active: viewFilter === 'archive',
          className: cx(styles.navItem, { [styles.active]: viewFilter === 'archive' })
        })
      }
    }

    if (!projectId && this.props.space.hasProjects && this.props.account.userV2.flags.spaceProjectsEnabled) {
      items.unshift({
        element: Link,
        to: routes[PROJECTS],
        label: PROJECTS,
        active: viewType === 'spaceProjects',
        className: cx(styles.navItem, { [styles.active]: viewType === 'spaceProjects' })
      })
    }

    return items
  }

  trackFABOpenEvent = viewType => {
    trackEvent(APP_HOME_CREATE_OPENED, {
      createContext: viewType,
      entryPoint: 'fab'
    })
  }

  render () {
    const {
      account,
      config: {
        isLoading: configIsLoading,
        rhombusEnabled,
        pagingEnabled,
        enableSpacesIndexPagination,
        spacesBatchAdd,
        specsEnabled,
        specsGaRelease
      },
      externalDocConfig,
      externalDocFilterEntries,
      filters: {
        search,
        showFilters,
        documentType,
        documentsSort,
        viewFilter,
        viewType,
        isArchived
      },
      projectId,
      space,
      studioWebEnabled,
      mqs,
      enableFreehandXFilteringSorting
    } = this.props

    const {
      user: {
        permissions: {
          createDocuments,
          createSpaces
        }
      },
      permissions: {
        create: createPermissions
      }
    } = account

    const showCreateCta = createDocuments || createSpaces
    const spaceDocuments = this.props.documents.documents.filter(doc => {
      return doc.data.spaceID && doc.data.spaceID === this.props.space.id
    })

    const isFreehandOnlyCheckLoading = account.isLoading || this.props.isSubscriptionLoading

    const BatchModal = pagingEnabled ? BatchAddModal : BatchAddModalLegacy

    const Header = projectId ? ProjectHeader : SpaceHeader

    // CTA actions
    const addDocumentMenuItems = getAddMenuItems({
      filterType: FILTER_ALL,
      externalDocConfig: externalDocConfig?.addExtResourceConfigs,
      spacesBatchAdd: spacesBatchAdd,
      skipAddInvisionDocument: false,
      isInSpaceOrProject: true,
      handleAddInvisionDocument: this.handleAddExistingModal,

      handleAddExternalDocType: (externalDocAddAction) => async () => {
        try {
          const externalDoc = await externalDocAddAction()
          if (externalDoc) {
            const MOVE_KEY = projectId ? 'project' : 'space'
            this.props.serverActions.moveDocumentsToContainer.request(
              MOVE_KEY,
              this.props[MOVE_KEY].id,
              this.props[MOVE_KEY].title,
              [externalDoc],
              false
            )
          }
        } catch (error) {
          console.error(`Adding External Document failed - ${error}`)
        }
      } })

    // freehand template menu used if enableFreehandXFilteringSorting feature flag enabled and has create permission
    const getFabMenuFn = enableFreehandXFilteringSorting && createPermissions[FREEHAND] ? getTemplatesFabMenuItems : getFabMenuItems
    let createDocumentMenuItems = getFabMenuFn({
      createPermissions,
      createSpaces,
      handleAddExistingModal: this.handleAddExistingModal,
      handleCreateNewModal: this.handleCreateNewModal,
      handleCreateNewProject: this.handleCreateNewProject,
      handleCreateRhombus: this.handleCreateRhombus,
      handleCreateStudio: this.handleCreateStudio,
      handleOpenTemplateGallery: this.handleOpenTemplateGallery,
      isInProject: !!projectId,
      isInSpace: true,
      projectsEnabled: account.userV2.flags.spaceProjectsEnabled,
      rhombusEnabled,
      spaceId: space.id,
      projectId,
      specsEnabled,
      specsGaRelease,
      studioWebEnabled
    })

    // Freehand-only seats have a specific experience. In this case, since they can only
    // create freehands, this code overrides all the logic to only allow that.
    let freehandOnlyOnClick
    const isFreehandOnly = this.props.isFreeHandOnlySeat || this.props.isFreeHandOnlyTeam
    if (isFreehandOnly && !enableFreehandXFilteringSorting) {
      createDocumentMenuItems = []
      freehandOnlyOnClick = () => {
        this.handleCreateNewModal(FILTER_CREATE_STATES[FILTER_FREEHANDS])
      }
    }

    const ctaGroupItems = isFreehandOnlyCheckLoading
      ? null
      : getCtaGroupItems({
        createDocumentMenuItems: showCreateCta ? createDocumentMenuItems : [],
        addDocumentMenuItems,
        addDocoumentMenuClassName: styles.ctaAddMenu,
        freehandOnly: isFreehandOnly && !enableFreehandXFilteringSorting ? {
          onClick: freehandOnlyOnClick
        } : undefined
      })

    const sectionClasses = cx({
      [styles.withGreyBackground]: true,
      [styles[FILTER_FREEHANDS.toLowerCase()]]: isFreehandOnly
    })

    const isSpaceDocumentsViewWithNoProjects = viewType === 'spaceDocuments' && !this.props.space.hasProjects && this.props.account.userV2.flags.spaceProjectsEnabled
    const isProjectDocumentsView = viewType === 'projectDocuments'

    return (
      <section className={sectionClasses}>
        <GlobalHeader
          disableNav={enableFreehandXFilteringSorting && (isSpaceDocumentsViewWithNoProjects || isProjectDocumentsView)}
          globalNav={this.props.globalNav}
          ctaGroupItems={ctaGroupItems}
          ctaOnClick={() => this.trackFABOpenEvent(viewType)}
          items={this.getSpaceDocsNavItems()}
          disableNavShadow
          title={
            <div style={{ width: '90%' }}>
              <Header {...this.props} />
            </div>}
          forceExpandedGlobalNav
        />
        <GlobalHeaderContainer>
          { viewType !== 'spaceProjects' &&
            <GlobalTableStickyHeaderWrapper
              alignWithCTA={enableFreehandXFilteringSorting && (isSpaceDocumentsViewWithNoProjects || isProjectDocumentsView)}
              hasCustomChildren>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1 0 100%' }}>
                {enableFreehandXFilteringSorting
                  ? <>
                    <FreehandXFilters
                      align={pagingEnabled ? 'left' : 'right'}
                      alignSort='right'
                      analyticsSetContext={this.props.actions.analyticsSetContext}
                      externalDocConfig={externalDocConfig}
                      externalDocFilterEntries={externalDocFilterEntries}
                      scrollToFilterTop={this.scrollToFilterTop}
                      page={this.props.isInProject ? 'projectDetails' : 'spaceDetails'}
                      path={this.props.route && this.props.route.path ? this.props.route.path : '/'}
                      mqs={mqs}
                      showFilters={(pagingEnabled || enableSpacesIndexPagination) ? showFilters : spaceDocuments.length > 0}
                      selected={{
                        type: isArchived ? FILTER_ARCHIVED_ONLY : documentType,
                        createdByType: viewFilter,
                        sortType: documentsSort
                      }}
                      filterTypes={ALL_FREEHAND_X_FILTER_TYPES}
                      onFilterType={this.filterByFreehandXType}
                      createdByTypes={CREATED_BY_FILTER_TYPE}
                      onCreatedByChange={this.setFreehandXViewType}
                      sortTypes={DOCUMENTS_SORTS}
                      onSortChange={this.setSort}
                    />
                  </>
                  : <Filters
                    align={pagingEnabled ? 'left' : 'right'}
                    analyticsSetContext={this.props.actions.analyticsSetContext}
                    enableSpecs={this.props.config.specsEnabled}
                    enableRhombus={rhombusEnabled}
                    externalDocConfig={externalDocConfig}
                    externalDocFilterEntries={externalDocFilterEntries}
                    scrollToFilterTop={this.scrollToFilterTop}
                    searchTerm={search}
                    studioWebEnabled={studioWebEnabled}
                    path={this.props.route && this.props.route.path ? this.props.route.path : '/'}
                    mqs={mqs}
                    page={this.props.isInProject ? 'projectDetails' : 'spaceDetails'}
                    onSearch={this.searchDocuments}
                    onSortChange={this.setSort}
                    searchPlaceholder='Search documents'
                    selected={{
                      sortType: documentsSort,
                      type: documentType
                    }}
                    showFilters={(pagingEnabled || enableSpacesIndexPagination) ? showFilters : spaceDocuments.length > 0}
                    showSearch={!configIsLoading && !pagingEnabled && !enableSpacesIndexPagination}
                    sortTypes={DOCUMENTS_SORTS}
                    isLoading={configIsLoading}
                    filterTypes={ALL_FILTER_TYPES}
                    onFilterType={this.filterByType}
                  />}
              </div>
            </GlobalTableStickyHeaderWrapper>
          }
          <div ref={this.docList} className={styles.docList}>
            { !this.props.isInProject && viewType === 'spaceProjects'
              ? <ProjectsGrid
                actions={this.props.actions}
                canDelete={this.props.space.permissions.editSpace}
                forceReload={this.props.projectsForceReload}
                mqs={this.props.mqs}
                projectsEnabled={this.props.account.userV2.flags.spaceProjectsEnabled}
                projectsMetadata={this.props.projectsMetadata}
                projectsPrototypeUIEnabled={this.props.projectsPrototypeUIEnabled}
                serverActions={this.props.serverActions}
                spaceId={this.props.spaceId}
                spacePath={this.props.space.title ? AppRoutes.ROUTE_SPACE.replace(':cuid', GenerateIDURL(this.props.space.id, this.props.space.title)) : ''}
              />
              : <DocumentsList
                {...this.props}
                forceReload={this.props.space.reloadDocuments}
                handleCreateNewModal={this.handleCreateNewModal}
                projectId={projectId}
                spaceId={this.props.spaceId}
                isInSpace={this.props.isInSpace}
                isInProject={this.props.isInProject}
              />
            }
          </div>
        </GlobalHeaderContainer>

        { this.props.config.pagingEnabled
          ? <MultiSelect
            clearSelectedDocuments={this.props.actions.clearSelectedDocuments}
            moveSelectedDocuments={this.props.actions.toggleMoveDocumentModal}
            selectedCount={this.props.selected.selected.length}
          />
          : <LegacyMultiSelect
            pagingEnabled={this.props.config.pagingEnabled}
            clearSelectedDocuments={this.props.actions.clearSelectedDocuments}
            deselectDocuments={this.props.actions.deselectDocuments}
            moveSelectedDocuments={this.props.actions.toggleMoveDocumentModal}
            selected={this.props.selected.selected}
          />
        }

        {this.props.tile.archiveModal.showModal
          ? <ArchiveContainer
            actions={this.props.actions}
            document={this.props.tile.archiveModal.document}
            handleCloseModal={this.toggleArchiveModal}
            serverActions={this.props.serverActions}
            location={this.props.location}
          />
          : null}

        {this.props.tile.deleteModal.showModal
          ? <DeleteContainer
            account={account}
            actions={this.props.actions}
            config={this.props.config}
            document={this.props.tile.deleteModal.document}
            handleCloseModal={this.toggleDeleteModal}
            isDeleting={this.props.tile.deleteModal.isDeleting}
            serverActions={this.props.serverActions}
            location={this.props.location}
          />
          : null}

        {this.props.createModal.showModal
          // During the onboarding walkthrough, we need the transition to happen
          // immediately as it's the first thing a new user sees
          ? <ModalPortal noScroll transitionTime={1000}>
            <CreateModalContainer
              account={account}
              actions={this.props.actions}
              config={this.props.config}
              viewType={viewType}
              createModal={this.props.createModal}
              handleCancelModal={this.toggleCreateModal}
              hasRhombus={this.props.enableRhombus}
              hasSpaces={this.props.enableSpaces}
              serverActions={this.props.serverActions}
              projectId={this.props.projectId}
              space={this.props.space}
              user={account.user}
              filters={this.props.filters}
            />
          </ModalPortal>
          : null}

        {this.props.modals.open && this.props.modals.type === 'batch-add' &&
          <ModalPortal noScroll transitionTime={250}>
            <Provider store={storeRef.current}>
              <BatchModal
                account={account}
                serverActions={this.props.serverActions}
                actions={this.props.actions}
                config={this.props.config}
                project={projectId && this.props.project}
                space={this.props.space}
                metadata={this.props.metadata}
                enableFreehandXFilteringSorting={enableFreehandXFilteringSorting}
              />
            </Provider>
          </ModalPortal>
        }

        {this.props.modals.open && this.props.modals.type === MODAL_MIGRATED_DOCS.key &&
          <ModalPortal noScroll transitionTime={250}>
            <MigratedDocsModal actions={this.props.actions} space={this.props.space} />
          </ModalPortal>
        }

        { this.props.templateGalleryModal.showModal && (
          <TemplateGallery
            V7
            customTemplatesAllowed
            onSelect={this.onSelectTemplate}
          />
        )}
      </section>
    )
  }
}

export default connect((state, ownProps) => ({
  showArchivedTab: spaceHasArchivedDocuments(state),
  space: spaceData(state, ownProps),
  metadata: state.metadata,
  isFreeHandOnlySeat: isFreehandOnlySeat(state),
  isFreeHandOnlyTeam: isFreehandOnlyTeam(state),
  isSubscriptionLoading: isSubscriptionLoading(state),
  projectsForceReload: state.projects.forceReload,
  projectsMetadata: state.projects.projectsDetail,
  projectsPrototypeUIEnabled: state.account.userV2.flags.projectsPrototypeUIEnabled,
  enableFreehandXFilteringSorting: state.account.userV2.flags.enableFreehandXFilteringSorting,
  templateGalleryModal: state.templateGalleryModal
}))(Space)
