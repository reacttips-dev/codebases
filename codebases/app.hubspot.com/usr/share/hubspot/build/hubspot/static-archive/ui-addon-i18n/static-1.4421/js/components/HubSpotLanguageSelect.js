'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import LanguageNames from '../constants/LanguageNames';
import findLanguage from '../internal/utils/findLanguage';
import { overrideTextTo } from '../internal/constants/LanguageOverrides';
import sortOptions from '../internal/utils/sortOptions';
import * as BetaLocales from '../internal/constants/BetaLocales';

var getLanguageOptions = function getLanguageOptions(_ref) {
  var languages = _ref.languages,
      validLanguages = _ref.validLanguages,
      optionsFilter = _ref.optionsFilter,
      useLanguageSetting = _ref.useLanguageSetting;
  var languageOptions = [];
  var languageKeys = Object.keys(languages);

  if (!languageKeys.length) {
    return languageOptions;
  }

  var betaBadge = {
    use: 'beta',
    text: I18n.text('i18nAddon.languagesBeta')
  };

  var addToLanguageOptions = function addToLanguageOptions(languageData, displayText) {
    languageOptions.push({
      badge: !useLanguageSetting && languageData.beta ? betaBadge : null,
      optionsFilter: PropTypes.func,
      text: displayText,
      value: languageData.language
    });
  };

  var overrideTextAndAddLanguage = function overrideTextAndAddLanguage(languageData) {
    var language = languageData.language;
    var validLanguageKey = overrideTextTo[language] || language;
    var displayText = useLanguageSetting ? I18n.text("i18nAddon.languages." + validLanguageKey) : LanguageNames[validLanguageKey];
    addToLanguageOptions(languageData, displayText);
  };

  if (validLanguages) {
    validLanguages.forEach(function (lang) {
      var languageData = languages[lang];

      if (languageData) {
        overrideTextAndAddLanguage(languageData);
      }
    });
  } else {
    languageKeys.forEach(function (lang) {
      var languageData = languages[lang];
      overrideTextAndAddLanguage(languageData);
    });
  }

  if (optionsFilter) {
    return languageOptions.filter(optionsFilter);
  }

  return languageOptions;
};

var HubSpotLanguageSelect = createReactClass({
  displayName: "HubSpotLanguageSelect",
  propTypes: {
    isPublic: PropTypes.bool,
    useBetaLanguages: PropTypes.bool,
    useLanguageSetting: PropTypes.bool,
    validLanguages: PropTypes.array
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isPublic: false,
      useBetaLanguages: false,
      useLanguageSetting: false,
      betaLocales: BetaLocales.betaLocales,
      betaPublicLocales: BetaLocales.betaPublicLocales
    };
  },
  handleLanguageChange: function handleLanguageChange(values, options, onChange, multi) {
    var selectedLang = findLanguage(options, values, multi);
    return onChange ? onChange(selectedLang) : selectedLang;
  },
  guessLanguageProps: function guessLanguageProps(options, props) {
    if (!props.value && !props.defaultValue) {
      return props;
    }

    var validProps = Object.assign({}, props);
    var bestGuess = {
      value: null,
      defaultValue: null
    };

    var checkRegexMatch = function checkRegexMatch(localeRegex, value) {
      if (typeof value === 'string') {
        return value.match(localeRegex);
      }

      var allMatch = true;
      value.forEach(function (val) {
        if (!val.match(localeRegex)) {
          allMatch = false;
        }
      });
      return allMatch;
    };

    var localeRegex = /^\w{2}(-\w*)?$/g;
    var isValidValue = props.value && checkRegexMatch(localeRegex, props.value);
    var isValidDefaultValue = props.defaultValue && checkRegexMatch(localeRegex, props.defaultValue);
    var valueObject = {
      value: {},
      defaultValue: {}
    };

    var findMatches = function findMatches(type, optionValue) {
      var propValue = props[type];

      if (typeof propValue === 'string') {
        if (optionValue === propValue) {
          bestGuess[type] = optionValue;
        } else if (!bestGuess[type] && propValue.startsWith(optionValue)) {
          bestGuess[type] = optionValue;
        }
      } else {
        propValue.forEach(function (value) {
          if (optionValue === value) {
            valueObject[type][value] = optionValue;
          } else if (!valueObject[value] && value.startsWith(optionValue)) {
            valueObject[type][value] = optionValue;
          }
        });
      }
    };

    options.forEach(function (option) {
      if (isValidValue) {
        findMatches('value', option.value);
      }

      if (isValidDefaultValue) {
        findMatches('defaultValue', option.value);
      }
    });

    var addToProps = function addToProps(type) {
      var val = [];
      Object.values(valueObject[type]).forEach(function (value) {
        val.push(value);
      });
      validProps[type] = val;
    };

    if (bestGuess.value) {
      validProps.value = bestGuess.value;
    } else if (isValidValue && props.value) {
      addToProps('value');
    }

    if (bestGuess.defaultValue) {
      validProps.defaultValue = bestGuess.defaultValue;
    } else if (isValidDefaultValue && props.defaultValue) {
      addToProps('defaultValue');
    }

    return validProps;
  },
  render: function render() {
    var _this = this;

    var _this$props = this.props,
        _onChange = _this$props.onChange,
        validLanguages = _this$props.validLanguages,
        isPublic = _this$props.isPublic,
        optionsFilter = _this$props.optionsFilter,
        useLanguageSetting = _this$props.useLanguageSetting,
        useBetaLanguages = _this$props.useBetaLanguages,
        betaLocales = _this$props.betaLocales,
        betaPublicLocales = _this$props.betaPublicLocales,
        passThroughProps = _objectWithoutProperties(_this$props, ["onChange", "validLanguages", "isPublic", "optionsFilter", "useLanguageSetting", "useBetaLanguages", "betaLocales", "betaPublicLocales"]);

    var options = isPublic ? Object.assign({}, I18n.baseLocales, {}, I18n.publicLocales) : Object.assign({}, I18n.baseLocales);

    if (useBetaLanguages) {
      var betaLocalesToUse = isPublic ? betaPublicLocales : betaLocales;
      options = Object.assign({}, options, {}, betaLocalesToUse);
    }

    var languageOptions = getLanguageOptions({
      languages: options,
      validLanguages: validLanguages,
      optionsFilter: optionsFilter,
      useLanguageSetting: useLanguageSetting
    }).sort(sortOptions);
    var validProps = this.guessLanguageProps(languageOptions, passThroughProps);
    return /*#__PURE__*/_jsx(UISelect, Object.assign({}, validProps, {
      onChange: function onChange(evt) {
        return _this.handleLanguageChange(evt.target.value, options, _onChange, validProps.multi);
      },
      options: languageOptions
    }));
  }
});
export default HubSpotLanguageSelect;