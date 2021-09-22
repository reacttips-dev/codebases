import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Box, Button } from '@invisionapp/helios-one-web'

import NameInput from './NameInput'
import SelectOptions from './SelectOptions'

import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/create-space.css'

class CreateSpace extends React.Component {
  constructor (props) {
    super(props)
    this.handleCreateSpace = this.handleCreateSpace.bind(this)
  }

  componentDidMount () {
    const components = this.props.getRefs(this, 'createSpace')
    this.props.animateInComponents(components, 0)
    setTimeout(() => {
      const elem = ReactDOM.findDOMNode(this.refs.backButton)

      if (elem) {
        elem.classList.remove(animationStyles[`${elem.dataset.animation}-out`])
        elem.classList.add(animationStyles[`${elem.dataset.animation}-in`])
      }
    }, 100)
  }

  componentWillReceiveProps (nextProps) {
    const components = this.props.getRefs(this, 'createSpace')

    if (nextProps.subview === 'createSpace') {
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

  handleCreateSpace () {
    if (this.props.projectName.length === 0) {
      return this.props.actions.createModalFail({
        element: 'name',
        title: 'Hang Tight',
        description: `Every Space needs a name`,
        className: 'no-name'
      })
    }
    this.props.handleCreateSpace()
  }

  render () {
    const { config } = this.props
    return (
      <div className={styles.root}>
        <Box spacing={config.canChangeSpaceVisibility ? '16' : '32'} flexDirection='col' alignItems='center' justifyContent='center'>
          <div data-animation='slide' ref='createSpace-input' className={styles.animateIn}>
            <NameInput
              {...this.props}
              handleCreateDocument={this.handleCreateSpace}
              title='Create new space'
              placeholder='Name your space'
              label='Name your space'
              id='name-your-space'
            />
          </div>
          {config.canChangeSpaceVisibility &&
            <div data-animation='slide' ref='createSpace-type' className={`${styles.animateIn} ${styles.dropdownContainer}`}>
              <SelectOptions teamName={this.props.account.team.name} {...this.props} />
            </div>}

          <div
            data-animation='slide'
            ref='createSpace-button'
            className={`${styles.animateIn} ${styles.buttonContainer}`}>
            <Button
              id='btn-create-space'
              order='primary'
              size='48'
              as='button'
              role='button'
              type='button'
              disabled={this.props.projectName.length === 0 || this.props.isCreating}
              className={styles.button}
              onClick={this.handleCreateSpace}
              aria-live='polite'>
              { this.props.isCreating ? 'Creating...' : 'Create' }
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

CreateSpace.propTypes = {
  animateInComponents: PropTypes.func.isRequired,
  animateOutComponents: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  getRefs: PropTypes.func.isRequired,
  handleCreateSpace: PropTypes.func.isRequired,
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

export default CreateSpace
