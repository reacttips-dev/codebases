import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import {
  PAYWALL_CREATE_DOCUMENT_ACTION
} from '../constants/PaywallTypes'
import { RHOMBUS } from '../constants/DocumentTypes'
import { trackEvent } from '../utils/analytics'

import ArchiveContainer from '../components/Modals/Archive/ArchiveContainer'
import CreateModalContainer from '../components/Modals/Create/CreateModalContainer'
import DeleteContainer from '../components/Modals/Delete/DeleteContainer'
import ModalPortal from '../components/Modals/ModalPortal'
import MultiSelect from '../components/MultiSelect/MultiSelect'
import LegacyMultiSelect from '../components/MultiSelect/_legacy/MultiSelect'

import SidebarHome from './Sidebar/Home'
import { navigate } from '../utils/navigation'

import TemplateGallery from '../components/Modals/TemplateGallery'

export class Home extends React.Component {
  constructor (props) {
    super(props)
    this.searchSpaces = this.searchSpaces.bind(this)
    this.toggleArchiveModal = this.toggleArchiveModal.bind(this)
    this.toggleCreateModal = this.toggleCreateModal.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
    this.toggleMoveDocumentModal = this.toggleMoveDocumentModal.bind(this)
    this.handleCreateNewModal = this.handleCreateNewModal.bind(this)
    this.handleCreateRhombus = this.handleCreateRhombus.bind(this)
    this.handleDocumentKeyup = this.handleDocumentKeyup.bind(this)
    this.handleOpenPopover = this.handleOpenPopover.bind(this)
    this.handleClosePopover = this.handleClosePopover.bind(this)
    this.onSelectTemplate = this.onSelectTemplate.bind(this)

    this.state = { isPopoverOpen: false }
  }

  componentDidMount () {
    document.addEventListener('keyup', this.handleDocumentKeyup, true)
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.handleDocumentKeyup, true)
  }

  componentWillReceiveProps (newProps) {
    // Accept a "modal" URL param, eg: /spaces?modal=createSpace
    const { query } = queryString.parseUrl(newProps.location.search)
    const { modal, ...params } = query
    if (modal && !newProps.createModal.showModal) {
      // Open the modal if the param is present
      this.handleCreateNewModal(modal)

      // And then clear the param
      const routeWihoutModalQuery = queryString.stringify(params)
      navigate(`${newProps.location.pathname}/${routeWihoutModalQuery}`)
    }
  }

  searchSpaces (e) {
    this.props.actions.filterSpaces(e.target.value)
  }

  toggleArchiveModal () {
    this.props.actions.toggleArchiveModal({})
  }

  toggleDeleteModal () {
    this.props.actions.toggleDeleteModal({})
  }

  toggleMoveDocumentModal () {
    this.props.actions.toggleMoveDocumentModal({})
  }

  toggleCreateModal () {
    const action = !this.props.createModal.showModal ? 'createModalOpen' : 'createModalClose'

    if (action === 'createModalClose') {
      trackEvent('App.CreateDialog.Closed', { action: 'createModalClose' })
    }

    this.props.actions[action]()
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

    this.handleClosePopover()
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

    trackEvent('App.Rhombus.Created', event)

    this.props.actions.trackCreateClick('createRhombus')
    this.props.serverActions.createDocument.request(RHOMBUS, newProject)
  }

  onSelectTemplate (template) {
    if (!template) {
      this.props.actions.toggleTemplateGalleryModal({})
    } else {
      const newFHBaseURI = '/freehand/new'
      if (template.type === 'curated') {
        navigate(`${newFHBaseURI}?template=${template.id}&name=Untitled`)
      } else {
        navigate(`${newFHBaseURI}?customTemplate=${template.id}&name=Untitled`)
      }
    }
  }

  handleDocumentKeyup (e) {
    switch (e.key) {
      case 'Esc':
      case 'Escape':
        this.props.actions.clearSelectedDocuments()
        break
      default:
        break
    }
  }

  handleOpenPopover () {
    this.setState({ isPopoverOpen: true })
  }

  handleClosePopover () {
    this.setState({ isPopoverOpen: false })
  }

  render () {
    const { account } = this.props

    return (
      <section>
        <SidebarHome {...this.props} />

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

        { this.props.tile.archiveModal.showModal
          ? <ArchiveContainer
            actions={this.props.actions}
            document={this.props.tile.archiveModal.document}
            handleCloseModal={this.toggleArchiveModal}
            serverActions={this.props.serverActions}
            location={this.props.location}
          />
          : null }

        { this.props.tile.deleteModal.showModal
          ? <DeleteContainer
            actions={this.props.actions}
            account={account}
            config={this.props.config}
            document={this.props.tile.deleteModal.document}
            handleCloseModal={this.toggleDeleteModal}
            isDeleting={this.props.tile.deleteModal.isDeleting}
            serverActions={this.props.serverActions}
            location={this.props.location}
          />
          : null }

        { this.props.createModal.showModal
          // During the onboarding walkthrough, we need the transition to happen
          // immediately as it's the first thing a new user sees
          ? <ModalPortal noScroll transitionTime={1000}>
            <CreateModalContainer
              account={account}
              actions={this.props.actions}
              config={this.props.config}
              viewType={this.props.filters.viewType}
              createModal={this.props.createModal}
              handleCancelModal={this.toggleCreateModal}
              hasRhombus={this.props.enableRhombus}
              hasSpaces={this.props.enableSpaces}
              serverActions={this.props.serverActions}
              user={account.user}
              filters={this.props.filters}
            />
          </ModalPortal>
          : null }
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

Home.defaultProps = {
  enableArchiving: false,
  enableRhombus: false,
  enableSpaces: false
}

Home.propTypes = {
  actions: PropTypes.object,
  account: PropTypes.object,
  createModal: PropTypes.object,
  templateGalleryModal: PropTypes.object,
  documents: PropTypes.object,
  enableArchiving: PropTypes.bool,
  enableRhombus: PropTypes.bool,
  enableSpaces: PropTypes.bool,
  recents: PropTypes.object,
  route: PropTypes.object,
  selected: PropTypes.object,
  serverActions: PropTypes.object,
  spaces: PropTypes.object,
  tile: PropTypes.object,
  toggleCreateModal: PropTypes.func,
  location: PropTypes.object,
  filters: PropTypes.object,
  paywall: PropTypes.object
}

export default Home
