import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import cx from 'classnames'
import { Box, Text, Button, Icon, Action } from '@invisionapp/helios-one-web'
import find from 'lodash/find'

import PrototypeTypes from '../../../constants/PrototypeTypes'
import NameInput from './NameInput'

import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/new-project.css'

class NewPrototypeTypeSelection extends React.Component {
  constructor (props) {
    super(props)

    this.getAnimateClass = this.getAnimateClass.bind(this)
    this.getActiveClass = this.getActiveClass.bind(this)
    this.handleCreatePrototype = this.handleCreatePrototype.bind(this)
    this.renderTypes = this.renderTypes.bind(this)
    this.getType = this.getType.bind(this)
    this.handleHover = this.handleHover.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)

    this.state = {
      isHovered: null
    }
  }

  componentDidMount () {
    var components = this.props.getRefs(this, 'prototypeTypes')
    this.props.animateInComponents(components, 0)

    setTimeout(() => {
      [this.refs.backButton, this.refs.advancedToggle].forEach((ref) => {
        var elem = ReactDOM.findDOMNode(ref)

        if (elem) {
          elem.classList.remove(animationStyles[`${elem.dataset.animation}-out`])
          elem.classList.add(animationStyles[`${elem.dataset.animation}-in`])
        }
      })
    }, 100)
  }

  componentWillReceiveProps (newProps) {
    var components = this.props.getRefs(this, 'prototypeTypes')
    if (newProps.subview === 'prototypeTypes') {
      this.props.animateInComponents(components, 0)
    } else {
      this.props.animateOutComponents(components, components.length - 1)

      setTimeout(() => {
        [this.refs.backButton, this.refs.advancedToggle, this.refs.advancedIcon].forEach((ref) => {
          var elem = ReactDOM.findDOMNode(ref)

          if (elem) {
            elem.classList.remove(animationStyles[`${elem.dataset.animation}-in`])
            elem.classList.add(animationStyles[`${elem.dataset.animation}-out`])
          }
        })
      }, 100)
    }
  }

  getAnimateClass (type) {
    var node = this.refs['prototypeTypes-' + type]
    var className = ''

    if (node && node.classList.contains(animationStyles[node.dataset.animation + '-in'])) {
      className = animationStyles[node.dataset.animation + '-in']
    }

    return className
  }

  getActiveClass (type) {
    return (this.props.prototypeType === type
      ? `${styles.prototypeType} ${this.getAnimateClass(type)}`
      : `${this.getAnimateClass(type)}`)
  }

  setActiveStyling (type) {
    if (type === this.props.prototypeType) {
      return `${styles.activePrototypeContainer}`
    }
  }

  getType () {
    if (this.props.subview === 'prototypeTypes') {
      return 'Prototype'
    }
  }

  handleCreatePrototype () {
    if (this.props.projectName.length === 0) {
      this.props.actions.createModalFail({
        element: 'name',
        title: 'Hang Tight',
        description: `Every ${this.getType()} needs a name`,
        className: 'no-name'
      })

      document.querySelector('#name-your-prototype').focus()
    } else {
      this.props.handleCreatePrototype(false)
    }
  }

  handleHover (e) {
    this.setState({ isHovered: e })
  }
  handleMouseLeave (e) {
    if (this.state.isHovered === e) {
      this.setState({ isHovered: null })
    }
  }

  renderTypes () {
    let typesArray = ['Desktop', 'IPhoneX', 'IPhone', 'AndroidPhone', 'IPad', 'AndroidTablet', 'AppleWatch', 'AndroidWatch']

    const typeContent = typesArray.map((type) => {
      const typeDetails = find(PrototypeTypes.PROTOTYPE_TYPES, (t) => {
        return t.stub === type
      })

      return (
        <li
          key={'prototypeTypes-' + type}
        >
          <Action
            as='button'
            onClick={this.props.handleSwitchPrototypeType.bind(null, type)}
            className={`${styles.prototypeType} ${this.getActiveClass(type)}`}
            aria-pressed={this.props.prototypeType === type}
            ref={'prototypeTypes-' + type}
            key={'prototypeTypes-' + type}
            data-animation='slide'
            onMouseOver={this.handleHover.bind(null, type)}
            onFocus={this.handleHover.bind(null, type)}
            onMouseLeave={this.handleMouseLeave.bind(null, type)}
          >
            <div className={`${styles.prototypeTypeContainer} ${this.setActiveStyling(type)}`}>
              <div className={cx(styles.iconContainer, { [styles.iconUnhovered]: this.props.prototypeType !== type && this.state.isHovered !== type })}>
                <div className={`${styles.test} ${styles[`${type.toLowerCase()}-icon`]} ${styles.prototypeTypeIcon} ${this.props.prototypeType === type ? styles.prototypeTypeIconActive : ''}`} />
              </div>
              <div>
                <Text size='body-16' className={styles.prototypeTypeName}>
                  {typeDetails.name}
                  {this.props.prototypeType === type && <Icon name='Check' size='24' color='primary-100' />}
                </Text>
              </div>
            </div>
          </Action>
        </li>
      )
    })

    return typeContent
  }

  render () {
    var types = this.renderTypes()

    const buttonStyle = {}

    if (this.props.projectName.length === 0) {
      buttonStyle.backgroundColor = '#c6ccd7'
    }

    return (
      <div className={`${styles.root} ${styles.protoroot}`}>
        <Box spacing='32' alignItems='center' justifyContent='center' flexDirection='col'>
          <div ref='prototypeTypes-name' data-animation='slide' className={styles.animateIn}>
            <NameInput
              {...this.props}
              handleCreateDocument={this.handleCreatePrototype}
              title={'Create new prototype'}
              placeholder='Name your prototype'
              label='Name your prototype'
              id='name-your-prototype'
            />
          </div>
          <ul className={styles.prototypeTypes}>
            {types}
          </ul>
          <div
            className={styles.buttonWrap}
            data-animation='slide'
            ref='prototypeTypes-GetStarted'>
            <Button
              id='btn-create-prototype'
              order='primary'
              size='48'
              as='button'
              role='button'
              type='button'
              disabled={this.props.projectName.length === 0 || this.props.isCreating}
              className={styles.button}
              onClick={this.handleCreatePrototype}
              aria-live='polite'>
              { this.props.isCreating ? 'Creating...' : 'Create' }
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

NewPrototypeTypeSelection.propTypes = {
  actions: PropTypes.object,
  handleSwitchPrototypeType: PropTypes.func.isRequired,
  handleSwitchSubviews: PropTypes.func.isRequired,
  willUnmount: PropTypes.bool,
  motionEnabled: PropTypes.bool,
  subview: PropTypes.string.isRequired,
  animateInComponents: PropTypes.func.isRequired,
  animateOutComponents: PropTypes.func.isRequired,
  getRefs: PropTypes.func.isRequired,
  prototypeType: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  handleNameFocus: PropTypes.func.isRequired,
  handleNameBlur: PropTypes.func.isRequired,
  handleProjectNameChange: PropTypes.func.isRequired,
  handleKeydown: PropTypes.func.isRequired,
  handleCreatePrototype: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  isCreating: PropTypes.bool
}

export default NewPrototypeTypeSelection
