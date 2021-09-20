import React, { Component } from 'react';
import SettingsGeneral from '../../components/settings/SettingsGeneral';
import {
  REQUESTER_TAB_LAYOUT_1_COLUMN,
  REQUESTER_TAB_LAYOUT_2_COLUMN
} from '@@runtime-repl/request-http/RequesterTabLayoutConstants';
import {
  CATEGORY_EDITOR,
  OPEN_IN_NEW,
  SKIP_CONFIRMATION_BEFORE_CLOSE,
  SHOW_ICONS,
  EDITOR_FONT_FAMILY,
  EDITOR_INDENT_COUNT,
  RESPONSE_FONT_SIZE
} from '../../constants/SettingsGeneralConstants';
import { TEXT_EDITOR_DEFAULT_SETTINGS } from '../../constants/TextEditorConstants';
import { getDefaultTextEditorFontFamily } from '../../utils/TextEditorUtils';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { createEvent } from '../../modules/model-event';
import AnalyticsService from '../../modules/services/AnalyticsService';
import AppSettingsDefaults from '../../constants/AppSettingsDefaults';

const MB_MULTIPLIER = 1024 * 1024;

/**
 * Function to validate the input value for `maxResponseSize` settings
 * The `value` should be a non-negative number (decimal values are accepted)
 *
 * @param {String | Number} value
 *
 * @returns {Boolean} Return whether the value is valid or not.
 */
function isValidMaxResponseSize (value) {
  value = Number(value);

  return Number.isFinite(value) && value >= 0;
}

export default class SettingsGeneralContainer extends Component {
  constructor (props) {
    super(props);
    let generalSettings = {
      trimKeysAndValues: true,
      experimentalCodegenMode: true,
      useWhatWGUrlParser: true,
      sendPostmanTokenHeader: true,
      sendNoCacheHeader: true,
      xhrTimeout: 2,
      maxResponseSize: 0,
      interceptorRedirect: true,
      requestNewTab: false,
      trackUnsavedRequests: true,
      retainLinkHeaders: false,
      languageDetection: 'Auto',
      instantDialogeBoxes: true,
      googleAnalytics: true,
      SSLCertVerify: false,
      requesterTabLayout: REQUESTER_TAB_LAYOUT_1_COLUMN,
      variableAutocomplete: true,
      showJoinedWorkspaceModal: true,
      workingDir: '',
      insecureFileRead: false,
      disableRequestValidation: false,
      showWhitespaces: true
    };

    generalSettings = Object.assign(generalSettings, pm.settings.getDefaultEditorSettings());

    this.state = {
      generalSettings: generalSettings
    };
    this.settingChangeListener = this.settingChangeListener.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleResetEditorSettings = this.handleResetEditorSettings.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model = pm.settings;
    this.setInitialValues();
    pm.settings.on('all', this.settingChangeListener);
  }

  componentWillUnmount () {
    this.model = null;
    pm.settings.off('all', this.settingChangeListener);
  }

  settingChangeListener (eventName, value) {
    // bail out if the event name is not like `setSetting:<key>`
    if (!_.startsWith(eventName, 'setSetting:')) {
      return;
    }

    // remove `setSetting:` prefix from event name
    eventName = eventName.slice(11);

    // do nothing if changed setting is not part of this component state
    if (!_.has(this.state.generalSettings, eventName)) {
      return;
    }

    // Convert Bytes to MB to show in UI
    if (eventName === 'maxResponseSize') {
      const sanitizedValue = isValidMaxResponseSize(value) ?
        Number(value) :
        AppSettingsDefaults.general.MAX_RESPONSE_SIZE;

      value = sanitizedValue / MB_MULTIPLIER;
    }

    // update the state to reflect setting changes made from outside (i.e. from other window)
    this.setState({
      generalSettings: {
        ...this.state.generalSettings,
        [eventName]: value
      }
    });
  }

  setInitialValues () {
    var settings = _.clone(this.state.generalSettings);
    for (let prop in settings) {
      if (settings.hasOwnProperty(prop)) {
        settings[prop] = pm.settings.getSetting(prop);

        if (prop === 'languageDetection' && settings[prop] === 'Auto') {
          settings[prop] = 'auto';
        }

        if (prop === 'maxResponseSize') {
          const sanitizedValue = isValidMaxResponseSize(settings[prop]) ?
            Number(settings[prop]) :
            AppSettingsDefaults.general.MAX_RESPONSE_SIZE;

          settings[prop] = sanitizedValue / MB_MULTIPLIER; // Show in MB
        }
      }
    }

    this.setState({ generalSettings: settings });
  }

  handleFieldChange (key, value) {
    var settings = _.clone(this.state.generalSettings);
    if (key === 'requesterTabLayout') {
      value = value ? REQUESTER_TAB_LAYOUT_2_COLUMN : REQUESTER_TAB_LAYOUT_1_COLUMN;
      this.toggleRequesterTabLayout(value);
    }

    if (key === `${CATEGORY_EDITOR}.${OPEN_IN_NEW}`) {
      this.handleConfigChange(`${CATEGORY_EDITOR}.${OPEN_IN_NEW}`, value);
    }

    if (key === `${CATEGORY_EDITOR}.${SKIP_CONFIRMATION_BEFORE_CLOSE}`) {
      this.handleConfigChange(`${CATEGORY_EDITOR}.${SKIP_CONFIRMATION_BEFORE_CLOSE}`, !value);
    }

    if (key === `${CATEGORY_EDITOR}.${SHOW_ICONS}`) {
      this.handleConfigChange(`${CATEGORY_EDITOR}.${SHOW_ICONS}`, value);
    }

    // value parameter is undefined when it has been triggered from toggler
    settings[key] = (value !== undefined) ? value : !settings[key];

    // Convert MB to Bytes after setting has been set
    if (key === 'maxResponseSize') {
      // Do not update the state for invalid inputs
      if (!isValidMaxResponseSize(value)) {
        return;
      }

      value = Number(value) * MB_MULTIPLIER;
    }

    if (key === 'useWhatWGUrlParser') {
      let action = value ? 'set_global_encoding_true' : 'set_global_encoding_false';

      AnalyticsService.addEvent('app', action, 'setting_modal', 1);
    }

    if (key === EDITOR_FONT_FAMILY && value === '') {
      value = getDefaultTextEditorFontFamily();
    }

    if (key === EDITOR_INDENT_COUNT) {
      value = _.toInteger(value) || TEXT_EDITOR_DEFAULT_SETTINGS.INDENT_COUNT;
    }

    if (key === RESPONSE_FONT_SIZE) {
      value = _.toInteger(value) || TEXT_EDITOR_DEFAULT_SETTINGS.FONT_SIZE;
    }

    if (value !== '') {
      // to prevent backspaced-blank values from being stored
      this.setSetting(key, value);
    }

    this.setState({ generalSettings: settings });
  }

  handleConfigChange (key, value) {
    dispatchUserAction(createEvent('update', 'userconfigs', { [key]: value }))
      .catch(() => {
        pm.toasts.error('Something went wrong while updating this setting');
      });
  }

  toggleRequesterTabLayout (nextLayout) {
    (pm.app.getCurrentLayout() !== nextLayout) &&
      pm.app.toggleLayout();
  }

  setSetting (key, value) {
    this.model.setSetting(key, value);
  }

  handleResetEditorSettings () {
    pm.settings.resetEditorSettings();
    var settings = _.clone(this.state.generalSettings);
    settings = Object.assign(settings, pm.settings.getDefaultEditorSettings());
    this.setState({ generalSettings: settings });
  }

  render () {

    return (
      <SettingsGeneral
        generalSettings={this.state.generalSettings}
        onFieldChange={this.handleFieldChange}
        onConfigChange={this.handleConfigChange}
        onResetEditorSettings={this.handleResetEditorSettings}
      />
    );
  }
}
