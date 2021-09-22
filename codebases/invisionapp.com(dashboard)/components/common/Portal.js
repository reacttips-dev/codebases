import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@invisionapp/helios-one-web'

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    document.body.appendChild(this.el)
  }

  componentWillUnmount () {
    document.body.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      <ThemeProvider theme='light'>
        {this.props.children}
      </ThemeProvider>, this.el)
  }
}
