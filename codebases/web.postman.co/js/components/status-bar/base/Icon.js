import React, { Component } from 'react';
import classnames from 'classnames';

export default class Icon extends Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    return classnames({ 'sb__item__icon': true }, this.props.className);
  }

  render () {
    return (
      <div
        className={this.getClasses()}
        onClick={this.props.onClick}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        { this.props.icon }
      </div>
    );
  }
}
