import React, { Component } from 'react';

export default class SettingsTabContents extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    let children = React.Children.map(this.props.children, (child) => {
      return child && React.cloneElement(child, { active: (this.props.activeKey === child.key) });
    });
    return (
      <div className='settings-tab-contents'>
        {children}
      </div>
    );
  }
}
