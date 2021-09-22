/* global Event */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Text, Box, Input, Alert } from '@invisionapp/helios-one-web'

import styles from '../../../css/modals/name-input.css'

class NameInput extends Component {
  constructor (props) {
    super(props)

    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getInput = this.getInput.bind(this)

    this.state = {
      empty: true
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)
    // Adding this line as the keyboard-only focus ring appears on mount without it which we don't want.
    this.input.dispatchEvent(new Event('mousedown'))
    this.input.focus()
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown (event) {
    if (event.which === 13) {
      const isInputFocused = document.activeElement === this.input
      if (isInputFocused) {
        this.props.handleCreateDocument()
      }
    }

    this.props.handleKeydown(event, this.input)
  }

  handleChange (event) {
    const { value } = event.target

    if (value !== '') {
      this.setState(() => ({
        empty: false
      }))
    } else {
      this.setState(() => ({
        empty: true
      }))
    }
    this.props.handleProjectNameChange(event)
  }

  getInput (input) {
    this.input = input
  }

  render () {
    return (
      <div className={styles.root}>
        <Box spacing='32' flexDirection='col' alignItems='center' justifyContent='center'>
          <div role='alert'>
            {(this.props.createModal.error && this.props.createModal.error.element === 'name') && (
              <Alert order='destructive' className={styles.inputAlert}>
                {this.props.createModal.error.description}
              </Alert>
            )}
          </div>

          <Text size='heading-24' as='h1' color='surface-100'>
            {this.props.title}
          </Text>

          <div className={styles.inputWrap}>
            <Input
              id={this.props.id}
              value={this.props.projectName}
              onBlur={this.props.handleNameBlur}
              onChange={this.handleChange}
              placeholder={this.props.placeholder}
              label={this.props.label}
              labelPosition='top'
              size='48'
              ref={this.getInput}
              type='text'
            />
          </div>
        </Box>
      </div>
    )
  }
}

NameInput.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  handleNameFocus: PropTypes.func.isRequired,
  handleNameBlur: PropTypes.func.isRequired,
  handleProjectNameChange: PropTypes.func.isRequired,
  handleCreateDocument: PropTypes.func.isRequired,
  handleKeydown: PropTypes.func.isRequired,
  createModal: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
}

export default NameInput
