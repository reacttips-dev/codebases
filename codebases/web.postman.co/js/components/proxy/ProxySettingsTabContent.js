import React, { Component } from 'react';
import classnames from 'classnames';

export default class ProxySettingsTabContent extends Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    return classnames(
      'proxy-settings-content',
      { 'is-hidden': !this.props.active },
      this.props.className
    );
  }

  render () {

    let classes = this.getClasses();

    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }
}
