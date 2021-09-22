import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Box, Button } from '@invisionapp/helios-one-web'

import NameInput from './NameInput'

import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/create-space.css'

class CreateFreehand extends React.Component {
  constructor (props) {
    super(props)

    this.onCreateFreehand = this.onCreateFreehand.bind(this)
  }

  componentDidMount () {
    const components = this.props.getRefs(this, 'createFreehand')
    this.props.animateInComponents(components, 0)

    setTimeout(() => {
      const elem = ReactDOM.findDOMNode(this.refs.backButton)

      if (elem) {
        elem.classList.remove(animationStyles[`${elem.dataset.animation}-out`])
        elem.classList.add(animationStyles[`${elem.dataset.animation}-in`])
      }
    }, 100)
  }

  onCreateFreehand () {
    if (this.props.projectName.length === 0) {
      this.props.actions.createModalFail({
        element: 'name',
        title: 'Hang Tight',
        description: 'Every freehand needs a name',
        className: 'no-name'
      })

      document.querySelector('#name-your-freehand').focus()
    } else {
      this.props.handleCreateFreehand()
    }
  }

  componentWillReceiveProps (nextProps) {
    const components = this.props.getRefs(this, 'createFreehand')

    if (nextProps.subview === 'createFreehand') {
      this.props.animateInComponents(components, 0)
    } else {
      this.props.animateOutComponents(components, components.length - 1)

      setTimeout(() => {
        const elem = ReactDOM.findDOMNode(this.refs.backButton)

        if (elem) {
          elem.classList.remove(animationStyles[`${elem.dataset.animation}-in`])
          elem.classList.add(animationStyles[`${elem.dataset.animation}-out`])
        }
      }, 100)
    }
  }

  render () {
    return (
      <div className={styles.root}>
        <Box spacing='32' flexDirection='col' alignItems='center' justifyContent='center'>
          <div ref='createFreehand-input' data-animation='slide' className={styles.animateIn}>
            <NameInput
              {...this.props}
              handleCreateDocument={this.onCreateFreehand}
              title='Create new freehand'
              label='Name your freehand'
              placeholder='Name your freehand'
              id='name-your-freehand'
            />
          </div>
          <div
            data-animation='slide'
            ref='createFreehand-button'
            className={styles.animateIn}>
            <Button
              order='primary'
              size='48'
              as='button'
              type='button'
              disabled={this.props.projectName.length === 0 || this.props.isCreating}
              className={styles.button}
              onClick={this.onCreateFreehand}
              aria-live='polite'>
              { this.props.isCreating ? 'Creating...' : 'Create' }
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

CreateFreehand.propTypes = {
  animateInComponents: PropTypes.func.isRequired,
  animateOutComponents: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  getRefs: PropTypes.func.isRequired,
  handleCreateFreehand: PropTypes.func.isRequired,
  handleKeydown: PropTypes.func.isRequired,
  handleNameBlur: PropTypes.func.isRequired,
  handleNameFocus: PropTypes.func.isRequired,
  handleOwnerSelected: PropTypes.func,
  handleProjectNameChange: PropTypes.func.isRequired,
  handleSwitchSubviews: PropTypes.func.isRequired,
  projectName: PropTypes.string.isRequired,
  subview: PropTypes.string.isRequired,
  willUnmount: PropTypes.bool,
  isCreating: PropTypes.bool
}

export default CreateFreehand
