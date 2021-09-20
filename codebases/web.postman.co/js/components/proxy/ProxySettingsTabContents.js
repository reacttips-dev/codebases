import React, { Component } from 'react';

export default class ProxySettingsTabContents extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    let children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { active: (this.props.activeKey === child.key) });
    });
    return (
      <div className='proxy-settings-contents'>
        {children}
      </div>
    );
  }
}
