import React, { Component } from 'react';
import classnames from 'classnames';
import { Text } from '@postman/aether';
import LightTheme from './LightThemeIllustration';
import DarkTheme from './DarkThemeIllustration';

export default class SettingsThemes extends Component {
  constructor (props) {
    super(props);
  }

  handleThemeSelect (theme) {
    this.props.onThemeSelect && this.props.onThemeSelect(theme);
  }

  getThumbnailClasses (theme) {
    let isActive = _.includes(this.props.currentTheme, theme);

    //  Among the following classes, the light-theme and dark-theme classes are
    //  are actually not necessary. Their purpose is fulfilled by the LightTheme
    //  and the DarkTheme components. However, these classes will be retained for
    //  the time being in order to not break build-tests.
    return classnames({
      'settings-theme-thumbnail': true,
      'active': isActive,
      'light-theme': theme === 'light',
      'dark-theme': theme === 'dark'
    });
  }

  render () {

    return (
      <div className='settings-themes-wrapper'>
        <div className='settings-themes-description'>
          <Text type='para'>Choose either the light or dark theme for the Postman app.</Text>
        </div>
        <div className='settings-themes-list'>
          <div
            className={this.getThumbnailClasses('light')}
            onClick={this.handleThemeSelect.bind(this, 'light')}
          >
          <LightTheme />
          </div>
          <div
            className={this.getThumbnailClasses('dark')}
            onClick={this.handleThemeSelect.bind(this, 'dark')}
          >
          	<DarkTheme />
          </div>
        </div>
      </div>
    );
  }
}
