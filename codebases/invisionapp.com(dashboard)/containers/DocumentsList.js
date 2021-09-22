import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as AppRoutes from '../constants/AppRoutes'
import { FILTER_ALL, FILTER_HARMONY, FILTER_RHOMBUS, FILTER_SPECS } from '../constants/FilterTypes'
import { OVER_MAX_DOCUMENTS_ERROR_STRING } from '../constants/MoveDocumentsConstants'
import { totalPages, filterDocuments, filterSpaceDocuments } from '../selectors/documents'
import { isFreehandOnlySeat } from '../selectors/account'
import { isFreehandOnlyTeam, isSubscriptionLoading } from '../selectors/subscription'
import animatedScrollTo from '../utils/animatedScrollTo'
import parseSearchUrl from '../utils/parseSearchUrl'

import DocumentsCTA from '../components/Document/DocumentsCTA'

import DocumentItems from '../components/Document/DocumentItems'

import SearchSpacesList from './SearchSpacesList'

import Loading from '../components/Layout/Loading'

import GetInspired from '../components/Recent/GetInspired'

import styles from '../css/home/documents-list.css'
import { navigate } from '../utils/navigation'

const ItemsComponent = (props) => (
  props.isSearch ? (
    <SearchSpacesList {...props} />
  ) : (
    <DocumentItems {...props} />
  )
)

class DocumentsList extends React.Component {
  constructor (props) {
    super(props)

    this.documentsListRef = React.createRef()

    this.filterByType = this.filterByType.bind(this)
    this.scrollToFilterTop = this.scrollToFilterTop.bind(this)
    this.searchDocuments = this.searchDocuments.bind(this)
    this.setSearchView = this.setSearchView.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.selected.showAlert && this.props.selected.showAlert) {
      this.props.actions.showAlert('info', OVER_MAX_DOCUMENTS_ERROR_STRING)
    } else if (
      (prevProps.filters.viewType !== this.props.filters.viewType &&
        this.props.filters.viewType !== 'spaceProjects' && this.props.filters.viewType !== 'spaceDocuments' &&
        this.props.filters.viewType !== 'projectDocuments'
      ) ||
      (this.props.filters.viewType === 'search' && (
        (prevProps.location.search !== this.props.location.search) || // check for url update
          this.props.filters.search.length === 0 // check for search term change
      )
      )
    ) {
      // In the search view, parse the current URL and set the filters
      this.props.actions.clearSelectedDocuments()

      // Update search filters
      if (this.props.filters.viewType === 'search') {
        const searchFilter = parseSearchUrl(window.location.search) || {}
        this.props.actions.setSearchSpacesResourceLoading()
        if (searchFilter.searchTerm) {
          this.searchDocuments(searchFilter.searchTerm)
        }

        if (searchFilter.documentType) {
          // Make sure the parsed type from the url is an enabled document for the user
          if (
            (searchFilter.documentType === FILTER_SPECS && !this.props.config.specsEnabled) ||
            (searchFilter.documentType === FILTER_RHOMBUS && !this.props.config.rhombusEnabled) ||
            (searchFilter.documentType === FILTER_HARMONY && !this.props.config.studioWebEnabled)
          ) {
            return
          }

          this.filterByType(searchFilter.documentType, { noTrack: true })
        } else {
          this.filterByType(FILTER_ALL, { noTrack: true })
        }

        if (searchFilter.projectId) {
          this.filterBySpace('')
          this.props.serverActions.getProject.request(searchFilter.projectId)
          this.filterByProject(searchFilter.projectId)
        } else if (searchFilter.spaceId) {
          this.filterByProject('')

          // Fetch the space title, which will be used by the search blue pill
          if (this.props.config.pagingEnabled) {
            this.props.serverActions.getSpaceV2.request(searchFilter.spaceId)
          } else {
            this.props.serverActions.getSpace.request(searchFilter.spaceId)
          }
          this.filterBySpace(searchFilter.spaceId)
        } else {
          this.filterByProject('')
          this.filterBySpace('')
        }

        if (searchFilter.searchView) {
          this.setSearchView(searchFilter.searchView)
        } else {
          // default to documents search
          this.setSearchView('documents')
        }
      } else {
        // Reset filters if switching views
        if (prevProps.filters.viewType !== this.props.filters.viewType) {
          this.props.actions.resetFilters()
        }
      }
    }
  }

  componentWillUpdate (nextProps) {
    if (
      !nextProps.config.pagingEnabled &&
      nextProps.filters.viewFilter === 'archive' &&
      nextProps.documents.archivedDocuments.length === 0
    ) {
      navigate(AppRoutes.ROUTE_DOCUMENTS)
    }
  }

  filterByType (type, opts) {
    this.props.actions.updateFilters('type', type, opts)
  }

  filterByProject (id) {
    this.props.actions.updateFilters('projectId', id)
  }

  filterBySpace (id) {
    this.props.actions.updateFilters('spaceId', id)
  }

  searchDocuments (value) {
    this.props.actions.updateFilters('searchTerm', value)
  }

  setSearchView (value) {
    this.props.actions.updateFilters('searchView', value)
  }

  gotoPage (index) {
    // Set analytics context
    const pathname = window.location.pathname
    const analyticsContext = { page: index, homeView: pathname }
    this.props.actions.analyticsSetContext(analyticsContext)
    this.props.actions.pageOpened(analyticsContext)
    this.props.actions.gotoPage(index)

    animatedScrollTo(0, 350)
  }

  scrollToFilterTop () {
    if (this.documentsListRef.current) {
      const docsListTop = this.documentsListRef.current.getBoundingClientRect().top - 30

      // ensure that the user has scrolled past the docs list, otherwise we don't scroll them
      if (docsListTop < 0) {
        animatedScrollTo(window.scrollY + docsListTop, 350)
      }
    }
  }

  render () {
    const {
      config,
      documents,
      filters,
      filteredDocuments,
      handleCreateNewModal,
      mqs,
      paywall
    } = this.props

    let isSearchSpaceView = false
    if (filters.viewType === 'search') {
      // If search is disabled, fallback to the documents list

      if (!config.searchEnabled) {
        isSearchSpaceView = false
      } else {
        // Else, use the searchView to decide if we are rendering the documents search view or spaces search view
        // Or if we are searching for documents within a space
        isSearchSpaceView = !(
          filters.searchView === 'documents' ||
          filters.searchView === 'spaceDocuments' ||
          filters.searchView === 'projectDocuments')
      }
    } else {
      // Otherwise fallback to the DocumentsList, based on the pagination flag
      isSearchSpaceView = false
    }

    const failedToLoad = !filteredDocuments.length && documents.errors.length
    const pathname = window.location.pathname
    const isInDocumentsMenu = pathname && (pathname === '/' || pathname.indexOf('/docs') !== -1)

    const showGetInspired = filters.documentType === FILTER_ALL &&
      filters.showGetInspired &&
      filters.search === '' &&
      filters.viewFilter !== 'archive' &&
      filters.viewType === 'documents' &&
      isInDocumentsMenu &&
      !failedToLoad &&
      !mqs.m &&
      !mqs.s &&
      !mqs.xs

    let spaceId = filters.viewType === 'search' ? filters.spaceId : this.props.spaceID
    if (!spaceId && this.props.space && this.props.space.id) {
      spaceId = this.props.space.id
    }

    const projectId = filters.viewType === 'search' ? filters.projectId : this.props.projectId

    return (
      <div ref={this.documentsListRef} className={styles.root}>
        <div className={styles.top}>
          { !this.props.hasSeenSpacesDocsCTA &&
            config.spacesShowCTA &&
            <DocumentsCTA
              actions={this.props.actions}
              handleCreateNewModal={handleCreateNewModal}
            />
          }
          { !config.pagingEnabled && (filters.viewFilter === 'archive' && documents.archivedCount === 0)
            ? !config.isLoading ? <Loading type='documents' /> : null
            : <ItemsComponent
              isSearch={isSearchSpaceView}
              account={this.props.account}
              actions={this.props.actions}
              config={this.props.config}
              documentCount={config.pagingEnabled ? 0 : this.props.documents.documents.length}
              documents={config.pagingEnabled ? [] : this.props.filteredDocuments}
              docType={this.props.docType}
              enableArchiving={this.props.enableArchiving}
              enableRhombus={this.props.enableRhombus}
              enableSpaces={this.props.enableSpaces}
              enableSpaceProjects={this.props.enableSpaceProjects}
              enableSpecs={this.props.enableSpecs}
              externalDocFilterEntries={this.props.externalDocFilterEntries}
              externalTypesConfig={this.props.externalDocConfig}
              getExtDocFallbackIcon={this.props.getExtDocFallbackIcon}
              isExternalDocType={this.props.isExternalDocType}
              errors={this.props.documents.errors}
              filterType={this.props.filters.documentType}
              forceReload={this.props.forceReload}
              fromCache={config.pagingEnabled ? false : this.props.documents.fromCache}
              homeSection=''
              isInSpace={this.props.isInSpace}
              isInProject={this.props.isInProject}
              location={this.props.location}
              metadata={this.props.metadata}
              mqs={this.props.mqs}
              page={documents.page}
              projectId={projectId || ''}
              projects={this.props.projects}
              searchTerm={this.props.filters.search}
              searchView={this.props.filters.searchView}
              selected={this.props.selected}
              serverActions={this.props.serverActions}
              showArchived={this.props.filters.viewFilter === 'archive'}
              isArchived={this.props.filters.isArchived}
              showFilters={this.props.filters.showFilters}
              showUserDocs={this.props.filters.viewFilter === 'user'}
              showGetInspired={showGetInspired}
              sortType={this.props.filters.documentsSort}
              space={this.props.space}
              spaceId={spaceId}
              spaces={this.props.spaces}
              studioWebEnabled={this.props.studioWebEnabled}
              tile={this.props.tile}
              viewType={this.props.filters.viewType}
              isFreeHandOnlySeat={this.props.isFreeHandOnlySeat}
              isFreeHandOnlyTeam={this.props.isFreeHandOnlyTeam}
              isSubscriptionLoading={this.props.isSubscriptionLoading}
              paywall={paywall}
            />
          }
        </div>
        { !config.isLoading && showGetInspired &&
          <div className={styles.getInspired}>
            <GetInspired hasDocuments={documents.documents.length > 0} showStudio={!config.hideStudioInHome} showSpecsAd={config.showGetInspiredSpecsAd} mqs={mqs} />
          </div>
        }
      </div>
    )
  }
}

DocumentsList.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  config: PropTypes.object,
  documents: PropTypes.object,
  enableRhombus: PropTypes.bool,
  enableSpecs: PropTypes.bool,
  enableSpaces: PropTypes.bool,
  filteredDocuments: PropTypes.array,
  filters: PropTypes.object,
  getExtDocFallbackIcon: PropTypes.func,
  handleCreateNewModal: PropTypes.func,
  hasSeenSpacesDocsCTA: PropTypes.bool,
  recents: PropTypes.object,
  projects: PropTypes.object,
  selected: PropTypes.object,
  serverActions: PropTypes.object,
  spaces: PropTypes.array,
  studioWebEnabled: PropTypes.bool,
  tile: PropTypes.object,
  totalPages: PropTypes.number,
  isInSpace: PropTypes.bool,
  isInProject: PropTypes.bool,
  paywall: PropTypes.object
}

export default connect((state, props) => {
  return {
    filteredDocuments: props.isInSpace ? filterSpaceDocuments(state) : filterDocuments(state),
    spaces: (
      props.filters.searchView === 'spaces' &&
      props.filters.viewType === 'search' &&
      props.config.searchEnabled
    ) ? state.spaces : state.spaces.spaces,
    projects: state.projects,
    totalPages: totalPages(state),
    mqs: state.mqs,
    isFreeHandOnlySeat: isFreehandOnlySeat(state),
    isFreeHandOnlyTeam: isFreehandOnlyTeam(state),
    isSubscriptionLoading: isSubscriptionLoading(state)
  }
})(DocumentsList)
