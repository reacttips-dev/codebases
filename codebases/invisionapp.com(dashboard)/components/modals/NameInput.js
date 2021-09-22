import React, { Component } from 'react'
import { Text, Stack, Input } from '@invisionapp/helios-one-web'

import cx from 'classnames'

import styles from '../sidebar/css/name-input.css'
import animationStyles from '../sidebar/css/modal-animations.css'

class NameInput extends Component {
  constructor (props) {
    super(props)

    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getInput = this.getInput.bind(this)
  }

  handleKeydown (event) {
    if (event.which === 13) {
      this.props.handleCreateSpace()
    }
  }

  handleChange (event) {
    const { value } = event.target
    this.props.handleSpaceNameChange(value)
  }

  getInput (input) {
    this.input = input
  }

  componentDidMount () {
    this.input.focus()
  }

  render () {
    return (
      <div className={styles.root}>
        <Stack spacing='24' justifyContent='center'>
          <div className={animationStyles.slideIn}>
            <Text size='heading-24' color='surface-100'>
              {this.props.title}
            </Text>
          </div>
          <div className={cx(styles.inputWrap, animationStyles.slideIn)}>
            <Input
              autoFocus
              label='Name your space'
              labelPosition='top'
              id={this.props.id}
              ref={this.getInput}
              onBlur={this.props.handleNameBlur}
              onKeyDown={this.handleKeydown}
              onChange={this.handleChange}
              placeholder={this.props.placeholder}
              value={this.props.spaceName}
              type='text'
              size='48'
            />
          </div>
        </Stack>

      </div>
    )
  }
}

export default NameInput
