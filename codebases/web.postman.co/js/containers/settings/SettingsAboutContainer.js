import React, { Component } from 'react';
import SettingsAbout from '../../components/settings/SettingsAbout';

export default class SettingsAboutContainer extends Component {
  constructor (props) {
    super(props);
  }

  UNSAFE_componentWillMount () {
    this.setState(pm.app.get('info'));
  }

  render () {

    return (
      <SettingsAbout {...this.state} />
    );
  }
}
