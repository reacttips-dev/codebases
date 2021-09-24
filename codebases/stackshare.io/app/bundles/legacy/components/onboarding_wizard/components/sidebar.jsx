import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {iconPath, sidebarTitle, sidebarText} = this.props;

    return (
      <div className="onboarding-wizard-layout-container__sidebar-wrap">
        <img className="onboarding-wizard-layout-container__sidebar-icon" src={iconPath} />
        <h2 className="onboarding-wizard-layout-container__sidebar-title">{sidebarTitle}</h2>
        <p className="onboarding-wizard-layout-container__sidebar-text">{sidebarText}</p>
      </div>
    );
  }
}

export default Sidebar;
