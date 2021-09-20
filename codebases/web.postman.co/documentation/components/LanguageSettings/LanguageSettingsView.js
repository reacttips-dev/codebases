import React, { Component } from 'react';
import CodeGenServiceExperimental from '../../../js/services/CodeGeneratorExperimental';
import AnalyticsService from '../../../js/modules/services/AnalyticsService';
import LoadingIndicator from '../../../js/components/base/LoadingIndicator';
import ConfigurationsComponent from '../../../integrations/components/ConfigurationsComponent';
import { getStore } from '../../../js/stores/get-store';
import { DOCUMENTATION_ANALYTICS, DOCUMENTATION_ENTITY } from '../../constants';
import { isPublicWorkspace } from '../../utils/utils';
import Link from '../../../appsdk/components/link/Link';

const CODEGEN_URL = 'https://go.pstmn.io/generic-codegen-repo';

export default class LanguageSettingsView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeLanguage: this.props.activeLanguage,
      optionsArray: [],
      optionsPreference: {},
      languageSettingsLoading: true
    };
    this.store = getStore('CodegenStore');
    this.getDisplayNameForCodegen = this.getDisplayNameForCodegen.bind(this);
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.activeLanguage !== prevState.activeLanguage) {
      return { activeLanguage: nextProps.activeLanguage };
    }

    return null;
  }

  componentDidMount () {
    let language = this.state.activeLanguage.language,
      variant = this.state.activeLanguage.variant;

    let defaultOptions = {},
      optionsPreference;

    CodeGenServiceExperimental.getOptions(language, variant)
      .then((options) => {
        if (options && options.length) {
          this.setState({
            optionsArray: options
          });
          options.forEach((option) => {
            defaultOptions[option.id] = option.default;
          });
        }
      })
      .catch((err) => {
        let options = [];
        this.setState({
          optionsArray: options
        });
        pm.logger.error(`CodeGenServiceExperimental.getOptions - ${err}`);
      })
      .then(() => {
        optionsPreference = this.store.getSnippetOptionForLanguage(language, variant) || defaultOptions;
        this.setState({
          optionsPreference: optionsPreference,
          languageSettingsLoading: false
        });
      });
  }

  handleSubmitOptions = (optionsPreference) => {
    this.store.updateSnippetOptions(optionsPreference, this.state.activeLanguage.language, this.state.activeLanguage.variant);
    let language = this.state.activeLanguage.language || '',
      variant = this.state.activeLanguage.variant || '';

    try {
      AnalyticsService.addEvent('codegen', 'configure', `${language}_${variant}`);

      if (_.get(this.props, 'modalContext.source') === DOCUMENTATION_ANALYTICS.CATEGORY) {
        AnalyticsService.addEventV2({
          category: DOCUMENTATION_ANALYTICS.CATEGORY,
          action: 'configure_language',
          label: isPublicWorkspace() ? DOCUMENTATION_ANALYTICS.LABEL.PUBLIC_TAB : DOCUMENTATION_ANALYTICS.LABEL.PRIVATE_TAB,
          entityType: DOCUMENTATION_ENTITY.COLLECTION,
          entityId: _.get(this.props, 'modalContext.collectionUid')
        });
      }
    }
    catch (err) {
      pm.logger.error(`Error in adding analytics event - ${err}`);
    }
  }

  /** In LanguageList of the store we store the `name` property,
   * which describes how the display name of the language should look like.
   * For eg - nodejs should be displayed NodeJS, curl => cURL, etc.
   *
   * This function uses the language list from CodegenStore
   * and returns the name that should be displayed
   *
   * @param {string} language
   * @param {string} variant
   */
  getDisplayNameForCodegen (language, variant) {
    let languageList = this.store.getLanguageList(),
      defaultName = `${language} - ${variant}`,
      id = JSON.stringify({ language, variant }),
      displayName;

    if (!languageList) {
      return defaultName;
    }

    _.forEach(languageList, (lang) => {
      if (id === lang.id) {
        displayName = lang.name;
      }
    });

    return displayName ? displayName : defaultName;
  }

  render () {
    let displayName = this.getDisplayNameForCodegen(_.get(this.state, 'activeLanguage.language'), _.get(this.state, 'activeLanguage.variant'));
    return (
      <div className='experimental-request-editor-snippet-generator-wrapper'>
        <div className='experimental-request-editor-snippet-generator-editor-options-pane'>
          <div className='experimental-request-editor-snippet-generator-header language-settings-subtitle'>
            <div className='experimental-request-editor-snippet-generator-header__section-left'>
              <span className='experimental-request-editor-snippet-generator-header-label'>
                Settings for {displayName}
              </span>
            </div>
          </div>
          <div className='experimental-request-editor-snippet-generator-options-settings-content'>
            <div className='experimental-request-editor-snippet-generator-options'>
              {this.state.languageSettingsLoading ?
                <LoadingIndicator /> :
                <ConfigurationsComponent
                  isOpen
                  optionsArray={this.state.optionsArray}
                  optionsPreference={this.state.optionsPreference}
                  onSubmit={this.handleSubmitOptions}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
