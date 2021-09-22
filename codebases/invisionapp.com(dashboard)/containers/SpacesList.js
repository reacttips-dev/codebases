import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import WelcomeBannerIllustration from '@invisionapp/helios/illustrations/scene/no-spaces-to-view.svg'

import { listSpacesFailure } from '../constants/Errors'
import { filterSpaces } from '../selectors/spaces'
import animatedScrollTo from '../utils/animatedScrollTo'

import LoadFailure from '../components/Layout/LoadFailure'
import SidebarSpaceItems from '../components/Space/Sidebar/SpaceItems'
import PaginatedSidebarSpaceItems from '../components/Space/Sidebar/PaginatedSpaceItems'
import WelcomeBanner from '../components/Common/WelcomeBanner'
import { navigate } from '../utils/navigation'

import LoadingSpaceItems from '../components/Space/Sidebar/LoadingSpaceItems'

const reloadPage = () => window.location.reload()

class SpacesList extends React.Component {
  state = {
    showWelcomeBanner: false,
    hasCheckedBanner: false
  }

  constructor (props) {
    super(props)

    this.spacesListRef = React.createRef()

    this.scrollToFilterTop = this.scrollToFilterTop.bind(this)
    this.searchSpaces = this.searchSpaces.bind(this)
  }

  componentDidMount () {
    this.props.actions.resetFilters()
    this.props.actions.updateFilters('viewType', 'spaces')
    this.props.actions.clearSelectedDocuments()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.spaces.viewFilter === 'team' && !prevProps.account.isLoading && prevProps.account.user.permissions.createSpaces !== true) {
      navigate('/spaces')
    }
  }

  scrollToFilterTop () {
    if (this.spacesListRef.current) {
      const spacesListTop = this.spacesListRef.current.getBoundingClientRect().top - 30

      // ensure that the user has scrolled past the docs list, otherwise we don't scroll them
      if (spacesListTop < 0) {
        animatedScrollTo(window.scrollY + spacesListTop, 350)
      }
    }
  }

  searchSpaces (value) {
    this.props.actions.updateFilters('searchTerm', value)
  }

  render () {
    const {
      spaces,
      account,
      actions,
      config,
      handleCreateNewModal,
      serverActions,
      spaceDocuments,
      filteredSpaces,
      tile,
      filters,
      location,
      documentCount,
      mqs,
      projects,
      showProjectInSpace,
      spacesDetail,
      spacesMembers,
      spacesResource,
      paywall
    } = this.props

    const { enableSpacesIndexPagination } = config

    return (
      <div ref={this.spacesListRef} style={{ position: 'relative' }}>
        {(config.isLoading || (spaces.isLoading && !enableSpacesIndexPagination) || (!enableSpacesIndexPagination && spaces.fromCache && filteredSpaces.length === 0)) &&
          <LoadingSpaceItems />
        }

        {enableSpacesIndexPagination && !config.isLoading && (
          <PaginatedSidebarSpaceItems
            account={account}
            actions={actions}
            config={config}
            handleCreateNewModal={handleCreateNewModal}
            projects={projects}
            serverActions={serverActions}
            spaceDocuments={spaceDocuments}
            spacesDetail={spacesDetail}
            spacesMembers={spacesMembers}
            spacesResource={spacesResource}
            tile={tile}
            searchTerm={filters.search}
            spacesSort={filters.spacesSort}
            viewFilter={filters.viewFilter}
            location={location}
            mqs={mqs}
            documentCount={documentCount}
            viewType={filters.viewType}
            showProjectInSpace={showProjectInSpace}
            paywall={paywall}
          />
        )}

        {!enableSpacesIndexPagination && !config.isLoading && (!spaces.error || (spaces.fromCache && filteredSpaces.length > 0)) && !spaces.isLoading &&
          <SidebarSpaceItems
            account={account}
            actions={actions}
            config={config}
            handleCreateNewModal={handleCreateNewModal}
            serverActions={serverActions}
            spaceDocuments={spaceDocuments}
            spaces={filteredSpaces}
            tile={tile}
            searchTerm={filters.search}
            location={location}
            mqs={mqs}
            documentCount={documentCount}
            viewType={filters.viewType}
            paywall={paywall}
          />
        }
        { spaces.error && spaces.error.type === listSpacesFailure.type &&
          <LoadFailure onClick={reloadPage} type='spaces' />
        }
        {
          this.state.showWelcomeBanner &&
          <WelcomeBanner
            titleText='Organization that makes sense'
            bodyText='The Spaces feature helps your team keep related work together. Store a variety of documents in one place for frictionless collaboration.'
            buttonText='Got it'
            illustration={<WelcomeBannerIllustration />} />
        }
      </div>
    )
  }
}

SpacesList.propTypes = {
  account: PropTypes.object,
  actions: PropTypes.object,
  config: PropTypes.object,
  handleCreateNewModal: PropTypes.func,
  projects: PropTypes.object,
  serverActions: PropTypes.object,
  spaceDocuments: PropTypes.object,
  spaces: PropTypes.object,
  tile: PropTypes.object,
  filters: PropTypes.object,
  showProjectInSpace: PropTypes.func,
  spacesDetail: PropTypes.object,
  spacesMembers: PropTypes.object,
  spacesResource: PropTypes.object,
  paywall: PropTypes.object
}

export default connect(state => ({
  filteredSpaces: filterSpaces(state),
  spacesDetail: state.spaces.spacesDetail,
  spacesMembers: state.spaces.spacesMembers,
  spacesResource: state.spaces.spacesResource,
  projects: state.projects
}))(SpacesList)
