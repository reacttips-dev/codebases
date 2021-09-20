import React, { Component } from 'react';
import ThemeManager from '../../controllers/theme/ThemeManager';
import SettingsThemes from '../../components/settings/SettingsThemes';
import ScratchpadService from '../../services/ScratchpadService';
import { isEmbeddedScratchpad } from '../../utils/ScratchpadUtils';

export default class SettingsAddonsContainer extends Component {
  constructor (props) {
    super(props);
    this.state = { currentTheme: 'light' };
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.setState({ currentTheme: pm.settings.getSetting('postmanTheme') });
    pm.settings.on('setSetting:postmanTheme', this.handleThemeChange);
  }

  componentWillUnmount () {
    pm.settings.off('setSetting:postmanTheme', this.handleThemeChange);
  }

  handleThemeChange () {
    this.setState({
      currentTheme: pm.settings.getSetting('postmanTheme')
    });
  }

  handleThemeSelect (theme) {
    if (this.state.currentTheme === theme) {
      return;
    }

    if (isEmbeddedScratchpad()) {
      ScratchpadService.sendEventToOuterView('changeTheme', { theme });
    }

    ThemeManager.changeTheme(theme).then((data) => {
      this.setState({ currentTheme: data.currentTheme });
    });

  }

  render () {

    return (
      <SettingsThemes
        currentTheme={this.state.currentTheme}
        onThemeSelect={this.handleThemeSelect}
      />
    );
  }
}
