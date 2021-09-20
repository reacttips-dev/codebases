import React, { Component } from 'react';
import classnames from 'classnames';
import { RadioGroup, Radio } from 'react-radio-group';
import SettingsValueDropdown from './SettingsValueDropdown';
import SettingsValueInput from './SettingsValueInput';
import ToggleSwitch from '../base/ToggleSwitch';
import { Heading, Text } from '@postman/aether';
import WarningButton from '../base/WarningButton';
import WarningIcon from '../base/Icons/WarningIcon';
import { Button } from '../base/Buttons';
import { Input } from '../base/Inputs';
import { Tooltip, TooltipBody } from '../base/Tooltips';
import { getStore } from '../../stores/get-store';
import { observer } from 'mobx-react';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { getDefaultTextEditorFontFamily } from '../../utils/TextEditorUtils';
import Link from '../../../appsdk/components/link/Link';

import {
  TRIM_KEYS_AND_VALUES,
  SEND_POSTMAN_TOKEN_HEADER,
  SEND_NO_CACHE_HEADER,
  XHR_TIMEOUT,
  MAX_RESPONSE_SIZE,
  AUTO_FOLLOW_REDIRECTS,
  RESPONSE_FONT_SIZE,
  RETAIN_HEADERS,
  LANGUAGE_DETECTION,
  SEND_ANONYMOUS_DATA,
  SSL_CERT_VERIFY,
  REQUESTER_TAB_LAYOUT,
  VARIABLE_AUTOCOMPLETE,
  CATEGORY_REQUEST,
  CATEGORY_EDITOR,
  OPEN_IN_NEW,
  SKIP_CONFIRMATION_BEFORE_CLOSE,
  SHOW_ICONS,
  WORKING_DIR,
  INSECURE_FILEREAD,
  DISABLE_REQUEST_VALIDATION,
  SHOW_WHITESPACES,
  REQUEST_EDITOR_LAYOUT_NAME,
  EDITOR_FONT_FAMILY,
  EDITOR_INDENT_COUNT,
  EDITOR_INDENT_TYPE,
  EDITOR_AUTOCLOSE_BRACKETS,
  EDITOR_AUTOCLOSE_QUOTES,
  EDITOR_RENDER_NON_PRINTABLE
} from '../../constants/SettingsGeneralConstants';

import { REQUESTER_TAB_LAYOUT_2_COLUMN } from '@@runtime-repl/request-http/RequesterTabLayoutConstants';
import { VARIABLE_DOCS, WORKING_DIR_DOCS } from '../../constants/AppUrlConstants';
import { DEFAULT_WORKING_DIR } from '@@runtime-repl/_common/FsConstants';
import { TYPES } from '@@runtime-repl/agent/AgentConstants';

const languageDetectionLabelMap = {
  'auto': 'Auto',
  'JSON': 'JSON'
};

@observer
export default class SettingsGeneral extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isWorkingDirAccessible: true,
      XHRTooltipRef: null
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
  }

  componentDidMount () {
    this.setWorkingDirAccess(this.props.generalSettings.workingDir);
  }

  setWorkingDirAccess (directory) {
    // If no directory selected then set the default working-dir
    !directory && (directory = DEFAULT_WORKING_DIR);

    pm.runtime.pathAccessible(directory, true, (err) => {
      if (err) {
        pm.logger.warn('SettingsGeneral~setWorkingDirAccess - Directory not accessible', err);
        this.setState({ isWorkingDirAccessible: false });
      } else {
        this.setState({ isWorkingDirAccessible: true });
      }
    });
  }

  handleFieldChange (key, value) {
    if (key === 'SSLCertVerify') {
      let action = value ? 'set_ssl_cert_verification_true' : 'set_ssl_cert_verification_false';

      AnalyticsService.addEvent('app', action, 'setting_modal', 1);
    }

    // Added condition as the Request Validation setting is reflected in the UI in opposite
    // manner due to the change in https://postmanlabs.atlassian.net/browse/RUNTIME-3300
    if (key === DISABLE_REQUEST_VALIDATION) {
      value = !value;
    }

    this.props.onFieldChange && this.props.onFieldChange(key, value);
  }

  handleConfigChange (key, value) {
    if (!key) {
      return;
    }

    this.props.onConfigChange && this.props.onConfigChange(key, value);
  }

  handleFileSelect () {
    const { dialog } = require('electron').remote;

    dialog.showOpenDialog({
      buttonLabel: 'Select',
      properties: ['openDirectory', 'createDirectory']
    }).then((result) => {
      if (_.isArray(result.filePaths) && result.filePaths.length === 1) {
        this.setWorkingDirAccess(result.filePaths[0]);
        this.handleFieldChange(WORKING_DIR, result.filePaths[0]);
      }
    });
  }

  getDisabledSettingStyles (baseClasses) {
    return classnames(baseClasses, { 'is-disabled': _.get(pm.runtime, 'agent.stat.type') === TYPES.XHR });
  }

  handleTooltipAction (targetRef = null) {
    this.setState({ XHRTooltipRef: targetRef });
  }

  render () {
    let generalSettingsObj = this.props.generalSettings,
      generalSettingsLanguageDetection = languageDetectionLabelMap[generalSettingsObj.languageDetection],
      configsMap = getStore('ConfigurationStore').configs,
      workingDir = generalSettingsObj.workingDir || ((window.SDK_PLATFORM === 'browser') ? '~/Postman/files' : DEFAULT_WORKING_DIR),
      REQUEST_VALIDATION_ENABLED = getStore('FeatureFlagsStore').isEnabled('requestValidation'),
      isXHRAgentSelected = _.get(pm.runtime, 'agent.stat.type') === TYPES.XHR;

    return (
      <div>
        <div className='settings-general-wrapper'>
          <div className='settings-general-list'>
            <div className='settings-general-list-group'>
              <Heading text='Request' type='h3' styleAs='h5' />
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Trim keys and values in request body</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.trimKeysAndValues}
                  onClick={this.handleFieldChange.bind(this, TRIM_KEYS_AND_VALUES)}
                />
              </div>
            </div>
            <div
              className={this.getDisabledSettingStyles('settings-general-list-item settings-general-list-item--ssl-verification')}
              ref={SSL_CERT_VERIFY}
              onMouseEnter={this.handleTooltipAction.bind(this, SSL_CERT_VERIFY)}
              onMouseLeave={this.handleTooltipAction.bind(this)}
            >
              <div className='settings-general-list-item-label'>
                <Text>SSL certificate verification</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  disabled={isXHRAgentSelected}
                  isActive={isXHRAgentSelected ? true : generalSettingsObj.SSLCertVerify}
                  onClick={this.handleFieldChange.bind(this, SSL_CERT_VERIFY)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Always open requests in new tab</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={configsMap.get(`${CATEGORY_EDITOR}.${OPEN_IN_NEW}`)}
                  onClick={this.handleFieldChange.bind(this, `${CATEGORY_EDITOR}.${OPEN_IN_NEW}`)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Always ask when closing unsaved tabs</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={!configsMap.get(`${CATEGORY_EDITOR}.${SKIP_CONFIRMATION_BEFORE_CLOSE}`)}
                  onClick={this.handleFieldChange.bind(this, `${CATEGORY_EDITOR}.${SKIP_CONFIRMATION_BEFORE_CLOSE}`)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Language detection</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <SettingsValueDropdown
                  value={generalSettingsLanguageDetection}
                  options={['auto', 'JSON']}
                  labels={['Auto', 'JSON']}
                  onValueChange={this.handleFieldChange.bind(this, LANGUAGE_DETECTION)}
                />
              </div>
            </div>
            <div className='settings-general-list-item settings-general-list-item--xhr-timeout'>
              <div className='settings-general-list-item-label'>
                <Text>Request timeout in ms</Text>
                <div className='settings-general-list-item-help-text'>
                  <Text type='para'>
                    Set how long a request should wait for a response before timing out. To never time out, set to 0.
                  </Text>
                </div>
              </div>
              <div className='settings-general-list-item-value'>
                <SettingsValueInput
                  value={generalSettingsObj.xhrTimeout}
                  onValueChange={this.handleFieldChange.bind(this, XHR_TIMEOUT)}
                />
              </div>
            </div>
            <div
              className={this.getDisabledSettingStyles('settings-general-list-item settings-general-list-item--max-res-size')}
              ref={MAX_RESPONSE_SIZE}
              onMouseEnter={this.handleTooltipAction.bind(this, MAX_RESPONSE_SIZE)}
              onMouseLeave={this.handleTooltipAction.bind(this)}
            >
              <div className='settings-general-list-item-label'>
                <Text>Max response size in MB</Text>
                <div className='settings-general-list-item-help-text'>
                  <Text type='para'>
                    Set the maximum size of a response to download. To download a response of any size, set to 0.
                  </Text>
                </div>
              </div>
              <div className='settings-general-list-item-value'>
                <SettingsValueInput
                  disabled={isXHRAgentSelected}
                  value={isXHRAgentSelected ? 0 : generalSettingsObj.maxResponseSize}
                  onValueChange={this.handleFieldChange.bind(this, MAX_RESPONSE_SIZE)}
                />
              </div>
            </div>
            {

            // Disable Request Validation Setting is now of opposite polarity (Request Validation now)
            // due to the change in https://postmanlabs.atlassian.net/browse/RUNTIME-3300
              REQUEST_VALIDATION_ENABLED &&
              <div className='settings-general-list-item settings-general-list-item--disable-request-validation'>
                <div className='settings-general-list-item-label'>
                  <Text>Request Validation</Text>
                  <div className='settings-general-list-item-help-text request-validation-description'>
                    <Text type='para'>
                      Validate requests in collections that are linked to an API against its latest schema.
                    </Text>
                  </div>
                </div>
                <div className='settings-general-list-item-value'>
                  <ToggleSwitch
                    isActive={!generalSettingsObj.disableRequestValidation}
                    onClick={this.handleFieldChange.bind(this, DISABLE_REQUEST_VALIDATION)}
                  />
                </div>
              </div>
            }
            {/*

            // Commenting out Settings for Whitespaces, so as to make it easier to enable this later
            // if users demand Whitespaces to be turned off.

          <div className='settings-general-list-item settings-general-list-item--show-whitespaces'>
            <div className='settings-general-list-item-label'>
              Show Whitespaces
            </div>
            <div className='settings-general-list-item-value'>
              <ToggleSwitch
                isActive={generalSettingsObj.showWhitespaces}
                onClick={this.handleFieldChange.bind(this, SHOW_WHITESPACES)}
              />
            </div>
          </div>
          */}
            <div className='settings-general-list-separator' />
            <div className='settings-general-list-group'>
              <Heading text='Working directory' type='h3' styleAs='h5' />
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-help-text'>
                <Text type='para'>
                  Collaborate on files used in requests by sharing your working directory.
                </Text>
                <div className='settings-general-list-item--working-dir_help-link'>
                  <Link
                    to={WORKING_DIR_DOCS}
                    target='_blank'
                  >
                    <Text type='link-default' isExternal>
                      Learn how to setup your working directory
                    </Text>
                  </Link>
                </div>
              </div>
            </div>
            <div className='settings-general-list-item settings-general-list-item--working-dir'>
              <div className='settings-general-list-item-label'>
                <div className='settings-general-list-item-label--working-dir_label'>
                  <Text>Location</Text>
                  {
                    !this.state.isWorkingDirAccessible &&
                    <WarningButton showTooltipOnHover tooltip='The selected working directory does not exist' />
                  }
                  {
                    (window.SDK_PLATFORM === 'browser') &&
                    <WarningButton showTooltipOnHover tooltip='The working directory cannot be configured while using browser' />
                  }
                </div>
              </div>
              <div className='settings-general-list-item--working-dir_value'>
                <div className='settings-general-list-item--working-dir_file-input' title={workingDir}>
                  <Input
                    inputStyle='box'
                    type='text'
                    value={workingDir}
                    disabled
                  />
                </div>
                <div className='settings-general-list-item--working-dir_file-button'>
                  <Button
                    className='working-dir__file-chooser'
                    type='secondary'
                    size='small'
                    onClick={this.handleFileSelect}
                    disabled={window.SDK_PLATFORM === 'browser'}
                  >
                    <Text>Choose</Text>
                  </Button>
                </div>
              </div>
            </div>
            <div className='settings-general-list-item settings-general-list-item--insecure-fileread'>
              <div className='settings-general-list-item-label'>
                <div>
                  <Text>Allow reading files outside working directory</Text>
                </div>
                <div className='settings-general-list-item-help-text'>
                  <Text type='para'>
                    <WarningIcon className='warning-icon' size='xs' />
                    Enabling this will allow any 3rd party collections to potentially read any file on your system.
                  </Text>
                </div>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.insecureFileRead}
                  onClick={this.handleFieldChange.bind(this, INSECURE_FILEREAD)}
                />
              </div>
            </div>
          </div>
          <div className='settings-general-list'>
            <div className='settings-general-list-group'>
              <Heading text='Headers' type='h3' styleAs='h5' />
            </div>
            <div className='settings-general-list-item settings-general-list-item--no-cache-header'>
              <div className='settings-general-list-item-label'>
                <Text>Send no-cache header</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.sendNoCacheHeader}
                  onClick={this.handleFieldChange.bind(this, SEND_NO_CACHE_HEADER)}
                />
              </div>
            </div>
            <div className='settings-general-list-item settings-general-list-item--postman-token-header'>
              <div className='settings-general-list-item-label'>
                <Text>Send Postman Token header</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.sendPostmanTokenHeader}
                  onClick={this.handleFieldChange.bind(this, SEND_POSTMAN_TOKEN_HEADER)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Retain headers when clicking on links</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.retainLinkHeaders}
                  onClick={this.handleFieldChange.bind(this, RETAIN_HEADERS)}
                />
              </div>
            </div>
            <div
              className={this.getDisabledSettingStyles('settings-general-list-item')}
              ref={AUTO_FOLLOW_REDIRECTS}
              onMouseEnter={this.handleTooltipAction.bind(this, AUTO_FOLLOW_REDIRECTS)}
              onMouseLeave={this.handleTooltipAction.bind(this)}
            >
              <div className='settings-general-list-item-label'>
                <Text>Automatically follow redirects</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  disabled={isXHRAgentSelected}
                  isActive={isXHRAgentSelected ? true : generalSettingsObj.interceptorRedirect}
                  onClick={this.handleFieldChange.bind(this, AUTO_FOLLOW_REDIRECTS)}
                />
              </div>
            </div>
            <div className='settings-general-list-item settings-general-list-item--postman-token'>
              <div className='settings-general-list-item-label'>
                <Text>Send anonymous usage data to Postman</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.googleAnalytics}
                  onClick={this.handleFieldChange.bind(this, SEND_ANONYMOUS_DATA)}
                />
              </div>
            </div>
            <div className='settings-general-list-separator' />
            <div className='settings-general-list-group'>
              <Heading text='User interface' type='h3' styleAs='h5' />
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Two-pane view</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={configsMap.get(`${CATEGORY_EDITOR}.${REQUEST_EDITOR_LAYOUT_NAME}`) === REQUESTER_TAB_LAYOUT_2_COLUMN}
                  onClick={this.handleFieldChange.bind(this, REQUESTER_TAB_LAYOUT)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Show icons with tab names</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={configsMap.get(`${CATEGORY_EDITOR}.${SHOW_ICONS}`)}
                  onClick={this.handleFieldChange.bind(this, `${CATEGORY_EDITOR}.${SHOW_ICONS}`)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Variable autocomplete</Text>
              </div>
              <div className='settings-general-list-item-value'>
                <ToggleSwitch
                  isActive={generalSettingsObj.variableAutocomplete}
                  onClick={this.handleFieldChange.bind(this, VARIABLE_AUTOCOMPLETE)}
                />
              </div>
            </div>
            <div className='settings-general-list-separator' />
            <div className='settings-general-list-group settings-general-editor-settings-heading'>
              <Heading text='Editor settings' type='h3' styleAs='h5' />
              <Button
                className='reset-editor-settings'
                type='text'
                tooltip='Reset editor settings to their default values'
                tooltipPlacement='top'
                onClick={this.props.onResetEditorSettings}
              >
                  <Text>Reset</Text>
               </Button>
            </div>
            <div className='settings-general-list-item settings-general-list-item--font-family'>
              <div className='settings-general-list-item-label'>
                <div className='settings-general-list-item-label--font-family_label'>
                  <Text>Font Family</Text>
                </div>
              </div>
              <div className='settings-general-list-item--font-family_value'>
                <div className='settings-general-list-item--font-family-input'>
                  <SettingsValueInput
                    value={generalSettingsObj.editorFontFamily}
                    onValueChange={this.handleFieldChange.bind(this, EDITOR_FONT_FAMILY)}
                  />
                </div>
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Font Size (px)</Text>
              </div>
              <div className='settings-general-list-item-value editor-font-size'>
                <SettingsValueInput
                  type='number'
                  minVal={0}
                  value={generalSettingsObj.responseFontSize}
                  onValueChange={this.handleFieldChange.bind(this, RESPONSE_FONT_SIZE)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Indentation count</Text>
                <div className='settings-general-list-item-help-text'>
                  <Text type='para'>
                    Set number of indentations to add per code level.
                  </Text>
                </div>
              </div>
              <div className='settings-general-list-item-value editor-tab-size'>
                <SettingsValueInput
                  type='number'
                  minVal={0}
                  maxVal={8}
                  value={generalSettingsObj.editorIndentCount}
                  onValueChange={this.handleFieldChange.bind(this, EDITOR_INDENT_COUNT)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Indentation type</Text>
                <div className='settings-general-list-item-help-text'>
                  <Text type='para'>
                    Indent lines of code with either Space or Tab.
                  </Text>
                </div>
              </div>
              <div className='settings-general-list-item-value editor-indent-tab'>
                <RadioGroup
                  name={this.state.uniqueName}
                  selectedValue={generalSettingsObj.editorIndentType}
                  onChange={this.handleFieldChange.bind(this, EDITOR_INDENT_TYPE)}
                >
                  <div>
                    <label className='settings-data-option'>
                      <Radio value='space' className='radio-button' />
                      <Text>Space</Text>
                    </label>
                    <label className='settings-data-option'>
                      <Radio value='tab' className='radio-button' />
                      <Text>Tab</Text>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Auto close brackets</Text>
              </div>
              <div className='settings-general-list-item-value editor-auto-close-brackets'>
                <ToggleSwitch
                  isActive={generalSettingsObj.editorAutoCloseBrackets}
                  onClick={this.handleFieldChange.bind(this, EDITOR_AUTOCLOSE_BRACKETS)}
                />
              </div>
            </div>
            <div className='settings-general-list-item'>
              <div className='settings-general-list-item-label'>
                <Text>Auto close quotes</Text>
              </div>
              <div className='settings-general-list-item-value editor-auto-close-quotes'>
                <ToggleSwitch
                  isActive={generalSettingsObj.editorAutoCloseQuotes}
                  onClick={this.handleFieldChange.bind(this, EDITOR_AUTOCLOSE_QUOTES)}
                />
              </div>
            </div>
          </div>
        </div>
        {
            isXHRAgentSelected &&
            <Tooltip
              immediate
              show={!!this.state.XHRTooltipRef}
              placement='bottom'
              target={this.state.XHRTooltipRef ? this.refs[this.state.XHRTooltipRef] : null}
            >
              <TooltipBody>This setting is not available while using the browser agent. Switch to the desktop agent to change this setting.</TooltipBody>
            </Tooltip>
          }
      </div>
    );
  }
}
