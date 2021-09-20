import React, { Component } from 'react';
import classnames from 'classnames';

export default class Text extends Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    return classnames({ 'sb__item__text': true }, this.props.className);
  }

  render () {
    return (
      <div className={this.getClasses()}>
        { this.props.render && this.props.render() }
      </div>
    );
  }
}
