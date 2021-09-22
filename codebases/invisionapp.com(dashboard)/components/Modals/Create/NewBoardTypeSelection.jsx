import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Box, Button } from '@invisionapp/helios-one-web'

import NameInput from './NameInput'

import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/new-project.css'

class NewBoardTypeSelection extends React.Component {
  constructor (props) {
    super(props)

    this.getAnimateClass = this.getAnimateClass.bind(this)
    this.getActiveClass = this.getActiveClass.bind(this)
    this.handleCreateBoard = this.handleCreateBoard.bind(this)
  }

  componentDidMount () {
    var components = this.props.getRefs(this, 'boardTypes')
    this.props.animateInComponents(components, 0)
    setTimeout(() => {
      [this.refs.backButton].forEach((ref) => {
        var elem = ReactDOM.findDOMNode(ref)

        if (elem) {
          elem.classList.remove(animationStyles[`${elem.dataset.animation}-out`])
          elem.classList.add(animationStyles[`${elem.dataset.animation}-in`])
        }
      })
    }, 100)
  }

  componentWillReceiveProps (newProps) {
    var components = this.props.getRefs(this, 'boardTypes')
    if (newProps.subview === 'boardTypes') {
      this.props.animateInComponents(components, 0)
    } else {
      this.props.animateOutComponents(components, components.length - 1)

      setTimeout(() => {
        [this.refs.backButton].forEach((ref) => {
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
    var node = this.refs['boardTypes-' + type]
    var className = ''

    if (node && node.classList.contains(animationStyles[node.dataset.animation + '-in'])) {
      className = animationStyles[node.dataset.animation + '-in']
    }

    return className
  }

  getActiveClass (type) {
    return (this.props.boardType === type
      ? `${styles.boardType} ${this.getAnimateClass(type)}`
      : `${this.getAnimateClass(type)}`)
  }

  handleCreateBoard () {
    if (this.props.projectName.length === 0) {
      this.props.actions.createModalFail({
        element: 'name',
        title: 'Hang tight',
        description: 'Every board needs a name.',
        className: 'no-name'
      })
      document.querySelector('#name-your-board').focus()
    } else {
      this.props.handleCreateBoard()
    }
  }

  render () {
    return (
      <div className={styles.root}>
        <Box spacing='32' flexDirection='col' alignItems='center' justifyContent='center'>
          <div ref='boardTypes-name' data-animation='slide' className={styles.animateIn}>
            <NameInput
              {...this.props}
              handleCreateDocument={this.handleCreateBoard}
              title='Create new board'
              placeholder='Name your board'
              label='Name your board'
              id='name-your-board'
            />
          </div>
          <div
            className={styles.buttonWrap}
            data-animation='slide'
            ref='boardTypes-GetStarted'>
            <Button
              id='btn-create-board'
              order='primary'
              size='48'
              role='button'
              as='button'
              type='button'
              disabled={this.props.projectName.length === 0 || this.props.isCreating}
              className={styles.button}
              onClick={this.handleCreateBoard}
              aria-live='polite'>
              {this.props.isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

NewBoardTypeSelection.propTypes = {
  actions: PropTypes.object,
  handleSwitchBoardType: PropTypes.func.isRequired,
  handleSwitchSubviews: PropTypes.func.isRequired,
  handleCreateBoard: PropTypes.func.isRequired,
  willUnmount: PropTypes.bool,
  subview: PropTypes.string.isRequired,
  animateInComponents: PropTypes.func.isRequired,
  animateOutComponents: PropTypes.func.isRequired,
  getRefs: PropTypes.func.isRequired,
  boardType: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  handleNameFocus: PropTypes.func.isRequired,
  handleNameBlur: PropTypes.func.isRequired,
  handleProjectNameChange: PropTypes.func.isRequired,
  handleKeydown: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  isCreating: PropTypes.bool
}

export default NewBoardTypeSelection
