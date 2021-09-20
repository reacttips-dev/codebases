import React, { Component } from 'react';
import classnames from 'classnames';

export default class SettingsTabContent extends Component {
  constructor (props) {
    super(props);
  }

  getClasses () {
    return classnames({
      'settings-tab-content': true,
      'is-hidden': !this.props.active
    }, this.props.className);
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
