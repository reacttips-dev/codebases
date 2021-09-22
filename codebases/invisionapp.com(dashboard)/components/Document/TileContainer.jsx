import { Tile } from '@invisionapp/helios'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { BOARD, DOCUMENT_TYPES, FREEHAND, HARMONY, PRESENTATION, PROTOTYPE, RHOMBUS, SPACE, SPEC, UNTITLED } from '../../constants/DocumentTypes'
import {
  SORT_ALPHA, SORT_CREATED, SORT_RECENT, SORT_UPDATED
} from '../../constants/SortTypes'
import { APP_DOCUMENT_OPENED, APP_HOME_DOCUMENT_CONTEXTMENU_CLICKED } from '../../constants/TrackingEvents'
import styles from '../../css/tiles/responsive-tile.css'
import { selectedDocumentsRange, selectedSpaceDocumentsRange } from '../../selectors/documents'
import { trackEvent } from '../../utils/analytics'
import { encodeDocumentTransferData } from '../../utils/encodeDocumentTransferData'
import { mapSidebarPathname } from '../../utils/mapPaths'
import { navigate } from '../../utils/navigation'
import normalizeAnalyticsDocumentType from '../../utils/normalizeAnalyticsDocumentType'
import setLastViewed from '../../utils/setLastViewed'
import AbbrevTimeAgo from '../Common/AbbrevTimeAgo'
import ProjectTitleLink from '../Space/ProjectTileLink'
import renderSpaceName from '../Space/renderSpaceName'

export class TileContainer extends PureComponent {
  static propTypes = {
    actions: PropTypes.object,
    id: PropTypes.any,
    cuid: PropTypes.string,
    enableArchiving: PropTypes.bool,
    externalTypesConfig: PropTypes.object,
    getExtDocFallbackIcon: PropTypes.func,
    iconSrc: PropTypes.string,
    fromCache: PropTypes.bool,
    multipleTeams: PropTypes.bool,
    onMenuVisibility: PropTypes.func,
    permissions: PropTypes.object,
    thumbnailUrl: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.oneOf([SPACE, PROTOTYPE, BOARD, FREEHAND, HARMONY, RHOMBUS, PRESENTATION, SPEC]),
    data: PropTypes.object,
    sortType: PropTypes.string,
    projectsEnabled: PropTypes.bool
  }

  static defaultProps = {
    permissions: {
      canArchive: false,
      canDelete: false,
      canMove: false
    }
  }

  state = {
    shiftKey: false,
    spaceRendered: null
  }

  componentDidMount () {
    this.setState({
      spaceRendered: this.renderDocumentParent()
    })
  }

  documentHasChanged = (prevDoc, document) =>
    (prevDoc.id !== document.id) ||
    (prevDoc.isArchived !== document.isArchived)

  componentDidUpdate (prevProps, prevState) {
    if (
      prevProps.document.space.id !== this.props.document.space.id ||
      prevProps.document.space.title !== this.props.document.space.title ||
      prevProps.document.space.discoverable !== this.props.document.space.discoverable ||
      this.props.overrideSpace !== prevProps.overrideSpace ||
      this.props.canCreateSpaces !== prevProps.canCreateSpaces) {
      this.setState({ spaceRendered: this.renderDocumentParent() })
    }
  }

  trackContextClick = option => {
    trackEvent(APP_HOME_DOCUMENT_CONTEXTMENU_CLICKED, {
      option,
      documentType: normalizeAnalyticsDocumentType(this.props.document.resourceType),
      documentContext: mapSidebarPathname(this.props.location.pathname)
    })
  }

  toggleArchiveModal = () => {
    this.setDocumentContext()

    const {
      actions,
      document: {
        resourceType: type,
        id
      }
    } = this.props

    actions.toggleMoreMenu('', 0)

    actions.toggleArchiveModal({
      type,
      id,
      isArchived: false
    })

    this.trackContextClick('archive')
  }

  toggleDeleteModal = () => {
    this.setDocumentContext()

    const {
      actions,
      document: {
        resourceType: type,
        id,
        title
      }
    } = this.props

    actions.toggleMoreMenu('', 0)

    actions.toggleDeleteModal({
      type,
      id,
      cuid: id,
      title
    })

    this.trackContextClick('delete')
  }

  setDocumentContext = () => {
    // Analytic events context
    let analyticsContext = {}
    if (this.props.document.type === 'space' && this.props.space) {
      analyticsContext.space = {
        cuid: this.props.space.cuid,
        isPublic: this.props.space.isPublic
      }
    } else {
      analyticsContext = {
        document: {
          cuid: this.props.document.id
        },
        documentType: this.props.document.resourceType
      }
    }
    this.props.actions.analyticsSetContext(analyticsContext)
  }

  toggleShare = (e) => {
    const href = `${this.props.document.path}?share`
    this.trackContextClick('share')
    navigate(href)
  }

  initiateDocumentTransfer = () => {
    const { id, resourceType: type } = this.props.document
    const { search, pathname } = this.props.location

    // a user without multiple teams cannot initiate doc transfer
    if (!this.props.multipleTeams) {
      return
    }

    const redirectTo = `${pathname}${search}`
    const encodedDocumentData = encodeDocumentTransferData({ id, type })

    // The url in team-management-web to navigate to
    const href = `/teams/documents/transfer?transferDocuments=${encodedDocumentData}&redirectTo=${redirectTo}`

    this.trackContextClick('transfer')

    navigate(href)
  }

  toggleSelectDocuments = () => {
    const {
      actions,
      document: { resourceType, id, title, space: { id: spaceId } }
    } = this.props

    document.getSelection().removeAllRanges()

    actions.toggleMoreMenu('', 0)

    actions.toggleSelectDocument(resourceType, id, spaceId, title, this.state.shiftKey ? this.props.selectedDocumentsRange : [])

    this.trackContextClick('select')

    if (this.state.shiftKey) this.setState({ shiftKey: false })
  }

  toggleMoveDocumentModal = () => {
    const {
      actions,
      document: {
        resourceType: type,
        id,
        title,
        space,
        space: {
          id: spaceId
        }
      }
    } = this.props

    actions.toggleMoreMenu('', 0)

    const inProject = space.project && space.project.id

    actions.toggleMoveDocumentModal({
      type,
      id,
      title,
      currentSpaceType: inProject ? 'project' : 'space',
      currentSpaceID: inProject ? space.project.id : spaceId
    })

    this.trackContextClick('move')
  }

  handleClick = e => {
    const {
      document: {
        id,
        resourceType: type,
        space: {
          id: spaceId
        }
      }
    } = this.props

    if (this.state.shiftKey) {
      this.setState({ shiftKey: false })
    }

    if (e.target && e.target.closest('[data-space-link="true"]')) return

    setLastViewed(type, id)

    let sort = 'unknown'

    switch (this.props.sortType) {
      case SORT_CREATED:
        sort = 'created'
        break
      case SORT_UPDATED:
        sort = 'updated'
        break
      case SORT_RECENT:
        sort = 'viewed'
        break
      case SORT_ALPHA:
        sort = 'alphabetical'
        break
    }

    const location = this.props.location.pathname
    const event = {
      documentId: id,
      documentOrder: this.props.documentOrder,
      documentType: normalizeAnalyticsDocumentType(type),
      documentContext: mapSidebarPathname(location),
      page: this.props.page || 0,
      homeSection: this.props.homeSection,
      sort,
      spaceId: spaceId || null
    }

    trackEvent(APP_DOCUMENT_OPENED, event)
  }

  handleMouseDown = e => {
    this.props.actions.setActiveSelectedDocument(
      this.props.document.resourceType,
      this.props.document.id
    )
    if (e.shiftKey) this.setState({ shiftKey: true })
  }

  handleMoveDocument = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { actions, document } = this.props
    const {
      id,
      resourceType: type,
      title,
      space,
      space: {
        id: spaceId
      }
    } = document

    const inProject = space && spaceId && space.project && space.project.id

    actions.analyticsSetContext({ spaceDocumentContext: 'tile' })
    actions.toggleMoveDocumentModal({
      id,
      type,
      currentSpaceType: inProject ? 'project' : 'space',
      currentSpaceID: inProject ? space.project.id : spaceId || '',
      spaceCUID: inProject ? space.project.id : spaceId || '',
      title
    })
  }

  canShare () {
    const { document: { isArchived, resourceType } } = this.props

    const docType = DOCUMENT_TYPES[resourceType] ? DOCUMENT_TYPES[resourceType] : DOCUMENT_TYPES.external
    return (docType && (typeof docType.moreMenu.share === 'undefined' || docType.moreMenu.share)) && !isArchived
  }

  canArchive () {
    const { enableArchiving, document: { resourceType, isArchived }, permissions } = this.props

    const docType = DOCUMENT_TYPES[resourceType] ? DOCUMENT_TYPES[resourceType] : DOCUMENT_TYPES.external

    return enableArchiving && !isArchived && permissions && permissions.canArchive && docType && docType.moreMenu && docType.moreMenu.archive
  }

  canDelete () {
    const { permissions, document: { resourceType } } = this.props

    const docType = DOCUMENT_TYPES[resourceType] ? DOCUMENT_TYPES[resourceType] : DOCUMENT_TYPES.external

    return permissions && permissions.canDelete && docType && docType.moreMenu && docType.moreMenu.delete
  }

  // Note: canMove is used both to define 'move' and 'select'.
  // 'Move' directly takes the user the move document modal, while 'select', let the user select 1-N documents to be moved as a batch.
  canMove () {
    const { permissions, document: { isArchived, resourceType } } = this.props
    const docType = DOCUMENT_TYPES[resourceType] ? DOCUMENT_TYPES[resourceType] : DOCUMENT_TYPES.external

    return permissions && !isArchived && permissions.canMove && docType && docType.moreMenu && docType.moreMenu.move
  }

  canTransfer () {
    const { config, canTransferDocuments, multipleTeams, document: { resourceType } } = this.props
    const docTransferSupportedTypes = config.docTransferSupportedTypes || ''

    return config.docTransferEnabled && docTransferSupportedTypes.split(',').includes(resourceType) && this.canDelete() && canTransferDocuments && multipleTeams
  }

  getMenuItems = () => {
    let menuItems = []

    if (this.props.fromCache) return menuItems

    if (this.canShare()) {
      menuItems.push({
        element: 'button',
        label: 'Share',
        onClick: this.toggleShare,
        type: 'item'
      })
    }

    if (this.canMove()) {
      menuItems.push({
        element: 'button',
        label: 'Select...',
        onClick: this.toggleSelectDocuments,
        type: 'item'
      })

      menuItems.push({
        element: 'button',
        label: (this.props.document.space.id || !this.props.document.space.discoverable) ? 'Move' : 'Add to space',
        onClick: this.toggleMoveDocumentModal,
        type: 'item'
      })
    }

    if (this.canTransfer()) {
      menuItems.push({
        element: 'button',
        label: 'Transfer to team',
        onClick: this.initiateDocumentTransfer,
        type: 'item'
      })
    }

    if (this.canArchive()) {
      menuItems.push({
        element: 'button',
        label: 'Archive',
        onClick: this.toggleArchiveModal,
        type: 'item'
      })
    }

    if (this.canDelete()) {
      const { document: { resourceType } } = this.props
      const docType = DOCUMENT_TYPES[resourceType] ? DOCUMENT_TYPES[resourceType] : DOCUMENT_TYPES.external

      menuItems.push({
        destructive: true,
        element: 'button',
        label: docType.moreMenu.deleteLabel || 'Delete',
        onClick: this.toggleDeleteModal,
        type: 'item'
      })
    }

    return menuItems
  }

  getSpaceNameProps = () => {
    const { document, canCreateSpaces, location } = this.props
    const data = Object.assign(
      {},
      document,
      { permissions: document.permissions }
    )
    return {
      canCreateSpaces,
      data,
      handleMoveDocument: this.handleMoveDocument,
      location
    }
  }

  getTileDate = (doc, sortType) => {
    let label = 'Updated'
    let date = doc.contentUpdatedAt

    if (doc.userLastAccessedAt && [SORT_CREATED, SORT_UPDATED].indexOf(sortType) === -1) {
      label = 'Viewed'
      date = doc.userLastAccessedAt
    }

    if (sortType === SORT_CREATED) {
      label = 'Created'
      date = doc.contentCreatedAt
    }

    return (
      <span>
        {label} <AbbrevTimeAgo date={date} live={false} />
      </span>
    )
  }

  renderDocumentParent = () => {
    const { document, isInSpace, isInProject, projectsEnabled } = this.props
    const spaceName = renderSpaceName(this.getSpaceNameProps(), document.resourceType, true)

    const space = this.props.document.space
    const project = space && space.project

    const DefaultRender = () => (
      <div
        data-space-link='true'
        className={styles.space}>
        {spaceName}
      </div>
    )

    if (!projectsEnabled) {
      if (spaceName) {
        return DefaultRender
      }
      return null
    }

    if (project && !isInProject) {
      return () => (
        <ProjectTitleLink project={project} space={space} />
      )
    } else {
      if (spaceName && !isInSpace && !isInProject) {
        return DefaultRender
      }
    }
  }

  render () {
    const {
      document,
      document: {
        id,
        resourceType,
        title,
        path,
        space
      },
      externalTypesConfig,
      getExtDocFallbackIcon,
      iconSrc,
      permissions,
      sortType,
      thumbnailUrl,
      isTemplate
    } = this.props

    const { spaceRendered } = this.state

    const docTitle = title || UNTITLED
    const updated = this.getTileDate(document, sortType)
    const fileIconSrc = iconSrc || externalTypesConfig?.[resourceType]?.logoSrc || getExtDocFallbackIcon?.(resourceType)
    const fileTypeSrc = DOCUMENT_TYPES[resourceType] && typeof iconSrc === 'undefined' ? undefined : fileIconSrc

    return (
      <div
        style={{ height: 'calc(100% - 32px)' }}
        data-selectable={permissions ? permissions.canMove : false}
        data-type={resourceType}
        data-id={id}
        data-title={title}
        data-icon-src={fileTypeSrc}
        data-current-space={space.id || ''}
        draggable={this.props.isDraggable}>
        <Tile
          className={cx(styles.tile, {
            [styles[resourceType]]: [FREEHAND, RHOMBUS, BOARD].includes(resourceType) // Thumbs assets are not standardized accross all docs, customize rendering for each needed
          })}
          isTemplate={isTemplate}
          disableLoader
          src={thumbnailUrl}
          element='a'
          href={path}
          target={DOCUMENT_TYPES[resourceType] ? '_self' : '_blank'}
          onClick={this.handleClick}
          title={docTitle}
          lastUpdated={updated}
          renderSpace={spaceRendered}
          fileType={DOCUMENT_TYPES[resourceType] ? resourceType : undefined}
          fileTypeSrc={DOCUMENT_TYPES[resourceType] && typeof iconSrc === 'undefined' ? undefined : fileIconSrc}
          menuItems={this.getMenuItems()}
          isSelected={this.props.isSelected}
          isSelectable={this.props.isSelectable}
          onSelectionClick={this.toggleSelectDocuments}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          hasBorder={false}
        />
      </div>
    )
  }
}

export default connect((state, props) => {
  return {
    projectsEnabled: state.account.userV2.flags.spaceProjectsEnabled,
    selectedDocumentsRange: !props.isInSpace ? selectedDocumentsRange(state) : selectedSpaceDocumentsRange(state)
  }
})(TileContainer)
