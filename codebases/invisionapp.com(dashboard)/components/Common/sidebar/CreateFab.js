import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Fab, Modal, Text, Link, Button, Adjacent, Align, Rule, DocumentIcon } from '@invisionapp/helios'
import { Prototype, Freehand, Boards, Rhombus, Spaces, Plus, Spec, Documents } from '@invisionapp/helios/icons'
import { navigate } from '../../../utils/navigation'
import { trackEvent } from '../../../utils/analytics'
import getFreehandTemplateId from '../../../utils/getFreehandTemplateId'

import {
  BOARD,
  FREEHAND,
  FREEHAND_ONLY,
  PROTOTYPE,
  RHOMBUS,
  SPEC,
  NO_DOC_CREATION,
  RHOMBUS_NAME,
  HARMONY
} from '../../../constants/DocumentTypes'

import {
  FILTER_ALL
} from '../../../constants/FilterTypes'

import styles from '../../../css/home/sidebar/create-fab.css'
import { APP_CREATE_SELECTED } from '../../../constants/TrackingEvents'

const MenuItem = props => (
  <button
    onClick={props.onClick}
    className={styles['menu-item']}>
    <div className={styles['menu-icon-wrap']}>
      <props.icon />
    </div>
    <div className={styles['menu-item-text']}>
      <Adjacent>
        <Text order='subtitle' size='smallest' className={styles['menu-item-text-title']}>{props.title}</Text>
        {
          props.titleTag &&
          <div className={styles.titleTag}>
            <Text className={styles.tagText} allign='center' order='label' size='smallest'>
              {props.titleTag}
            </Text>
          </div>
        }

      </Adjacent>
      <Text order='body' size='smallest' color='text-lighter'>{props.subtitle}</Text>
    </div>
  </button>
)

export const getCtaGroupItems = ({ createDocumentMenuItems, addDocumentMenuItems, addDocoumentMenuClassName, freehandOnly }) => {
  let ctaGroupItems = []

  if (addDocumentMenuItems && addDocumentMenuItems.length > 1) {
    ctaGroupItems.push({
      label: 'Add',
      buttonOffset: 0,
      menuItems: addDocumentMenuItems,
      order: 'secondary',
      disableIcon: true,
      menuClassName: addDocoumentMenuClassName
    })
  }

  if (createDocumentMenuItems && createDocumentMenuItems.length > 0) {
    ctaGroupItems.push({
      label: 'Create',
      buttonOffset: 0,
      menuItems: createDocumentMenuItems,
      order: 'primary'
    })
  // Freehand only seats are treated in a specific way
  } else if (freehandOnly) {
    ctaGroupItems.push({
      label: 'Create Freehand',
      buttonOffset: 0,
      menuItems: [],
      order: 'primary',
      onClick: freehandOnly.onClick
    })
  }

  return ctaGroupItems
}

const iconNameMap = {
  teamMeeting: 'Symbols.Collaboration.svg',
  brainstorm: 'Symbols.Innovation.svg',
  projectKickoff: 'Travel%20%26%20Places.Rocket.svg',
  boardTypes: 'Design%20%26%20Development.Collage.svg',
  roadmap: 'Objects.Map.svg',
  prototypeTypes: 'Symbols.NUI.svg',
  createSpec: 'Design%20%26%20Development.Code1.svg'
}
export const getTemplatesFabMenuItems = ({
  createPermissions,
  handleCreateNewModal,
  handleOpenTemplateGallery,
  isInProject,
  isInSpace,
  projectId,
  specsEnabled,
  spaceId
}) => {
  const menuItems = []
  const iconUriRoot = 'https://static.invisionapp-cdn.com/global/icons/documents/personalized/v1/'
  const linkToFreehandTemplate = (templateId) => {
    const newFHBaseURI = '/freehand/new'
    trackEvent(APP_CREATE_SELECTED, {
      documentType: 'freehand',
      template: templateId,
      createContext: getCreateContext()
    })
    navigate(`${newFHBaseURI}?template=${templateId}&name=Untitled${spaceId ? `&spaceId=${spaceId}` : ''}${projectId ? `&projectId=${projectId}` : ''}`)
  }

  const getCreateContext = () => {
    return (isInProject) ? 'projectDocuments' : (isInSpace) ? 'spaceDocuments' : 'documents'
  }

  if (createPermissions[FREEHAND]) {
    menuItems.push({
      title: 'Create a blank Freehand',
      subtitle: (<div className={styles.menuItemDescriptionText}>Co-draw wireframe and present in real time all with an infinite whiteboard</div>),
      icon: <DocumentIcon size='32' documentType='freehand' />,
      onClick: () => { linkToFreehandTemplate(getFreehandTemplateId('blank')) }
    })
    // Template Section

    // Template Header
    menuItems.push((<div style={{ display: 'flex' }}>
      <Text order='subtitle' size='smaller'>Templates</Text>
      <div className={styles.viewAllLink}><Link onClick={() => {
        handleOpenTemplateGallery && handleOpenTemplateGallery()
      }} role='link'>View all</Link></div>
    </div>))

    // Templates

    menuItems.push({
      title: 'Team Meeting',
      subtitle: (<div className={styles.menuItemDescriptionText}>Plan an upcoming meeting with defined goals and desired outcomes</div>),
      icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['teamMeeting']}`} />),
      onClick: () => { linkToFreehandTemplate(getFreehandTemplateId('teamMeeting')) }
    })

    menuItems.push({
      title: 'Brainstorm',
      subtitle: (<div className={styles.menuItemDescriptionText}>Get the whole team involved and brainstorm with an infinite whiteboard</div>),
      icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['brainstorm']}`} />),

      onClick: () => { linkToFreehandTemplate(getFreehandTemplateId('brainstorm')) }
    })

    menuItems.push({
      title: 'Project kickoff',
      subtitle: (<div className={styles.menuItemDescriptionText}>Invite all the stakeholders in and document requirements and objectives</div>),
      icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['projectKickoff']}`} />),
      onClick: () => { linkToFreehandTemplate(getFreehandTemplateId('projectKickoff')) }
    })

    if (createPermissions[BOARD]) {
      menuItems.push({
        title: 'Boards',
        subtitle: (<div className={styles.menuItemDescriptionText}>Curate a mood board, design story, or collection of project progress</div>),
        icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['boardTypes']}`} />),
        onClick: () => { handleCreateNewModal('boardTypes') }
      })
    }

    menuItems.push({
      title: 'Roadmap',
      subtitle: (<div className={styles.menuItemDescriptionText}>Create a collaborative roadmap where everyone can contribute</div>),
      icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['roadmap']}`} />),
      onClick: () => {
        linkToFreehandTemplate(getFreehandTemplateId('roadmap'))
      }
    })

    if (createPermissions[PROTOTYPE]) {
      menuItems.push({
        title: 'Prototype',
        subtitle: (<div className={styles.menuItemDescriptionText}>Create an interactive web or mobile experience</div>),
        icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['prototypeTypes']}`} />),
        onClick: () => { handleCreateNewModal('prototypeTypes') }
      })
    }

    if (specsEnabled && createPermissions[SPEC]) {
      menuItems.push({
        title: 'Spec',
        subtitle: (<div className={styles.menuItemDescriptionText}>Hand-off designs for development</div>),
        icon: (<img className={styles.templateIcons} src={`${iconUriRoot}${iconNameMap['createSpec']}`} />),
        onClick: () => { handleCreateNewModal('createSpec') }
      })
    }
  }

  return menuItems
}

export const getFabMenuItems = ({
  createPermissions,
  createSpaces,
  handleAddExistingModal,
  handleCreateNewModal,
  handleCreateNewProject,
  handleCreateRhombus,
  handleCreateStudio,
  isInProject,
  isInSpace,
  projectsEnabled,
  rhombusEnabled,
  specsEnabled,
  showAddToSpaces,
  studioWebEnabled
}) => {
  const canCreateDocuments = Object.keys(createPermissions).filter(cp => createPermissions[cp]).length > 0
  if (!canCreateDocuments && !createSpaces) return []

  const createSpaceHeader = <Align horizontal='space-between'>
    <span>Create new</span>
    {showAddToSpaces && (
      <Link role='link' className={styles.addExisting} onClick={handleAddExistingModal}>
        Add existing
      </Link>)
    }</Align>

  // The order is required:
  // 1. Prototypes
  // 2. Freehand
  // 3. Boards
  // 4. Docs (if enabled)
  // 5. Specs (if enabled)
  const menuItems = [
    createSpaceHeader
  ]

  // prototypes
  if (createPermissions[PROTOTYPE]) {
    menuItems.push({
      title: 'Prototype',
      subtitle: 'Create an interactive web or mobile experience',
      icon: <DocumentIcon size='32' documentType='prototype' />,
      onClick: () => { handleCreateNewModal('prototypeTypes') }
    })
  }

  // freehands
  if (createPermissions[FREEHAND]) {
    menuItems.push({
      title: 'Freehand',
      subtitle: 'Co-draw, wireframe, and present in real time',
      icon: <DocumentIcon size='32' documentType='freehand' />,
      onClick: () => { handleCreateNewModal('createFreehand') }
    })
  }

  // boards
  if (createPermissions[BOARD]) {
    menuItems.push({
      title: 'Board',
      subtitle: 'Curate a mood board, design story, or collection',
      icon: <DocumentIcon size='32' documentType='board' />,
      onClick: () => { handleCreateNewModal('boardTypes') }
    })
  }

  // studio
  if (studioWebEnabled && createPermissions[HARMONY]) {
    menuItems.push({
      title: 'Design',
      subtitle: 'Create a high fidelity design or prototype',
      icon: <DocumentIcon size='32' documentType='harmony' />,
      onClick: () => { handleCreateStudio() }
    })
  }

  // rhombus
  if (rhombusEnabled && createPermissions[RHOMBUS]) {
    menuItems.push({
      title: 'Doc',
      subtitle: 'Combine text and visuals in one document',
      icon: <DocumentIcon size='32' documentType='rhombus' />,
      onClick: () => { handleCreateRhombus() }
    })
  }

  // specs
  if (specsEnabled && createPermissions[SPEC]) {
    menuItems.push({
      title: 'Spec',
      subtitle: 'Hand-off final designs for development',
      icon: <DocumentIcon size='32' documentType='spec' />,
      onClick: () => { handleCreateNewModal('createSpec') }
    })
  }

  if (!isInSpace && createSpaces) {
    if (canCreateDocuments) {
      menuItems.push(<div>Get organized</div>)
    }

    menuItems.push({
      title: 'Space',
      subtitle: 'Group documents into a hub for your project',
      icon: <DocumentIcon size='32' documentType='space' />,
      onClick: () => { handleCreateNewModal('createSpace') }
    })
  }

  if (isInSpace && createSpaces && projectsEnabled && !isInProject) {
    if (canCreateDocuments) {
      menuItems.push(<div>Get organized</div>)
    }

    menuItems.push({
      title: 'Project',
      subtitle: 'Group documents together within your space',
      icon: <DocumentIcon size='32' documentType='project' />,
      onClick: () => { handleCreateNewProject() }
    })
  }

  let message
  if (canCreateDocuments && !createPermissions[PROTOTYPE] && !createPermissions[BOARD] && !createPermissions[SPEC]) {
    message = FREEHAND_ONLY
  } else if (canCreateDocuments && !createPermissions[PROTOTYPE] && !createPermissions[BOARD]) {
    message = NO_DOC_CREATION
  }

  if (message) {
    menuItems.push(<div className={styles.noCreateWrap}>
      <div className={styles.noCreateInner}>
        <Rule length='100%' color='regular' />
        <div className={styles.noCreateText}>
          <Text
            order='body'
            size='smallest'
            color='text-lighter'>
            {message}
          </Text>
        </div>
      </div>
    </div>)
  }

  return menuItems
}

export const getAddMenuItems = ({
  filterType,
  externalDocConfig,
  showAddExternalDoc,
  skipAddInvisionDocument,
  handleAddInvisionDocument,
  handleAddExternalDocType,
  isInSpaceOrProject,
  enableFreehandXFilteringSorting
}) => {
  const inHomeWithExtDocEntries = (skipAddInvisionDocument && !isInSpaceOrProject && externalDocConfig?.length < 1)
  const inHomeWithAllDocsAndNotShowExtDoc = (filterType !== FILTER_ALL && !showAddExternalDoc && !isInSpaceOrProject)

  if ((!enableFreehandXFilteringSorting && (inHomeWithExtDocEntries || !externalDocConfig || inHomeWithAllDocsAndNotShowExtDoc)) ||
  (enableFreehandXFilteringSorting && externalDocConfig?.length < 1 && !isInSpaceOrProject)) {
    return []
  }

  let addExistingMenuItems = []
  if (!skipAddInvisionDocument) {
    addExistingMenuItems.push({
      title: 'InVision document',
      subtitle: (<div className={styles.menuItemDescriptionText}>Add existing document</div>),
      icon: <Documents size='32' />,
      onClick: handleAddInvisionDocument
    })
  }

  if (externalDocConfig && externalDocConfig.length > 0) {
    externalDocConfig.forEach(extDocTypeGroup => {
      extDocTypeGroup.forEach(extDocType => {
        addExistingMenuItems.push({
          title: extDocType.title,
          subtitle: (<div className={styles.menuItemDescriptionText}>{extDocType.description}</div>),
          icon: <DocumentIcon size='32' src={extDocType.logoSrc} />,
          onClick: handleAddExternalDocType ? handleAddExternalDocType(extDocType.action) : extDocType.action
        })
      })
    })
  }

  return addExistingMenuItems
}

class CreateFab extends PureComponent {
  static propTypes = {
    specsEnabled: PropTypes.bool,
    handleAddExistingModal: PropTypes.func,
    handleCreateNewModal: PropTypes.func,
    handleCreateRhombus: PropTypes.func,
    hasAddExisting: PropTypes.bool,
    hasRhombus: PropTypes.bool,
    isInSpace: PropTypes.bool,
    mqs: PropTypes.object,
    viewType: PropTypes.string
  }

  static defaultProps = {
    isInSpace: false,
    viewType: 'documents'
  }

  state = {
    MODAL_OPEN: false
  }

  handleAddExistingModal = (e) => {
    this.handleClick(e)
    this.props.handleAddExistingModal()
  }

  handleClick = (e) => {
    if (e && e.currentTarget) {
      e.currentTarget.blur()
    }

    if (this.props.viewType && this.props.viewType === 'spaces') {
      this.props.handleCreateNewModal('createSpace')
    } else {
      this.setState(prev => ({
        MODAL_OPEN: !prev.MODAL_OPEN
      }))
    }
  }

  handleClose = () => {
    this.setState({
      MODAL_OPEN: false
    })
  }

  render () {
    const {
      handleCreateNewModal,
      handleCreateRhombus,
      hasRhombus,
      isInSpace,
      hasAddExisting,
      mqs: {
        sDown
      },
      specsEnabled,
      specsGaRelease
    } = this.props
    const { MODAL_OPEN } = this.state
    return (
      <div className={cx(styles.wrap, { [styles.isInSpace]: isInSpace })}>
        {sDown ? (
          <Fab order='primary' className={styles.fab} onClick={this.handleClick} />
        ) : (
          <Button
            order='primary'
            size='larger'
            className={styles.button}
            onClick={this.handleClick}>
            <Plus fill='white' />
            Create
          </Button>
        )}
        <Modal
          open={MODAL_OPEN}
          closeOnEsc
          aria-label='Create new content modal'
          disableAutofocus
          disableEventBubbling={false}
          onRequestClose={this.handleClose}
          className={cx(styles.modal, { [styles.sDownModal]: sDown })}
          maxWidth={320}
        >
          <ul className={styles.menu}>
            <li>
              <Text className={styles.menuTitle} order='label' color='text-darker'>
                <span>Create new</span>
                {hasAddExisting && (
                  <Link role='link' className={styles.addExisting} onClick={this.handleAddExistingModal}>
                    Add existing
                  </Link>
                )}
              </Text>
            </li>
            <li>
              <MenuItem
                icon={Prototype}
                title='Prototype'
                subtitle='Create an interactive web or mobile experience'
                onClick={handleCreateNewModal.bind(this, 'prototypeTypes')}
              />
            </li>
            {specsEnabled &&
              <li>
                <MenuItem
                  icon={Spec}
                  title='Spec'
                  titleTag={specsGaRelease ? 'NEW' : 'BETA'}
                  subtitle='Hand-off final designs for development'
                  onClick={handleCreateNewModal.bind(this, 'createSpec')}
                />
              </li>
            }
            <li>
              <MenuItem
                title='Freehand'
                subtitle='Co-draw, wireframe, and present in real time'
                icon={Freehand}
                onClick={handleCreateNewModal.bind(this, 'createFreehand')}
              />
            </li>
            <li>
              <MenuItem
                title='Board'
                subtitle='Curate a mood board, design story, or collection'
                icon={Boards}
                onClick={handleCreateNewModal.bind(this, 'boardTypes')}
              />
            </li>
            {hasRhombus && (
              <li>
                <MenuItem
                  title={RHOMBUS_NAME}
                  subtitle='Combine text and visuals in one document'
                  icon={Rhombus}
                  onClick={handleCreateRhombus}
                />
              </li>
            )}
            {!isInSpace && (
              <Fragment>
                <li>
                  <Text className={styles.menuTitle} order='label' color='text-darker'>Get organized</Text>
                </li>
                <li>
                  <MenuItem
                    title='Space'
                    subtitle='Group documents into a hub for your project'
                    icon={Spaces}
                    onClick={handleCreateNewModal.bind(this, 'createSpace')}
                  />
                </li>
              </Fragment>
            )}
          </ul>
        </Modal>
      </div>
    )
  }
}

export default CreateFab
