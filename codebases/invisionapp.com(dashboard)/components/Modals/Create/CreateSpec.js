import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Box, Button } from '@invisionapp/helios-one-web'

import NameInput from './NameInput'

import animationStyles from '../../../css/modal-animations.css'
import styles from '../../../css/modals/create-space.css'

class CreateSpec extends React.Component {
  constructor (props) {
    super(props)

    this.onCreateSpec = this.onCreateSpec.bind(this)
  }

  componentDidMount () {
    const components = this.props.getRefs(this, 'createSpec')
    this.props.animateInComponents(components, 0)

    setTimeout(() => {
      const elem = ReactDOM.findDOMNode(this.refs.backButton)

      if (elem) {
        elem.classList.remove(animationStyles[`${elem.dataset.animation}-out`])
        elem.classList.add(animationStyles[`${elem.dataset.animation}-in`])
      }
    }, 100)
  }

  onCreateSpec () {
    if (this.props.projectName.length === 0) {
      this.props.actions.createModalFail({
        element: 'name',
        title: 'Hang Tight',
        description: 'Every spec needs a name',
        className: 'no-name'
      })

      document.querySelector('#name-your-spec').focus()
    } else {
      this.props.handleCreateSpec()
    }
  }

  componentWillReceiveProps (nextProps) {
    const components = this.props.getRefs(this, 'createSpec')

    if (nextProps.subview === 'createSpec') {
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
          <div ref='createSpec-input' data-animation='slide' className={styles.animateIn}>
            <NameInput
              {...this.props}
              handleCreateDocument={this.onCreateSpec}
              title='Create new spec'
              placeholder='Name your spec'
              label='Name your spec'
              id='name-your-spec'
            />
          </div>
          <div
            data-animation='slide'
            ref='createSpec-button'
            className={styles.animateIn}>
            <Button
              order='primary'
              size='48'
              role='button'
              as='button'
              type='button'
              disabled={this.props.projectName.length === 0 || this.props.isCreating}
              className={styles.button}
              onClick={this.onCreateSpec}
              aria-live='polite'>
              { this.props.isCreating ? 'Creating...' : 'Create' }
            </Button>
          </div>
        </Box>
      </div>
    )
  }
}

CreateSpec.propTypes = {
  animateInComponents: PropTypes.func.isRequired,
  animateOutComponents: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  getRefs: PropTypes.func.isRequired,
  handleCreateSpec: PropTypes.func.isRequired,
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

export default CreateSpec
