import React, { Component } from 'react';
import classnames from 'classnames';
import { Text, Heading } from '@postman/aether';

import { SETTINGS_SHORTCUTS } from '../../constants/SettingsShortcutsConstants';
import ToggleSwitch from '../base/ToggleSwitch';

const isDarwin = window ? _.includes(navigator.platform, 'Mac') : process.platform === 'darwin';

export default class SettingsShortcuts extends Component {
  constructor (props) {
    super(props);

    this.state = { shortcutsEnabled: !pm.app.get('shortcutsDisabled') };

    this.handleToggleShortcuts = this.handleToggleShortcuts.bind(this);
  }

  formatKeyLabel (label) {
    if (label.indexOf('through') >= 0) {
      return label;
    }
    return !isDarwin ? label.split('+').join(' + ') : label.split('').join(' ');
  }

  handleToggleShortcuts (shortcutsEnabled) {
    this.setState({ shortcutsEnabled }, () => {
      (shortcutsEnabled) ? pm.app.enableShortcuts() : pm.app.disableShortcuts();
    });
  }

  render () {

    return (
      <div className='settings-shortcuts-wrapper'>
        <div className='item-header'>
          <h4 className='item-title'>
            <Heading text='Shortcuts' type='h3' styleAs='h5' />
          </h4>
          <ToggleSwitch
            isActive={this.state.shortcutsEnabled}
            onClick={this.handleToggleShortcuts}
          />
        </div>
        <div className='divider' />
        <div className={classnames({
          'settings-shortcuts-list': true,
          'disabled': !this.state.shortcutsEnabled
        })}
        >
          {
            _.map(SETTINGS_SHORTCUTS, (group, groupIndex) => {
              return (
                <div className='settings-shortcuts-list-item-group' key={groupIndex}>
                  <div className='settings-shortcuts-list-item-header' >
                    <Heading type='h3' styleAs='h5' text={group.name} />
                  </div>
                  <div className='settings-shortcuts-list-item-content'>
                    {
                      _.map(group.shortcuts, (shortcut) => {
                        if (!shortcut) {
                          return;
                        }
                        const shortcutValue = isDarwin ?
                          shortcut.keyLabelDarwin :
                          shortcut.keyLabel;

                        return (
                          <div className='settings-shortcuts-list-item' key={shortcut.keyLabel}>
                            <div className='settings-shortcuts-list-item-label'>
                              <Text color='content-color-secondary'>{shortcut.label}</Text>
                            </div>
                            <div className='settings-shortcuts-list-item-value'>
                              {Array.isArray(shortcutValue) ?
                                shortcutValue.map((value, index) => (
                                  <React.Fragment key={index}>
                                    <Text color='content-color-secondary'>{this.formatKeyLabel(value)}</Text>
                                    {index !== (shortcutValue.length - 1) &&
                                      <br />
                                    }
                                  </React.Fragment>
                                ))
                              :
                                <Text>{this.formatKeyLabel(shortcutValue)}</Text>
                              }
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
