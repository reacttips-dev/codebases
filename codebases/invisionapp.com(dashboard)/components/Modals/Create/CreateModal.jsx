import React from 'react'
import PropTypes from 'prop-types'

import { IconButton, Icon, Tooltip } from '@invisionapp/helios-one-web'
import forEach from 'lodash/forEach'
import findIndex from 'lodash/findIndex'

import { BOARD, FREEHAND, RHOMBUS, PROTOTYPE, SPEC } from '../../../constants/DocumentTypes'
import PrototypeTypes from '../../../constants/PrototypeTypes'
import { trackEvent } from '../../../utils/analytics'
import sanitizeName from '../../../utils/sanitizeName'

import ChooseTools from './ChooseTools.jsx'
import CreateFreehand from './CreateFreehand.jsx'
import CreateProject from './CreateProject.jsx'
import CreateSpace from './CreateSpace.jsx'
import CreateSpec from './CreateSpec'
import DownloadTools from './DownloadTools.jsx'
import NewBoardTypeSelection from './NewBoardTypeSelection.jsx'
import NewPrototypeTypeSelection from './NewPrototypeTypeSelection.jsx'

import modalStyles from '../../../css/modal.css'
import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/new-project.css'

const DEFAULT_STAGGER_TIME = 50
const MODAL_BACKDROP_ENTER_TIME = 150
const PROJECT_NAME_MAX_LENGTH = 100
const SUBVIEW_UNMOUNT_TIME = 150
const SUBVIEW_BOARD_TYPES_UNMOUNT_TIME = 250
const SUBVIEW_PROTOTYPE_TYPES_UNMOUNT_TIME = 450

class CreateModal extends React.Component {
  constructor (props) {
    super(props)

    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleCreatePrototype = this.handleCreatePrototype.bind(this)
    this.handleCreateRhombus = this.handleCreateRhombus.bind(this)
    this.handleCreateFreehand = this.handleCreateFreehand.bind(this)
    this.handleCreateSpace = this.handleCreateSpace.bind(this)
    this.handleCreateSpec = this.handleCreateSpec.bind(this)
    this.handleCreateBoard = this.handleCreateBoard.bind(this)
    this.handleSwitchPrototypeType = this.handleSwitchPrototypeType.bind(this)
    this.handleSwitchBoardType = this.handleSwitchBoardType.bind(this)
    this.handleNameFocus = this.handleNameFocus.bind(this)
    this.handleNameBlur = this.handleNameBlur.bind(this)
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this)
    this.handleSwitchSubviews = this.handleSwitchSubviews.bind(this)
    this.startUnmounting = this.startUnmounting.bind(this)
    this.animateInComponents = this.animateInComponents.bind(this)
    this.animateOutComponents = this.animateOutComponents.bind(this)

    this.state = {
      subview: '',
      fadingSubview: '',
      projectName: '',
      prototypeType: 'Desktop',
      boardType: 'masonry',
      sampleType: ''
    }
  }

  componentDidMount () {
    if (this.refs.modalBackdrop) {
      this.refs.modalBackdrop.classList.add(animationStyles[`${this.refs.modalBackdrop.dataset.animation}-in`])
    }

    // Set analytics context
    if (this.props.space.cuid) {
      const analyticsContext = {
        space: {
          cuid: this.props.space.cuid,
          isPublic: this.props.space.isPublic
        }
      }
      this.props.actions.analyticsSetContext(analyticsContext)
    }

    setTimeout(() => {
      this.animateInComponents(this.getRefs(this, 'main'), 0)

      setTimeout(() => {
        this.setState({
          subview: this.props.createModal.subview
        })
      }, DEFAULT_STAGGER_TIME)
    }, MODAL_BACKDROP_ENTER_TIME)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.willUnmount && !this.props.willUnmount) {
      this.startUnmounting()
    }
  }

  componentWillUnmount () {
    this.props.actions.createModalReset()
  }

  getRefs (self, match) {
    var refs = []

    forEach(self.refs, (ref, key) => {
      if (key.indexOf(match) !== -1) {
        refs.push(ref)
      }
    })

    return refs
  }

  handleKeydown (e, nameInput) {
    var regex = new RegExp('^[a-zA-Z0-9-+]+$')
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode)

    if (regex.test(key)) {
      nameInput.focus()
    }
  }

  handleCreatePrototype (isAdvanced) {
    const sanitizeOptions = {
      doTrimTrailingSpaces: true,
      maxLength: PROJECT_NAME_MAX_LENGTH
    }
    var newProject = {}
    var typeIndex = findIndex(PrototypeTypes.PROTOTYPE_TYPES, (type) => {
      return type.stub === this.state.prototypeType
    })
    var type = PrototypeTypes.PROTOTYPE_TYPES[typeIndex]

    newProject.name = sanitizeName(this.state.projectName, sanitizeOptions)
    newProject.isAdvanced = !!isAdvanced
    newProject.isMobile = !!type.device.isMobile
    newProject.mobileDeviceID = type.device.id

    if (this.props.space.cuid) {
      newProject.spaceCUID = this.props.space.cuid
    }

    this.props.serverActions.createDocument.request(PROTOTYPE, newProject, this.props.projectId)
  }

  handleCreateFreehand () {
    let newProject = {}
    newProject.title = this.state.projectName
    newProject.isOnboarding = this.props.createModal.isOnboarding
    if (this.props.space.cuid) {
      newProject.spaceCUID = this.props.space.cuid
    }

    this.props.serverActions.createDocument.request(FREEHAND, newProject, this.props.projectId)
  }

  handleCreateSpec () {
    let newProject = {}
    newProject.title = this.state.projectName
    if (this.props.space.cuid) {
      newProject.spaceCUID = this.props.space.cuid
    }

    this.props.serverActions.createDocument.request(SPEC, newProject, this.props.projectId)
  }

  handleCreateRhombus () {
    let newProject = {}
    let event = { createdFrom: this.props.filters.viewType === 'documents' ? 'DocsTab' : 'Home' }
    newProject.title = this.state.projectName ? this.state.projectName : 'Untitled'
    if (this.props.space.cuid) {
      newProject.spaceCUID = this.props.space.cuid
      event.spaceCUID = this.props.space.cuid
    }

    event.name = this.state.projectName

    trackEvent('App.Rhombus.Created', event)

    this.props.actions.trackCreateClick('createRhombus')
    this.props.serverActions.createDocument.request(RHOMBUS, newProject, this.props.projectId)
  }

  handleCreateSpace () {
    const sanitizeOptions = {
      doTrimTrailingPeriods: true,
      doTrimTrailingSpaces: true,
      maxLength: PROJECT_NAME_MAX_LENGTH
    }

    const title = sanitizeName(this.state.projectName, sanitizeOptions)
    const isPublic = this.props.createModal.isPublic

    // Conditionally for sidebar users, we must request for the members and permissions to be included
    // in the server response, as those are used in the spaces list
    this.props.serverActions.createSpace.request({
      title,
      isPublic
    })
  }

  handleCreateBoard () {
    var newProject = {}
    let event = {}

    newProject.title = this.state.projectName
    newProject.description = ''
    if (this.props.space.cuid) {
      newProject.spaceId = this.props.space.cuid
      newProject.spaceCUID = this.props.space.cuid
      event.spaceCUID = this.props.space.cuid
    }

    switch (this.state.boardType) {
      case 'meticulous':
        newProject.layoutTypeID = 2
        break
      case 'grid':
        newProject.layoutTypeID = 3
        break
      case 'masonry':
      default:
        newProject.layoutTypeID = 1
        break
    }
    event.boardType = newProject.layoutTypeID || null

    trackEvent('App.Board.Created', event)
    this.props.serverActions.createDocument.request(BOARD, newProject, this.props.projectId)
  }

  handleSwitchPrototypeType (type) {
    this.setState({
      prototypeType: type
    })
  }

  handleSwitchBoardType (type) {
    this.setState({
      boardType: type
    })
  }

  handleNameFocus (event) {
    event.target.placeholder = ''

    if (event.target.parentNode.classList.contains(styles.hasInput) && !!event.target.value) {
      event.target.parentNode.classList.remove(styles.hasInput)
    }
  }

  handleNameBlur (event) {
    if (event.target.value === '' && !event.target.parentNode.classList.contains(styles.hasInput)) {
      event.target.parentNode.classList.add(styles.hasInput)
    }
  }

  handleProjectNameChange (event, name) {
    if (this.props.createModal.error) {
      this.props.actions.createModalRemoveError()
    }

    if (event.target.value) {
      event.target.parentNode.classList.remove(styles.hasInput)
    } else {
      event.target.parentNode.classList.add(styles.hasInput)
    }

    // Sanitize project name
    const projectName = sanitizeName(event.target.value, PROJECT_NAME_MAX_LENGTH)
    // projectName = emojiStrip(projectName);

    this.setState({
      projectName
    })
  }

  handleSwitchSubviews (subview) {
    var subviewDelay = SUBVIEW_UNMOUNT_TIME

    if (this.state.subview === 'prototypeTypes') {
      subviewDelay = SUBVIEW_PROTOTYPE_TYPES_UNMOUNT_TIME
    }

    if (this.state.subview === 'boardTypes') {
      subviewDelay = SUBVIEW_PROTOTYPE_TYPES_UNMOUNT_TIME
    }

    if (subview === 'createRhombus') {
      this.handleCreateRhombus()
      return
    }

    this.props.actions.createModalRemoveError()
    this.props.actions.trackCreateClick(subview)

    this.setState({
      subview: '',
      fadingSubview: this.state.subview,
      projectName: ''
    })

    setTimeout(() => {
      if (!this.props.willUnmount) {
        this.setState({
          subview: subview,
          fadingSubview: ''
        })
      }
    }, subviewDelay)
  }

  startUnmounting () {
    var mainComponents = this.getRefs(this, 'main')
    var subviewDelay = SUBVIEW_UNMOUNT_TIME

    if (this.state.subview === 'prototypeTypes') {
      subviewDelay = SUBVIEW_PROTOTYPE_TYPES_UNMOUNT_TIME
    }

    if (this.state.subview === 'prototypeTypes') {
      subviewDelay = SUBVIEW_BOARD_TYPES_UNMOUNT_TIME
    }

    if (this.state.subview !== '') {
      this.setState({
        subview: '',
        fadingSubview: this.state.subview
      })
    }

    setTimeout(() => {
      this.animateOutComponents(mainComponents, mainComponents.length - 1)

      setTimeout(() => {
        if (this.refs.modalBackdrop) {
          this.refs.modalBackdrop.classList.add(animationStyles[`${this.refs.modalBackdrop.dataset.animation}-out`])
        }
      }, 300)
    }, subviewDelay)
  }

  animateInComponents (components, index) {
    if (index < components.length && !this.props.willUnmount) {
      components[index].classList.remove(animationStyles[`${components[index].dataset.animation}-out`])
      components[index].classList.add(animationStyles[`${components[index].dataset.animation}-in`])

      setTimeout(() => {
        this.animateInComponents(components, index + 1)
      }, DEFAULT_STAGGER_TIME)
    }
  }

  animateOutComponents (components, index) {
    if (index >= 0) {
      if (components[index].classList.contains(animationStyles[`${components[index].dataset.animation}-in`])) {
        components[index].classList.remove(animationStyles[`${components[index].dataset.animation}-in`])
        components[index].classList.add(animationStyles[`${components[index].dataset.animation}-out`])
      }

      setTimeout(() => {
        this.animateOutComponents(components, index - 1)
      }, DEFAULT_STAGGER_TIME)
    }
  }

  getOnboardingRole () {
    const defaultRole = 'Designer'
    const onboarding = this.props.account.user.onboarding

    if (onboarding && onboarding.role) {
      return onboarding.role
    }

    return defaultRole
  }

  render () {
    const { isCreating } = this.props.createModal

    return (
      <div>
        <div
          ref='modalBackdrop'
          data-animation='fade'
          className={`${modalStyles.backdrop} ${modalStyles.fullScreen}`}
        />

        <div className={`${styles.modalContent} ${modalStyles.content} ${modalStyles.fullScreen}`}>

          <div
            className={styles.close}
            ref='main3'
            data-animation='fade'
          >
            <Tooltip
              placement='bottom-left'
              tabIndex={-1}
              trigger={(
                <IconButton as='button' onClick={this.props.handleCancelModal} size='32' alt='Close this modal'>
                  <Icon name='Close' size='24' alt='' color='surface-100' />
                </IconButton>
              )}
            >
              Close
            </Tooltip>
          </div>

          {
            (this.state.fadingSubview === 'projectTypes' || this.state.subview === 'projectTypes') && (
              <CreateProject
                canCreateDocuments={this.props.account.user.permissions.createDocuments}
                canCreateSpaces={this.props.account.user.permissions.createSpaces}
                documentPermissions={this.props.account.permissions.create}
                hasSpaces={this.props.hasSpaces}
                isHiding={this.state.fadingSubview === 'projectTypes'}
                onboardingRole={this.getOnboardingRole()}
                onClose={this.props.handleCancelModal}
                onOptionClick={this.handleSwitchSubviews}
                showStudio={!this.props.config.hideStudioinOnboarding}
                showSpec={this.props.config.specsEnabled && this.props.config.specsGaRelease}
              />
            )
          }
          {
            (this.state.fadingSubview === 'createSpace' || this.state.subview === 'createSpace') &&
            (<CreateSpace
              subview={this.state.subview}
              projectName={this.state.projectName}
              handleSwitchSubviews={this.handleSwitchSubviews}
              handleNameFocus={this.handleNameFocus}
              handleNameBlur={this.handleNameBlur}
              handleProjectNameChange={this.handleProjectNameChange}
              handleKeydown={this.handleKeydown}
              handleCreateSpace={this.handleCreateSpace}
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              isCreating={isCreating}
              getRefs={this.getRefs}
              {...this.state}
              {...this.props}
            />)
          }
          {
            (this.state.fadingSubview === 'createFreehand' || this.state.subview === 'createFreehand') &&
            (<CreateFreehand
              subview={this.state.subview}
              projectName={this.state.projectName}
              handleSwitchSubviews={this.handleSwitchSubviews}
              handleNameFocus={this.handleNameFocus}
              handleNameBlur={this.handleNameBlur}
              handleProjectNameChange={this.handleProjectNameChange}
              handleKeydown={this.handleKeydown}
              handleCreateFreehand={this.handleCreateFreehand}
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              getRefs={this.getRefs}
              isCreating={isCreating}
              {...this.state}
              {...this.props}
            />)
          }
          {
            (this.state.fadingSubview === 'createSpec' || this.state.subview === 'createSpec') &&
            (<CreateSpec
              subview={this.state.subview}
              projectName={this.state.projectName}
              handleSwitchSubviews={this.handleSwitchSubviews}
              handleNameFocus={this.handleNameFocus}
              handleNameBlur={this.handleNameBlur}
              handleProjectNameChange={this.handleProjectNameChange}
              handleKeydown={this.handleKeydown}
              handleCreateSpec={this.handleCreateSpec}
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              getRefs={this.getRefs}
              isCreating={isCreating}
              {...this.state}
              {...this.props}
            />)
          }

          {
            (this.state.fadingSubview === 'prototypeTypes' || this.state.subview === 'prototypeTypes') &&
            (<NewPrototypeTypeSelection
              motionEnabled={this.props.featureFlags.enableMotion}
              subview={this.state.subview}
              projectName={this.state.projectName}
              prototypeType={this.state.prototypeType}
              handleSwitchSubviews={this.handleSwitchSubviews}
              handleSwitchPrototypeType={this.handleSwitchPrototypeType}
              handleNameFocus={this.handleNameFocus}
              handleNameBlur={this.handleNameBlur}
              handleProjectNameChange={this.handleProjectNameChange}
              handleKeydown={this.handleKeydown}
              handleCreatePrototype={this.handleCreatePrototype}
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              isCreating={isCreating}
              getRefs={this.getRefs}
              {...this.props}
            />)
          }
          {
            (this.state.fadingSubview === 'boardTypes' || this.state.subview === 'boardTypes') &&
            (<NewBoardTypeSelection
              subview={this.state.subview}
              projectName={this.state.projectName}
              boardType={this.state.boardType}
              handleSwitchSubviews={this.handleSwitchSubviews}
              handleCreateBoard={this.handleCreateBoard}
              handleSwitchBoardType={this.handleSwitchBoardType}
              handleNameFocus={this.handleNameFocus}
              handleNameBlur={this.handleNameBlur}
              handleProjectNameChange={this.handleProjectNameChange}
              handleKeydown={this.handleKeydown}
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              isCreating={isCreating}
              getRefs={this.getRefs}
              {...this.props}
            />)
          }
          {
            (this.state.fadingSubview === 'chooseTools' || this.state.subview === 'chooseTools') &&
            (<ChooseTools
              animateInComponents={this.animateInComponents}
              animateOutComponents={this.animateOutComponents}
              handleSwitchSubviews={this.handleSwitchSubviews}
              getRefs={this.getRefs}
              showStudio={!this.props.config.hideStudioinOnboarding}
              {...this.props}
            />)
          }
          {
            (this.state.fadingSubview === 'downloadStudio' || this.state.subview === 'downloadStudio' ||
             this.state.fadingSubview === 'downloadCraft' || this.state.subview === 'downloadCraft') &&
            (<DownloadTools tool={this.state.subview} />)
          }
        </div>

      </div>
    )
  }
}

CreateModal.defaultProps = {
  featureFlags: {
    enableMotion: true
  },
  hasSpaces: false,
  space: {},
  updateSpace: function () {}
}

CreateModal.propTypes = {
  actions: PropTypes.object,
  config: PropTypes.object,
  createModal: PropTypes.object.isRequired,
  featureFlags: PropTypes.object,
  filters: PropTypes.object,
  handleCancelModal: PropTypes.func.isRequired,
  hasRhombus: PropTypes.bool.isRequired,
  hasSpaces: PropTypes.bool.isRequired,
  serverActions: PropTypes.object,
  spaceCUID: PropTypes.string,
  updateSpace: PropTypes.func,
  user: PropTypes.object,
  viewType: PropTypes.string,
  willUnmount: PropTypes.bool
}

export default CreateModal
