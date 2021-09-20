import { Heading, Loading } from '@udacity/veritas-components';
import { I18N_CONSTANTS, __, i18n } from 'services/localization-service';

import Actions from 'actions';
import AnalyticsMixin from 'mixins/analytics-mixin';
import LocaleHelper from 'helpers/locale-helper';
import SettingButtons from './_setting-buttons';
import UReactSelect from '@udacity/ureact-select';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './setting-language-preference.scss';

var mapDispatchToProps = (dispatch) => ({
  onUpdateUser: ({ language }) =>
    dispatch(Actions.updateLanguage({ language })),
});

export default connect(
  null,
  mapDispatchToProps
)(
  cssModule(
    createReactClass({
      displayName: 'settings/setting-language-preference',

      mixins: [AnalyticsMixin],

      getInitialState() {
        var language = i18n.getLocale();
        return {
          language: language || '',
          placeholder: i18n.getLanguage(),
          updating: false,
        };
      },

      handleCancelClick() {
        this.setState({
          language: i18n.getLocale(),
        });
      },

      handleOptionChange(newValue) {
        return this.setState({
          language: newValue.value,
          placeholder: newValue.label,
        });
      },

      handleSaveClick() {
        // update the locale
        i18n._setLocale(this.state.language);

        LocaleHelper.setDocumentLanguage(this.state.language);

        this.track('Language Changed', {
          language: this.state.language,
        });

        this.setState({
          updating: true,
        });

        return this.props.onUpdateUser(_.pick(this.state, ['language']));
      },

      render() {
        const { updating } = this.state;

        return (
          <section styleName="content-container">
            <div styleName="main">
              <Heading size="h3" as="h1">
                {__('Language Preference')}
              </Heading>
              <form styleName="drop-down">
                <UReactSelect
                  name="Language Preference"
                  options={_.map(I18N_CONSTANTS.LOCALE_MAP, (lang, code) => {
                    return { value: code, label: lang };
                  })}
                  placeholder={this.state.placeholder}
                  searchable={false}
                  clearable={false}
                  onChange={this.handleOptionChange}
                />
              </form>
            </div>
            {updating ? (
              <div styleName="spinner">
                <Loading label={__('Loading')} />
              </div>
            ) : (
              <SettingButtons
                onSaveClick={this.handleSaveClick}
                onCancelClick={this.handleCancelClick}
              />
            )}
          </section>
        );
      },
    }),
    styles
  )
);
