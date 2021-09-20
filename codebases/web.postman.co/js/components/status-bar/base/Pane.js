import React, { Component } from 'react';
import classnames from 'classnames';
import { DraggableCore } from '@postman/react-draggable';
import CloseIcon from '../../base/Icons/CloseIcon';


export default class Pane extends Component {
  constructor (props) {
    super(props);
    this.state = { paneHeight: this.props.paneHeight || 200 };
    this.handleStart = this.handleStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.isOpen && nextProps.isOpen !== this.props.isOpen) {
      let documentHeight = _.get(document, 'body.offsetHeight', 800);
      if ((documentHeight - this.state.paneHeight) < 100) {
        this.setState({ paneHeight: (documentHeight - 100) });
      }
    }
  }

  getClasses () {
    return classnames({
      'sb__item__pane': true,
      'is-hidden': !this.props.isOpen
    }, this.props.className);
  }

  handleStart (event, data) {
    this.paneHeight = this.state.paneHeight;
    this.startClientY = data.y;
  }

  handleDrag (event, data) {
    let clientY = data.y,
        paneHeight = this.paneHeight + (this.startClientY - clientY),
        documentHeight = _.get(document, 'body.offsetHeight', 800);

    if ((documentHeight - paneHeight) < 100) {
      paneHeight = this.state.paneHeight;
    }

    if (paneHeight < 100) {
      paneHeight = 100;
    }

    this.setState({ paneHeight: paneHeight });
  }

  render () {
    return (
      <DraggableCore
        axis='y'
        handle='.plugin__pane-resize-wrapper'
        onStart={this.handleStart}
        onDrag={this.handleDrag}
      >
        <div
          className={this.getClasses()}
          style={{ 'height': this.state.paneHeight }}
        >
          <div className='plugin__pane-resize-wrapper' />
          {this.props.children}
          <CloseIcon
            className='plugin__pane-close'
            onClick={this.props.onClose}
          />
        </div>
      </DraggableCore>
    );
  }
}
