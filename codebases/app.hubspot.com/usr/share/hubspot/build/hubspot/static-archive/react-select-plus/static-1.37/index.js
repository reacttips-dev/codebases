'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';

function arrowRenderer(_ref) {
  var onMouseDown = _ref.onMouseDown;
  return /*#__PURE__*/React.createElement("span", {
    className: "Select-arrow",
    onMouseDown: onMouseDown
  });
}

var map = [{
  'base': 'A',
  'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
}, {
  'base': 'AA',
  'letters': /[\uA732]/g
}, {
  'base': 'AE',
  'letters': /[\u00C6\u01FC\u01E2]/g
}, {
  'base': 'AO',
  'letters': /[\uA734]/g
}, {
  'base': 'AU',
  'letters': /[\uA736]/g
}, {
  'base': 'AV',
  'letters': /[\uA738\uA73A]/g
}, {
  'base': 'AY',
  'letters': /[\uA73C]/g
}, {
  'base': 'B',
  'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
}, {
  'base': 'C',
  'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
}, {
  'base': 'D',
  'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
}, {
  'base': 'DZ',
  'letters': /[\u01F1\u01C4]/g
}, {
  'base': 'Dz',
  'letters': /[\u01F2\u01C5]/g
}, {
  'base': 'E',
  'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
}, {
  'base': 'F',
  'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
}, {
  'base': 'G',
  'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
}, {
  'base': 'H',
  'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
}, {
  'base': 'I',
  'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
}, {
  'base': 'J',
  'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g
}, {
  'base': 'K',
  'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
}, {
  'base': 'L',
  'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
}, {
  'base': 'LJ',
  'letters': /[\u01C7]/g
}, {
  'base': 'Lj',
  'letters': /[\u01C8]/g
}, {
  'base': 'M',
  'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
}, {
  'base': 'N',
  'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
}, {
  'base': 'NJ',
  'letters': /[\u01CA]/g
}, {
  'base': 'Nj',
  'letters': /[\u01CB]/g
}, {
  'base': 'O',
  'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
}, {
  'base': 'OI',
  'letters': /[\u01A2]/g
}, {
  'base': 'OO',
  'letters': /[\uA74E]/g
}, {
  'base': 'OU',
  'letters': /[\u0222]/g
}, {
  'base': 'P',
  'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
}, {
  'base': 'Q',
  'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
}, {
  'base': 'R',
  'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
}, {
  'base': 'S',
  'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
}, {
  'base': 'T',
  'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
}, {
  'base': 'TZ',
  'letters': /[\uA728]/g
}, {
  'base': 'U',
  'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
}, {
  'base': 'V',
  'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
}, {
  'base': 'VY',
  'letters': /[\uA760]/g
}, {
  'base': 'W',
  'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
}, {
  'base': 'X',
  'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
}, {
  'base': 'Y',
  'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
}, {
  'base': 'Z',
  'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
}, {
  'base': 'a',
  'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
}, {
  'base': 'aa',
  'letters': /[\uA733]/g
}, {
  'base': 'ae',
  'letters': /[\u00E6\u01FD\u01E3]/g
}, {
  'base': 'ao',
  'letters': /[\uA735]/g
}, {
  'base': 'au',
  'letters': /[\uA737]/g
}, {
  'base': 'av',
  'letters': /[\uA739\uA73B]/g
}, {
  'base': 'ay',
  'letters': /[\uA73D]/g
}, {
  'base': 'b',
  'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
}, {
  'base': 'c',
  'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
}, {
  'base': 'd',
  'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
}, {
  'base': 'dz',
  'letters': /[\u01F3\u01C6]/g
}, {
  'base': 'e',
  'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
}, {
  'base': 'f',
  'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
}, {
  'base': 'g',
  'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
}, {
  'base': 'h',
  'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
}, {
  'base': 'hv',
  'letters': /[\u0195]/g
}, {
  'base': 'i',
  'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
}, {
  'base': 'j',
  'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
}, {
  'base': 'k',
  'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
}, {
  'base': 'l',
  'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
}, {
  'base': 'lj',
  'letters': /[\u01C9]/g
}, {
  'base': 'm',
  'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
}, {
  'base': 'n',
  'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
}, {
  'base': 'nj',
  'letters': /[\u01CC]/g
}, {
  'base': 'o',
  'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
}, {
  'base': 'oi',
  'letters': /[\u01A3]/g
}, {
  'base': 'ou',
  'letters': /[\u0223]/g
}, {
  'base': 'oo',
  'letters': /[\uA74F]/g
}, {
  'base': 'p',
  'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
}, {
  'base': 'q',
  'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
}, {
  'base': 'r',
  'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
}, {
  'base': 's',
  'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
}, {
  'base': 't',
  'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
}, {
  'base': 'tz',
  'letters': /[\uA729]/g
}, {
  'base': 'u',
  'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
}, {
  'base': 'v',
  'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
}, {
  'base': 'vy',
  'letters': /[\uA761]/g
}, {
  'base': 'w',
  'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
}, {
  'base': 'x',
  'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
}, {
  'base': 'y',
  'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
}, {
  'base': 'z',
  'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
}];

var stripDiacritics = function stripDiacritics(str) {
  for (var i = 0; i < map.length; i++) {
    str = str.replace(map[i].letters, map[i].base);
  }

  return str;
};

function filterOptions(options, filterValue, excludeOptions, props) {
  var _this = this;

  if (props.ignoreAccents) {
    filterValue = stripDiacritics(filterValue);
  }

  if (props.ignoreCase) {
    filterValue = filterValue.toLowerCase();
  }

  if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
    return i[props.valueKey];
  });
  return options.filter(function (option) {
    if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
    if (props.filterOption) return props.filterOption.call(_this, option, filterValue);
    if (!filterValue) return true;
    var valueTest = String(option[props.valueKey]);
    var labelTest = String(option[props.labelKey]);

    if (props.ignoreAccents) {
      if (props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
      if (props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
    }

    if (props.ignoreCase) {
      if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
      if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
    }

    return props.matchPos === 'start' ? props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
  });
}

function isGroup(option) {
  return option && Array.isArray(option.options);
}

function menuRenderer(_ref2) {
  var focusedOption = _ref2.focusedOption,
      instancePrefix = _ref2.instancePrefix,
      labelKey = _ref2.labelKey,
      onFocus = _ref2.onFocus,
      onOptionRef = _ref2.onOptionRef,
      onSelect = _ref2.onSelect,
      optionClassName = _ref2.optionClassName,
      optionComponent = _ref2.optionComponent,
      optionGroupComponent = _ref2.optionGroupComponent,
      optionRenderer = _ref2.optionRenderer,
      options = _ref2.options,
      valueArray = _ref2.valueArray,
      valueKey = _ref2.valueKey;
  var OptionGroup = optionGroupComponent;
  var Option = optionComponent;
  var renderLabel = optionRenderer || this.getOptionLabel;

  var renderOptions = function renderOptions(optionsSubset) {
    return optionsSubset.map(function (option, i) {
      if (isGroup(option)) {
        var optionGroupClass = 'Select-option-group';
        return /*#__PURE__*/React.createElement(OptionGroup, {
          className: optionGroupClass,
          key: "option-group-" + i,
          label: renderLabel(option),
          option: option,
          optionIndex: i
        }, renderOptions(option.options));
      } else {
        var isSelected = valueArray && valueArray.indexOf(option) > -1;
        var isFocused = option === focusedOption;
        var optionClass = classNames(optionClassName, 'Select-option', isSelected && 'is-selected', isFocused && 'is-focused', option.disabled && 'is-disabled');
        return /*#__PURE__*/React.createElement(Option, {
          className: optionClass,
          instancePrefix: instancePrefix,
          isDisabled: option.disabled,
          isFocused: isFocused,
          isSelected: isSelected,
          key: "option-" + i + "-" + option[valueKey],
          onFocus: onFocus,
          onSelect: onSelect,
          option: option,
          optionIndex: i,
          ref: function ref(_ref3) {
            onOptionRef(_ref3, isFocused);
          }
        }, renderLabel(option, i));
      }
    });
  };

  return renderOptions(options);
}

function clearRenderer() {
  return /*#__PURE__*/React.createElement("span", {
    className: "Select-clear",
    dangerouslySetInnerHTML: {
      __html: '&times;'
    }
  });
}

var propTypes = process.env.NODE_ENV !== "production" ? {
  autoload: PropTypes.bool.isRequired,
  // automatically call the `loadOptions` prop on-mount; defaults to true
  cache: PropTypes.any,
  // object to use to cache results; set to null/false to disable caching
  children: PropTypes.func.isRequired,
  // Child function responsible for creating the inner Select component; (props: Object): PropTypes.element
  ignoreAccents: PropTypes.bool,
  // strip diacritics when filtering; defaults to true
  ignoreCase: PropTypes.bool,
  // perform case-insensitive filtering; defaults to true
  loadingPlaceholder: PropTypes.oneOfType([// replaces the placeholder while options are loading
  PropTypes.string, PropTypes.node]),
  loadOptions: PropTypes.func.isRequired,
  // callback to load options asynchronously; (inputValue: string, callback: Function): ?Promise
  multi: PropTypes.bool,
  // multi-value input
  options: PropTypes.array.isRequired,
  // array of options
  placeholder: PropTypes.oneOfType([// field placeholder, displayed when there's no value (shared with Select)
  PropTypes.string, PropTypes.node]),
  noResultsText: PropTypes.oneOfType([// field noResultsText, displayed when no options come back from the server
  PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  // onChange handler: function (newValue) {}
  searchPromptText: PropTypes.oneOfType([// label to prompt for search input
  PropTypes.string, PropTypes.node]),
  onInputChange: PropTypes.func,
  // optional for keeping track of what is being typed
  value: PropTypes.any // initial field value

} : {};
var defaultCache = {};
var defaultProps = {
  autoload: true,
  cache: defaultCache,
  children: defaultChildren,
  ignoreAccents: true,
  ignoreCase: true,
  loadingPlaceholder: 'Loading...',
  options: [],
  searchPromptText: 'Type to search'
};

var Async = /*#__PURE__*/function (_Component) {
  _inherits(Async, _Component);

  function Async(props, context) {
    var _this2;

    _classCallCheck(this, Async);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Async).call(this, props, context));
    _this2._cache = props.cache === defaultCache ? {} : props.cache;
    _this2.state = {
      isLoading: false,
      options: props.options
    };
    _this2._onInputChange = _this2._onInputChange.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(Async, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var autoload = this.props.autoload;

      if (autoload) {
        this.loadOptions('');
      }
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      var _this3 = this;

      var propertiesToSync = ['isLoading', 'options'];
      propertiesToSync.forEach(function (prop) {
        if (_this3.props[prop] !== nextProps[prop]) {
          _this3.setState(_defineProperty({}, prop, nextProps[prop]));
        }
      });
    }
  }, {
    key: "clearOptions",
    value: function clearOptions() {
      this.setState({
        options: []
      });
    }
  }, {
    key: "loadOptions",
    value: function loadOptions(inputValue) {
      var _this4 = this;

      var loadOptions = this.props.loadOptions;
      var cache = this._cache;

      if (cache && cache.hasOwnProperty(inputValue)) {
        this.setState({
          options: cache[inputValue]
        });
        return;
      }

      var callback = function callback(error, data) {
        if (callback === _this4._callback) {
          _this4._callback = null;
          var options = data && data.options || [];

          if (cache) {
            cache[inputValue] = options;
          }

          _this4.setState({
            isLoading: false,
            options: options
          });
        }
      }; // Ignore all but the most recent request


      this._callback = callback;
      var promise = loadOptions(inputValue, callback);

      if (promise) {
        promise.then(function (data) {
          return callback(null, data);
        }, function (error) {
          return callback(error);
        });
      }

      if (this._callback && !this.state.isLoading) {
        this.setState({
          isLoading: true
        });
      }

      return inputValue;
    }
  }, {
    key: "_onInputChange",
    value: function _onInputChange(inputValue) {
      var _this$props = this.props,
          ignoreAccents = _this$props.ignoreAccents,
          ignoreCase = _this$props.ignoreCase,
          onInputChange = _this$props.onInputChange;
      var newInputValue = inputValue;

      if (onInputChange) {
        var value = onInputChange(newInputValue); // Note: != used deliberately here to catch undefined and null

        if (value != null && typeof value !== 'object') {
          newInputValue = '' + value;
        }
      }

      var transformedInputValue = newInputValue;

      if (ignoreAccents) {
        transformedInputValue = stripDiacritics(transformedInputValue);
      }

      if (ignoreCase) {
        transformedInputValue = transformedInputValue.toLowerCase();
      }

      this.loadOptions(transformedInputValue); // Return new input value, but without applying toLowerCase() to avoid modifying the user's view case of the input while typing.

      return newInputValue;
    }
  }, {
    key: "inputValue",
    value: function inputValue() {
      if (this.select) {
        return this.select.state.inputValue;
      }

      return '';
    }
  }, {
    key: "noResultsText",
    value: function noResultsText() {
      var _this$props2 = this.props,
          loadingPlaceholder = _this$props2.loadingPlaceholder,
          noResultsText = _this$props2.noResultsText,
          searchPromptText = _this$props2.searchPromptText;
      var isLoading = this.state.isLoading;
      var inputValue = this.inputValue();

      if (isLoading) {
        return loadingPlaceholder;
      }

      if (inputValue && noResultsText) {
        return noResultsText;
      }

      return searchPromptText;
    }
  }, {
    key: "focus",
    value: function focus() {
      this.select.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$props3 = this.props,
          children = _this$props3.children,
          loadingPlaceholder = _this$props3.loadingPlaceholder,
          placeholder = _this$props3.placeholder;
      var _this$state = this.state,
          isLoading = _this$state.isLoading,
          options = _this$state.options;
      var props = {
        noResultsText: this.noResultsText(),
        placeholder: isLoading ? loadingPlaceholder : placeholder,
        options: isLoading && loadingPlaceholder ? [] : options,
        ref: function ref(_ref4) {
          return _this5.select = _ref4;
        }
      };
      return children(Object.assign({}, this.props, {}, props, {
        isLoading: isLoading,
        onInputChange: this._onInputChange
      }));
    }
  }]);

  return Async;
}(Component);

Async.propTypes = propTypes;
Async.defaultProps = defaultProps;

function defaultChildren(props) {
  return /*#__PURE__*/React.createElement(Select, props);
}

function reduce(obj) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(obj).reduce(function (props, key) {
    var value = obj[key];
    if (value !== undefined) props[key] = value;
    return props;
  }, props);
}

var AsyncCreatable = createReactClass({
  displayName: 'AsyncCreatableSelect',
  focus: function focus() {
    this.select.focus();
  },
  render: function render() {
    var _this6 = this;

    return /*#__PURE__*/React.createElement(Select.Async, this.props, function (asyncProps) {
      return /*#__PURE__*/React.createElement(Select.Creatable, _this6.props, function (creatableProps) {
        return /*#__PURE__*/React.createElement(Select, Object.assign({}, reduce(asyncProps, reduce(creatableProps, {})), {
          onInputChange: function onInputChange(input) {
            creatableProps.onInputChange(input);
            return asyncProps.onInputChange(input);
          },
          ref: function ref(_ref5) {
            _this6.select = _ref5;
            creatableProps.ref(_ref5);
            asyncProps.ref(_ref5);
          }
        }));
      });
    });
  }
});
var Creatable = createReactClass({
  displayName: 'CreatableSelect',
  propTypes: process.env.NODE_ENV !== "production" ? {
    // Child function responsible for creating the inner Select component
    // This component can be used to compose HOCs (eg Creatable and Async)
    // (props: Object): PropTypes.element
    children: PropTypes.func,
    // See Select.propTypes.filterOptions
    filterOptions: PropTypes.any,
    // Searches for any matching option within the set of options.
    // This function prevents duplicate options from being created.
    // ({ option: Object, options: Array, labelKey: string, valueKey: string }): boolean
    isOptionUnique: PropTypes.func,
    // Determines if the current input text represents a valid option.
    // ({ label: string }): boolean
    isValidNewOption: PropTypes.func,
    // See Select.propTypes.menuRenderer
    menuRenderer: PropTypes.any,
    // Factory to create new option.
    // ({ label: string, labelKey: string, valueKey: string }): Object
    newOptionCreator: PropTypes.func,
    // input change handler: function (inputValue) {}
    onInputChange: PropTypes.func,
    // input keyDown handler: function (event) {}
    onInputKeyDown: PropTypes.func,
    // new option click handler: function (option) {}
    onNewOptionClick: PropTypes.func,
    // See Select.propTypes.options
    options: PropTypes.array,
    // Creates prompt/placeholder option text.
    // (filterText: string): string
    promptTextCreator: PropTypes.func,
    // Decides if a keyDown event (eg its `keyCode`) should result in the creation of a new option.
    shouldKeyDownEventCreateNewOption: PropTypes.func
  } : {},
  // Default prop methods
  statics: {
    isOptionUnique: isOptionUnique,
    isValidNewOption: isValidNewOption,
    newOptionCreator: newOptionCreator,
    promptTextCreator: promptTextCreator,
    shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
  },
  getDefaultProps: function getDefaultProps() {
    return {
      filterOptions: filterOptions,
      isOptionUnique: isOptionUnique,
      isValidNewOption: isValidNewOption,
      menuRenderer: menuRenderer,
      newOptionCreator: newOptionCreator,
      promptTextCreator: promptTextCreator,
      shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
    };
  },
  createNewOption: function createNewOption() {
    var _this$props4 = this.props,
        isValidNewOption = _this$props4.isValidNewOption,
        newOptionCreator = _this$props4.newOptionCreator,
        onNewOptionClick = _this$props4.onNewOptionClick,
        _this$props4$options = _this$props4.options,
        options = _this$props4$options === void 0 ? [] : _this$props4$options,
        shouldKeyDownEventCreateNewOption = _this$props4.shouldKeyDownEventCreateNewOption;

    if (isValidNewOption({
      label: this.inputValue
    })) {
      var option = newOptionCreator({
        label: this.inputValue,
        labelKey: this.labelKey,
        valueKey: this.valueKey
      });

      var _isOptionUnique = this.isOptionUnique({
        option: option
      }); // Don't add the same option twice.


      if (_isOptionUnique) {
        if (onNewOptionClick) {
          onNewOptionClick(option);
        } else {
          options.unshift(option);
          this.select.selectValue(option);
        }
      }
    }
  },
  filterOptions: function filterOptions() {
    var _this$props5 = this.props,
        filterOptions = _this$props5.filterOptions,
        isValidNewOption = _this$props5.isValidNewOption,
        options = _this$props5.options,
        promptTextCreator = _this$props5.promptTextCreator; // TRICKY Check currently selected options as well.
    // Don't display a create-prompt for a value that's selected.
    // This covers async edge-cases where a newly-created Option isn't yet in the async-loaded array.

    var excludeOptions = (arguments.length <= 2 ? undefined : arguments[2]) || [];
    var filteredOptions = filterOptions.apply(void 0, arguments) || [];

    if (isValidNewOption({
      label: this.inputValue
    })) {
      var _newOptionCreator = this.props.newOptionCreator;

      var option = _newOptionCreator({
        label: this.inputValue,
        labelKey: this.labelKey,
        valueKey: this.valueKey
      }); // TRICKY Compare to all options (not just filtered options) in case option has already been selected).
      // For multi-selects, this would remove it from the filtered list.


      var _isOptionUnique2 = this.isOptionUnique({
        option: option,
        options: excludeOptions.concat(filteredOptions)
      });

      if (_isOptionUnique2) {
        var prompt = promptTextCreator(this.inputValue);
        this._createPlaceholderOption = _newOptionCreator({
          label: prompt,
          labelKey: this.labelKey,
          valueKey: this.valueKey
        });
        filteredOptions.unshift(this._createPlaceholderOption);
      }
    }

    return filteredOptions;
  },
  isOptionUnique: function isOptionUnique(_ref6) {
    var option = _ref6.option,
        options = _ref6.options;
    var isOptionUnique = this.props.isOptionUnique;
    options = options || this.select.filterFlatOptions();
    return isOptionUnique({
      labelKey: this.labelKey,
      option: option,
      options: options,
      valueKey: this.valueKey
    });
  },
  menuRenderer: function menuRenderer(params) {
    var menuRenderer = this.props.menuRenderer;
    return menuRenderer(Object.assign({}, params, {
      onSelect: this.onOptionSelect,
      selectValue: this.onOptionSelect
    }));
  },
  onInputChange: function onInputChange(input) {
    var onInputChange = this.props.onInputChange;

    if (onInputChange) {
      onInputChange(input);
    } // This value may be needed in between Select mounts (when this.select is null)


    this.inputValue = input;
  },
  onInputKeyDown: function onInputKeyDown(event) {
    var _this$props6 = this.props,
        shouldKeyDownEventCreateNewOption = _this$props6.shouldKeyDownEventCreateNewOption,
        onInputKeyDown = _this$props6.onInputKeyDown;
    var focusedOption = this.select.getFocusedOption();

    if (focusedOption && focusedOption === this._createPlaceholderOption && shouldKeyDownEventCreateNewOption({
      keyCode: event.keyCode
    })) {
      this.createNewOption(); // Prevent decorated Select from doing anything additional with this keyDown event

      event.preventDefault();
    } else if (onInputKeyDown) {
      onInputKeyDown(event);
    }
  },
  onOptionSelect: function onOptionSelect(option, event) {
    if (option === this._createPlaceholderOption) {
      this.createNewOption();
    } else {
      this.select.selectValue(option);
    }
  },
  focus: function focus() {
    this.select.focus();
  },
  render: function render() {
    var _this7 = this;

    var _this$props7 = this.props,
        newOptionCreator = _this$props7.newOptionCreator,
        shouldKeyDownEventCreateNewOption = _this$props7.shouldKeyDownEventCreateNewOption,
        restProps = _objectWithoutProperties(_this$props7, ["newOptionCreator", "shouldKeyDownEventCreateNewOption"]);

    var children = this.props.children; // We can't use destructuring default values to set the children,
    // because it won't apply work if `children` is null. A falsy check is
    // more reliable in real world use-cases.

    if (!children) {
      children = defaultChildren$1;
    }

    var props = Object.assign({}, restProps, {
      allowCreate: true,
      filterOptions: this.filterOptions,
      menuRenderer: this.menuRenderer,
      onInputChange: this.onInputChange,
      onInputKeyDown: this.onInputKeyDown,
      ref: function ref(_ref7) {
        _this7.select = _ref7; // These values may be needed in between Select mounts (when this.select is null)

        if (_ref7) {
          _this7.labelKey = _ref7.props.labelKey;
          _this7.valueKey = _ref7.props.valueKey;
        }
      }
    });
    return children(props);
  }
});

function defaultChildren$1(props) {
  return /*#__PURE__*/React.createElement(Select, props);
}

function isOptionUnique(_ref8) {
  var option = _ref8.option,
      options = _ref8.options,
      labelKey = _ref8.labelKey,
      valueKey = _ref8.valueKey;
  return options.filter(function (existingOption) {
    return existingOption[labelKey] === option[labelKey] || existingOption[valueKey] === option[valueKey];
  }).length === 0;
}

function isValidNewOption(_ref9) {
  var label = _ref9.label;
  return !!label;
}

function newOptionCreator(_ref10) {
  var label = _ref10.label,
      labelKey = _ref10.labelKey,
      valueKey = _ref10.valueKey;
  var option = {};
  option[valueKey] = label;
  option[labelKey] = label;
  option.className = 'Select-create-option-placeholder';
  return option;
}

function promptTextCreator(label) {
  return "Create option \"" + label + "\"";
}

function shouldKeyDownEventCreateNewOption(_ref11) {
  var keyCode = _ref11.keyCode;

  switch (keyCode) {
    case 9: // TAB

    case 13: // ENTER

    case 188:
      // COMMA
      return true;
  }

  return false;
}

var Dropdown = createReactClass({
  displayName: "Dropdown",
  propTypes: process.env.NODE_ENV !== "production" ? {
    children: PropTypes.node
  } : {},
  render: function render() {
    // This component adds no markup
    return this.props.children;
  }
});
var Option = createReactClass({
  displayName: "Option",
  propTypes: process.env.NODE_ENV !== "production" ? {
    children: PropTypes.node,
    className: PropTypes.string,
    // className (based on mouse position)
    instancePrefix: PropTypes.string.isRequired,
    // unique prefix for the ids (used for aria)
    isDisabled: PropTypes.bool,
    // the option is disabled
    isFocused: PropTypes.bool,
    // the option is focused
    isSelected: PropTypes.bool,
    // the option is selected
    onFocus: PropTypes.func,
    // method to handle mouseEnter on option element
    onSelect: PropTypes.func,
    // method to handle click on option element
    onUnfocus: PropTypes.func,
    // method to handle mouseLeave on option element
    option: PropTypes.object.isRequired,
    // object that is base for that option
    optionIndex: PropTypes.number // index of the option, used to generate unique ids for aria

  } : {},
  blockEvent: function blockEvent(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.tagName !== 'A' || !('href' in event.target)) {
      return;
    }

    if (event.target.target) {
      window.open(event.target.href, event.target.target);
    } else {
      window.location.href = event.target.href;
    }
  },
  handleMouseDown: function handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  },
  handleMouseEnter: function handleMouseEnter(event) {
    this.onFocus(event);
  },
  handleMouseMove: function handleMouseMove(event) {
    this.onFocus(event);
  },
  handleTouchEnd: function handleTouchEnd(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;
    this.handleMouseDown(event);
  },
  handleTouchMove: function handleTouchMove(event) {
    // Set a flag that the view is being dragged
    this.dragging = true;
  },
  handleTouchStart: function handleTouchStart(event) {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  },
  onFocus: function onFocus(event) {
    if (!this.props.isFocused) {
      this.props.onFocus(this.props.option, event);
    }
  },
  render: function render() {
    var _this$props8 = this.props,
        option = _this$props8.option,
        instancePrefix = _this$props8.instancePrefix,
        optionIndex = _this$props8.optionIndex;
    var className = classNames(this.props.className, option.className);
    return option.disabled ? /*#__PURE__*/React.createElement("div", {
      className: className,
      onMouseDown: this.blockEvent,
      onClick: this.blockEvent
    }, this.props.children) : /*#__PURE__*/React.createElement("div", {
      className: className,
      style: option.style,
      role: "option",
      onMouseDown: this.handleMouseDown,
      onMouseEnter: this.handleMouseEnter,
      onMouseMove: this.handleMouseMove,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
      id: instancePrefix + '-option-' + optionIndex,
      title: option.title
    }, this.props.children);
  }
});
var OptionGroup = createReactClass({
  displayName: "OptionGroup",
  propTypes: process.env.NODE_ENV !== "production" ? {
    children: PropTypes.any,
    className: PropTypes.string,
    // className (based on mouse position)
    label: PropTypes.node,
    // the heading to show above the child options
    option: PropTypes.object.isRequired // object that is base for that option group

  } : {},
  blockEvent: function blockEvent(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.tagName !== 'A' || !('href' in event.target)) {
      return;
    }

    if (event.target.target) {
      window.open(event.target.href, event.target.target);
    } else {
      window.location.href = event.target.href;
    }
  },
  handleMouseDown: function handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  },
  handleTouchEnd: function handleTouchEnd(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;
    this.handleMouseDown(event);
  },
  handleTouchMove: function handleTouchMove(event) {
    // Set a flag that the view is being dragged
    this.dragging = true;
  },
  handleTouchStart: function handleTouchStart(event) {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  },
  render: function render() {
    var option = this.props.option;
    var className = classNames(this.props.className, option.className);
    return option.disabled ? /*#__PURE__*/React.createElement("div", {
      className: className,
      onMouseDown: this.blockEvent,
      onClick: this.blockEvent
    }, this.props.children) : /*#__PURE__*/React.createElement("div", {
      className: className,
      style: option.style,
      onMouseDown: this.handleMouseDown,
      onMouseEnter: this.handleMouseEnter,
      onMouseMove: this.handleMouseMove,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
      title: option.title
    }, /*#__PURE__*/React.createElement("div", {
      className: "Select-option-group-label"
    }, this.props.label), this.props.children);
  }
});
var Value = createReactClass({
  displayName: 'Value',
  propTypes: process.env.NODE_ENV !== "production" ? {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    // disabled prop passed to ReactSelect
    id: PropTypes.string,
    // Unique id for the value - used for aria
    onClick: PropTypes.func,
    // method to handle click on value label
    onRemove: PropTypes.func,
    // method to handle removal of the value
    value: PropTypes.object.isRequired // the option object for this value

  } : {},
  handleMouseDown: function handleMouseDown(event) {
    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    if (this.props.onClick) {
      event.stopPropagation();
      this.props.onClick(this.props.value, event);
      return;
    }

    if (this.props.value.href) {
      event.stopPropagation();
    }
  },
  onRemove: function onRemove(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onRemove(this.props.value);
  },
  handleTouchEndRemove: function handleTouchEndRemove(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return; // Fire the mouse events

    this.onRemove(event);
  },
  handleTouchMove: function handleTouchMove(event) {
    // Set a flag that the view is being dragged
    this.dragging = true;
  },
  handleTouchStart: function handleTouchStart(event) {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  },
  renderRemoveIcon: function renderRemoveIcon() {
    if (this.props.disabled || !this.props.onRemove) return;
    return /*#__PURE__*/React.createElement("span", {
      className: "Select-value-icon",
      "aria-hidden": "true",
      onMouseDown: this.onRemove,
      onTouchEnd: this.handleTouchEndRemove,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove
    }, "\xD7");
  },
  renderLabel: function renderLabel() {
    var className = 'Select-value-label';
    return this.props.onClick || this.props.value.href ? /*#__PURE__*/React.createElement("a", {
      className: className,
      href: this.props.value.href,
      target: this.props.value.target,
      onMouseDown: this.handleMouseDown,
      onTouchEnd: this.handleMouseDown
    }, this.props.children) : /*#__PURE__*/React.createElement("span", {
      className: className,
      role: "option",
      "aria-selected": "true",
      id: this.props.id
    }, this.props.children);
  },
  render: function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames('Select-value', this.props.value.className),
      style: this.props.value.style,
      title: this.props.value.title
    }, this.renderRemoveIcon(), this.renderLabel());
  }
});

function clone(obj) {
  var copy = {};

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  }

  return copy;
}

function isGroup$1(option) {
  return option && Array.isArray(option.options);
}

function stringifyValue(value) {
  var valueType = typeof value;

  if (valueType === 'string') {
    return value;
  } else if (valueType === 'object') {
    return JSON.stringify(value);
  } else if (valueType === 'number' || valueType === 'boolean') {
    return String(value);
  } else {
    return '';
  }
}

var stringOrNode = PropTypes.oneOfType([PropTypes.string, PropTypes.node]);
var instanceId = 1;
var invalidOptions = {};
var Select = createReactClass({
  displayName: 'Select',
  propTypes: process.env.NODE_ENV !== "production" ? {
    addLabelText: PropTypes.string,
    // placeholder displayed when you want to add a label on a multi-value input
    'aria-describedby': PropTypes.string,
    // HTML ID(s) of element(s) that should be used to describe this input (for assistive tech)
    'aria-label': PropTypes.string,
    // Aria label (for assistive tech)
    'aria-labelledby': PropTypes.string,
    // HTML ID of an element that should be used as the label (for assistive tech)
    arrowRenderer: PropTypes.func,
    // Create drop-down caret element
    autoBlur: PropTypes.bool,
    // automatically blur the component when an option is selected
    autofocus: PropTypes.bool,
    // autofocus the component on mount
    autosize: PropTypes.bool,
    // whether to enable autosizing or not
    backspaceRemoves: PropTypes.bool,
    // whether backspace removes an item if there is no text input
    backspaceToRemoveMessage: PropTypes.string,
    // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
    className: PropTypes.string,
    // className for the outer element
    clearAllText: stringOrNode,
    // title for the "clear" control when multi: true
    clearRenderer: PropTypes.func,
    // create clearable x element
    clearValueText: stringOrNode,
    // title for the "clear" control
    clearable: PropTypes.bool,
    // should it be possible to reset value
    deleteRemoves: PropTypes.bool,
    // whether backspace removes an item if there is no text input
    delimiter: PropTypes.string,
    // delimiter to use to join multiple values for the hidden field value
    disabled: PropTypes.bool,
    // whether the Select is disabled or not
    dropdownComponent: PropTypes.func,
    // dropdown component to render the menu in
    escapeClearsValue: PropTypes.bool,
    // whether escape clears the value when the menu is closed
    filterOption: PropTypes.func,
    // method to filter a single option (option, filterString)
    filterOptions: PropTypes.any,
    // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
    ignoreAccents: PropTypes.bool,
    // whether to strip diacritics when filtering
    ignoreCase: PropTypes.bool,
    // whether to perform case-insensitive filtering
    inputProps: PropTypes.object,
    // custom attributes for the Input
    inputRenderer: PropTypes.func,
    // returns a custom input component
    instanceId: PropTypes.string,
    // set the components instanceId
    isLoading: PropTypes.bool,
    // whether the Select is loading externally or not (such as options being loaded)
    isOpen: PropTypes.bool,
    // whether the Select dropdown menu is open or not
    joinValues: PropTypes.bool,
    // joins multiple values into a single form field with the delimiter (legacy mode)
    labelKey: PropTypes.string,
    // path of the label value in option objects
    matchPos: PropTypes.string,
    // (any|start) match the start or entire string when filtering
    matchProp: PropTypes.string,
    // (any|label|value) which option property to filter on
    menuBuffer: PropTypes.number,
    // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
    menuContainerStyle: PropTypes.object,
    // optional style to apply to the menu container
    menuRenderer: PropTypes.func,
    // renders a custom menu with options
    menuStyle: PropTypes.object,
    // optional style to apply to the menu
    multi: PropTypes.bool,
    // multi-value input
    name: PropTypes.string,
    // generates a hidden <input /> tag with this field name for html forms
    noResultsText: stringOrNode,
    // placeholder displayed when there are no matching search results
    onBlur: PropTypes.func,
    // onBlur handler: function (event) {}
    onBlurResetsInput: PropTypes.bool,
    // whether input is cleared on blur
    onChange: PropTypes.func,
    // onChange handler: function (newValue) {}
    onClose: PropTypes.func,
    // fires when the menu is closed
    onCloseResetsInput: PropTypes.bool,
    // whether input is cleared when menu is closed through the arrow
    onFocus: PropTypes.func,
    // onFocus handler: function (event) {}
    onInputChange: PropTypes.func,
    // onInputChange handler: function (inputValue) {}
    onInputKeyDown: PropTypes.func,
    // input keyDown handler: function (event) {}
    onMenuScrollToBottom: PropTypes.func,
    // fires when the menu is scrolled to the bottom; can be used to paginate options
    onOpen: PropTypes.func,
    // fires when the menu is opened
    onValueClick: PropTypes.func,
    // onClick handler for value labels: function (value, event) {}
    openAfterFocus: PropTypes.bool,
    // boolean to enable opening dropdown when focused
    openOnFocus: PropTypes.bool,
    // always open options menu on focus
    optionClassName: PropTypes.string,
    // additional class(es) to apply to the <Option /> elements
    optionComponent: PropTypes.func,
    // option component to render in dropdown
    optionGroupComponent: PropTypes.func,
    // option group component to render in dropdown
    optionRenderer: PropTypes.func,
    // optionRenderer: function (option) {}
    options: PropTypes.array,
    // array of options
    pageSize: PropTypes.number,
    // number of entries to page when using page up/down keys
    placeholder: stringOrNode,
    // field placeholder, displayed when there's no value
    renderInvalidValues: PropTypes.bool,
    // boolean to enable rendering values that do not match any options
    required: PropTypes.bool,
    // applies HTML5 required attribute when needed
    resetValue: PropTypes.any,
    // value to use when you clear the control
    scrollMenuIntoView: PropTypes.bool,
    // boolean to enable the viewport to shift so that the full menu fully visible when engaged
    searchable: PropTypes.bool,
    // whether to enable searching feature or not
    simpleValue: PropTypes.bool,
    // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
    style: PropTypes.object,
    // optional style to apply to the control
    tabIndex: PropTypes.string,
    // optional tab index of the control
    tabSelectsValue: PropTypes.bool,
    // whether to treat tabbing out while focused to be value selection
    value: PropTypes.any,
    // initial field value
    valueComponent: PropTypes.func,
    // value component to render
    valueKey: PropTypes.string,
    // path of the label value in option objects
    valueRenderer: PropTypes.func,
    // valueRenderer: function (option) {}
    wrapperStyle: PropTypes.object // optional style to apply to the component wrapper

  } : {},
  statics: {
    Async: Async,
    AsyncCreatable: AsyncCreatable,
    Creatable: Creatable
  },
  getDefaultProps: function getDefaultProps() {
    return {
      addLabelText: 'Add "{label}"?',
      arrowRenderer: arrowRenderer,
      autosize: true,
      backspaceRemoves: true,
      backspaceToRemoveMessage: 'Press backspace to remove {label}',
      clearable: true,
      clearAllText: 'Clear all',
      clearRenderer: clearRenderer,
      clearValueText: 'Clear value',
      deleteRemoves: true,
      delimiter: ',',
      disabled: false,
      dropdownComponent: Dropdown,
      escapeClearsValue: true,
      filterOptions: filterOptions,
      ignoreAccents: true,
      ignoreCase: true,
      inputProps: {},
      isLoading: false,
      joinValues: false,
      labelKey: 'label',
      matchPos: 'any',
      matchProp: 'any',
      menuBuffer: 0,
      menuRenderer: menuRenderer,
      multi: false,
      noResultsText: 'No results found',
      onBlurResetsInput: true,
      onCloseResetsInput: true,
      openAfterFocus: false,
      optionComponent: Option,
      optionGroupComponent: OptionGroup,
      pageSize: 5,
      placeholder: 'Select...',
      renderInvalidValues: false,
      required: false,
      scrollMenuIntoView: true,
      searchable: true,
      simpleValue: false,
      tabSelectsValue: true,
      valueComponent: Value,
      valueKey: 'value'
    };
  },
  getInitialState: function getInitialState() {
    return {
      inputValue: '',
      isFocused: false,
      isOpen: this.props.isOpen != null ? this.props.isOpen : false,
      isPseudoFocused: false,
      required: false
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    this._flatOptions = this.flattenOptions(this.props.options);
    this._instancePrefix = 'react-select-' + (this.props.instanceId || ++instanceId) + '-';
    var valueArray = this.getValueArray(this.props.value);

    if (this.props.required) {
      this.setState({
        required: this.handleRequired(valueArray[0], this.props.multi)
      });
    }
  },
  componentDidMount: function componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this._flatOptions = this.flattenOptions(nextProps.options);
    }

    var valueArray = this.getValueArray(nextProps.value, nextProps);

    if (!nextProps.isOpen && this.props.isOpen) {
      this.closeMenu();
    }

    if (nextProps.required) {
      this.setState({
        required: this.handleRequired(valueArray[0], nextProps.multi)
      });
    }
  },
  UNSAFE_componentWillUpdate: function UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.isOpen !== this.state.isOpen) {
      this.toggleTouchOutsideEvent(nextState.isOpen);
      var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
      handler && handler();
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // focus to the selected option
    if (this.menu && this.focused && this.state.isOpen && !this.hasScrolledToOption) {
      var focusedOptionNode = ReactDOM.findDOMNode(this.focused);
      var focusedOptionPreviousSibling = focusedOptionNode.previousSibling;
      var focusedOptionParent = focusedOptionNode.parentElement;
      var menuNode = ReactDOM.findDOMNode(this.menu);

      if (focusedOptionPreviousSibling) {
        menuNode.scrollTop = focusedOptionPreviousSibling.offsetTop;
      } else if (focusedOptionParent && focusedOptionParent === 'Select-menu') {
        menuNode.scrollTop = focusedOptionParent.offsetTop;
      } else {
        menuNode.scrollTop = focusedOptionNode.offsetTop;
      }

      var paddingTop = parseInt(window.getComputedStyle(menuNode, null).paddingTop, 10);
      if (menuNode.scrollTop <= paddingTop) menuNode.scrollTop = 0;
      this.hasScrolledToOption = true;
    } else if (!this.state.isOpen) {
      this.hasScrolledToOption = false;
    }

    if (this._scrollToFocusedOptionOnUpdate && this.focused && this.menu) {
      this._scrollToFocusedOptionOnUpdate = false;
      var focusedDOM = ReactDOM.findDOMNode(this.focused);
      var menuDOM = ReactDOM.findDOMNode(this.menu);
      var focusedRect = focusedDOM.getBoundingClientRect();
      var menuRect = menuDOM.getBoundingClientRect();

      if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
        menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
      }
    }

    if (this.props.scrollMenuIntoView && this.menuContainer) {
      var menuContainerRect = this.menuContainer.getBoundingClientRect();

      if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
        window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
      }
    }

    if (prevProps.disabled !== this.props.disabled) {
      this.setState({
        isFocused: false
      }); // eslint-disable-line react/no-did-update-set-state

      this.closeMenu();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (!document.removeEventListener && document.detachEvent) {
      document.detachEvent('ontouchstart', this.handleTouchOutside);
    } else {
      document.removeEventListener('touchstart', this.handleTouchOutside);
    }
  },
  toggleTouchOutsideEvent: function toggleTouchOutsideEvent(enabled) {
    if (enabled) {
      if (!document.addEventListener && document.attachEvent) {
        document.attachEvent('ontouchstart', this.handleTouchOutside);
      } else {
        document.addEventListener('touchstart', this.handleTouchOutside);
      }
    } else {
      if (!document.removeEventListener && document.detachEvent) {
        document.detachEvent('ontouchstart', this.handleTouchOutside);
      } else {
        document.removeEventListener('touchstart', this.handleTouchOutside);
      }
    }
  },
  handleTouchOutside: function handleTouchOutside(event) {
    // handle touch outside on ios to dismiss menu
    if (this.wrapper && !this.wrapper.contains(event.target) && this.menuContainer && !this.menuContainer.contains(event.target)) {
      this.closeMenu();
    }
  },
  focus: function focus() {
    if (!this.input) return;
    this.input.focus();

    if (this.props.openAfterFocus) {
      this.setState({
        isOpen: true
      });
    }
  },
  blurInput: function blurInput() {
    if (!this.input) return;
    this.input.blur();
  },
  handleTouchMove: function handleTouchMove(event) {
    // Set a flag that the view is being dragged
    this.dragging = true;
  },
  handleTouchStart: function handleTouchStart(event) {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  },
  handleTouchEnd: function handleTouchEnd(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return; // Fire the mouse events

    this.handleMouseDown(event);
  },
  handleTouchEndClearValue: function handleTouchEndClearValue(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return; // Clear the value

    this.clearValue(event);
  },
  handleMouseDown: function handleMouseDown(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    if (event.target.tagName === 'INPUT') {
      return;
    } // prevent default event handlers


    event.stopPropagation();
    event.preventDefault(); // for the non-searchable select, toggle the menu

    if (!this.props.searchable) {
      this.focus();
      return this.setState({
        isOpen: !this.state.isOpen
      });
    }

    if (this.state.isFocused) {
      // On iOS, we can get into a state where we think the input is focused but it isn't really,
      // since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
      // Call focus() again here to be safe.
      this.focus();
      var input = this.input;

      if (typeof input.getInput === 'function') {
        // Get the actual DOM input if the ref is an <AutosizeInput /> component
        input = input.getInput();
      } // clears the value so that the cursor will be at the end of input when the component re-renders


      input.value = ''; // if the input is focused, ensure the menu is open

      this.setState({
        isOpen: true,
        isPseudoFocused: false
      });
    } else {
      // otherwise, focus the input and open the menu
      this._openAfterFocus = this.props.openOnFocus;
      this.focus();
    }
  },
  handleMouseDownOnArrow: function handleMouseDownOnArrow(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
      return;
    } // If the menu isn't open, let the event bubble to the main handleMouseDown


    if (!this.state.isOpen) {
      return;
    } // prevent default event handlers


    event.stopPropagation();
    event.preventDefault(); // close the menu

    this.closeMenu();
  },
  handleMouseDownOnMenu: function handleMouseDownOnMenu(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    this._openAfterFocus = true;
    this.focus();
  },
  closeMenu: function closeMenu() {
    var _this8 = this;

    if (this.props.onCloseResetsInput) {
      this.setState({
        isOpen: false,
        isPseudoFocused: this.state.isFocused && !this.props.multi,
        inputValue: ''
      }, function () {
        if (_this8.props.onInputChange) _this8.props.onInputChange('');
      });
    } else {
      this.setState({
        isOpen: false,
        isPseudoFocused: this.state.isFocused && !this.props.multi,
        inputValue: this.state.inputValue
      });
    }

    this.hasScrolledToOption = false;
  },
  handleInputFocus: function handleInputFocus(event) {
    if (this.props.disabled) return;
    var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }

    this.setState({
      isFocused: true,
      isOpen: isOpen
    });
    this._openAfterFocus = false;
  },
  handleInputBlur: function handleInputBlur(event) {
    // The check for menu.contains(activeElement) is necessary to prevent IE11's scrollbar from closing the menu in certain contexts.
    if (this.menu && (this.menu === document.activeElement || this.menu.contains(document.activeElement))) {
      this.focus();
      return;
    }

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    var onBlurredState = {
      isFocused: false,
      isOpen: false,
      isPseudoFocused: false
    };

    if (this.props.onBlurResetsInput) {
      onBlurredState.inputValue = '';
    }

    this.setState(onBlurredState);
  },
  handleInputChange: function handleInputChange(event) {
    var newInputValue = event.target.value;

    if (this.state.inputValue !== event.target.value && this.props.onInputChange) {
      var nextState = this.props.onInputChange(newInputValue); // Note: != used deliberately here to catch undefined and null

      if (nextState != null && typeof nextState !== 'object') {
        newInputValue = '' + nextState;
      }
    }

    this.setState({
      isOpen: true,
      isPseudoFocused: false,
      inputValue: newInputValue
    });
  },
  handleKeyDown: function handleKeyDown(event) {
    if (this.props.disabled) return;

    if (typeof this.props.onInputKeyDown === 'function') {
      this.props.onInputKeyDown(event);

      if (event.defaultPrevented) {
        return;
      }
    }

    switch (event.keyCode) {
      case 8:
        // backspace
        if (!this.state.inputValue && this.props.backspaceRemoves) {
          event.preventDefault();
          this.popValue();
        }

        return;

      case 9:
        // tab
        if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
          return;
        }

        this.selectFocusedOption();
        return;

      case 13:
        // enter
        if (!this.state.isOpen) {
          this.setState({
            isOpen: true
          });
          return;
        }

        event.stopPropagation();
        this.selectFocusedOption();
        break;

      case 27:
        // escape
        if (this.state.isOpen) {
          this.closeMenu();
          event.stopPropagation();
        } else if (this.props.clearable && this.props.escapeClearsValue) {
          this.clearValue(event);
          event.stopPropagation();
        }

        break;

      case 38:
        // up
        this.focusPreviousOption();
        break;

      case 40:
        // down
        this.focusNextOption();
        break;

      case 33:
        // page up
        this.focusPageUpOption();
        break;

      case 34:
        // page down
        this.focusPageDownOption();
        break;

      case 35:
        // end key
        if (event.shiftKey) {
          return;
        }

        this.focusEndOption();
        break;

      case 36:
        // home key
        if (event.shiftKey) {
          return;
        }

        this.focusStartOption();
        break;

      case 46:
        // backspace
        if (!this.state.inputValue && this.props.deleteRemoves) {
          event.preventDefault();
          this.popValue();
        }

        return;

      default:
        return;
    }

    event.preventDefault();
  },
  handleValueClick: function handleValueClick(option, event) {
    if (!this.props.onValueClick) return;
    this.props.onValueClick(option, event);
  },
  handleMenuScroll: function handleMenuScroll(event) {
    if (!this.props.onMenuScrollToBottom) return;
    var target = event.target;

    if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
      this.props.onMenuScrollToBottom();
    }
  },
  handleRequired: function handleRequired(value, multi) {
    if (!value) return true;
    return multi ? value.length === 0 : Object.keys(value).length === 0;
  },
  getOptionLabel: function getOptionLabel(op) {
    return op[this.props.labelKey];
  },

  /**
   * Turns a value into an array from the given options
   * @param	{String|Number|Array}	value		- the value of the select input
   * @param	{Object}		nextProps	- optionally specify the nextProps so the returned array uses the latest configuration
   * @returns	{Array}	the value of the select represented in an array
   */
  getValueArray: function getValueArray(value, nextProps) {
    var _this9 = this;

    /** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
    var props = typeof nextProps === 'object' ? nextProps : this.props;

    if (props.multi) {
      if (typeof value === 'string') value = value.split(props.delimiter);

      if (!Array.isArray(value)) {
        if (value === null || value === undefined) return [];
        value = [value];
      }

      return value.map(function (value) {
        return _this9.expandValue(value, props);
      }).filter(function (i) {
        return i;
      });
    }

    var expandedValue = this.expandValue(value, props);
    return expandedValue ? [expandedValue] : [];
  },

  /**
   * Retrieve a value from the given options and valueKey
   * @param	{String|Number|Array}	value	- the selected value(s)
   * @param	{Object}		props	- the Select component's props (or nextProps)
   */
  expandValue: function expandValue(value, props) {
    var valueType = typeof value;
    if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value;
    var _this$props9 = this.props,
        labelKey = _this$props9.labelKey,
        valueKey = _this$props9.valueKey,
        renderInvalidValues = _this$props9.renderInvalidValues;
    var options = this._flatOptions;
    if (!options || value === '') return;

    for (var i = 0; i < options.length; i++) {
      if (options[i][valueKey] === value) return options[i];
    } // no matching option, return an invalid option if renderInvalidValues is enabled


    if (renderInvalidValues) {
      var _ref12;

      invalidOptions[value] = invalidOptions[value] || (_ref12 = {
        invalid: true
      }, _defineProperty(_ref12, labelKey, value), _defineProperty(_ref12, valueKey, value), _ref12);
      return invalidOptions[value];
    }
  },
  setValue: function setValue(value) {
    var _this10 = this;

    if (this.props.autoBlur) {
      this.blurInput();
    }

    if (!this.props.onChange) return;

    if (this.props.required) {
      var required = this.handleRequired(value, this.props.multi);
      this.setState({
        required: required
      });
    }

    if (this.props.simpleValue && value) {
      value = this.props.multi ? value.map(function (i) {
        return i[_this10.props.valueKey];
      }).join(this.props.delimiter) : value[this.props.valueKey];
    }

    this.props.onChange(value);
  },
  selectValue: function selectValue(value) {
    var _this11 = this;

    //NOTE: update value in the callback to make sure the input value is empty so that there are no styling issues (Chrome had issue otherwise)
    this.hasScrolledToOption = false;

    if (this.props.multi) {
      this.setState({
        inputValue: '',
        focusedIndex: null
      }, function () {
        _this11.addValue(value);

        if (_this11.props.onInputChange) _this11.props.onInputChange('');
      });
    } else {
      this.setState({
        isOpen: false,
        inputValue: '',
        isPseudoFocused: this.state.isFocused
      }, function () {
        _this11.setValue(value);

        if (_this11.props.onInputChange) _this11.props.onInputChange('');
      });
    }
  },
  addValue: function addValue(value) {
    var valueArray = this.getValueArray(this.props.value);

    var visibleOptions = this._visibleOptions.filter(function (val) {
      return !val.disabled;
    });

    var lastValueIndex = visibleOptions.indexOf(value);
    this.setValue(valueArray.concat(value));

    if (visibleOptions.length - 1 === lastValueIndex) {
      // the last option was selected; focus the second-last one
      this.focusOption(visibleOptions[lastValueIndex - 1]);
    } else if (visibleOptions.length > lastValueIndex) {
      // focus the option below the selected one
      this.focusOption(visibleOptions[lastValueIndex + 1]);
    }
  },
  popValue: function popValue() {
    var valueArray = this.getValueArray(this.props.value);
    if (!valueArray.length) return;
    if (valueArray[valueArray.length - 1].clearableValue === false) return;
    this.setValue(valueArray.slice(0, valueArray.length - 1));
  },
  removeValue: function removeValue(value) {
    var valueArray = this.getValueArray(this.props.value);
    this.setValue(valueArray.filter(function (i) {
      return i !== value;
    }));
  },
  clearValue: function clearValue(event) {
    var _this12 = this;

    // if the event was triggered by a mousedown and not the primary
    // button, ignore it.
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    this.setValue(this.getResetValue());
    this.setState({
      isOpen: false,
      inputValue: ''
    }, function () {
      _this12.focus();

      if (_this12.props.onInputChange) _this12.props.onInputChange('');
    });
  },
  getResetValue: function getResetValue() {
    if (this.props.resetValue !== undefined) {
      return this.props.resetValue;
    } else if (this.props.multi) {
      return [];
    } else {
      return null;
    }
  },
  focusOption: function focusOption(option) {
    this.setState({
      focusedOption: option
    });
  },
  focusNextOption: function focusNextOption() {
    this.focusAdjacentOption('next');
  },
  focusPreviousOption: function focusPreviousOption() {
    this.focusAdjacentOption('previous');
  },
  focusPageUpOption: function focusPageUpOption() {
    this.focusAdjacentOption('page_up');
  },
  focusPageDownOption: function focusPageDownOption() {
    this.focusAdjacentOption('page_down');
  },
  focusStartOption: function focusStartOption() {
    this.focusAdjacentOption('start');
  },
  focusEndOption: function focusEndOption() {
    this.focusAdjacentOption('end');
  },
  focusAdjacentOption: function focusAdjacentOption(dir) {
    var _this13 = this;

    var options = this._visibleOptions.map(function (option, index) {
      return {
        option: option,
        index: index
      };
    }).filter(function (option) {
      return !option.option.disabled;
    });

    this._scrollToFocusedOptionOnUpdate = true;

    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        inputValue: '',
        focusedOption: this._focusedOption || (options.length ? options[dir === 'next' ? 0 : options.length - 1].option : null)
      }, function () {
        if (_this13.props.onInputChange) _this13.props.onInputChange('');
      });
      return;
    }

    if (!options.length) return;
    var focusedIndex = -1;

    for (var i = 0; i < options.length; i++) {
      if (this._focusedOption === options[i].option) {
        focusedIndex = i;
        break;
      }
    }

    if (dir === 'next' && focusedIndex !== -1) {
      focusedIndex = (focusedIndex + 1) % options.length;
    } else if (dir === 'previous') {
      if (focusedIndex > 0) {
        focusedIndex = focusedIndex - 1;
      } else {
        focusedIndex = options.length - 1;
      }
    } else if (dir === 'start') {
      focusedIndex = 0;
    } else if (dir === 'end') {
      focusedIndex = options.length - 1;
    } else if (dir === 'page_up') {
      var potentialIndex = focusedIndex - this.props.pageSize;

      if (potentialIndex < 0) {
        focusedIndex = 0;
      } else {
        focusedIndex = potentialIndex;
      }
    } else if (dir === 'page_down') {
      var potentialIndex = focusedIndex + this.props.pageSize;

      if (potentialIndex > options.length - 1) {
        focusedIndex = options.length - 1;
      } else {
        focusedIndex = potentialIndex;
      }
    }

    if (focusedIndex === -1) {
      focusedIndex = 0;
    }

    this.setState({
      focusedIndex: options[focusedIndex].index,
      focusedOption: options[focusedIndex].option
    });
  },
  getFocusedOption: function getFocusedOption() {
    return this._focusedOption;
  },
  getInputValue: function getInputValue() {
    return this.state.inputValue;
  },
  selectFocusedOption: function selectFocusedOption() {
    if (this._focusedOption) {
      return this.selectValue(this._focusedOption);
    }
  },
  renderLoading: function renderLoading() {
    if (!this.props.isLoading) return;
    return /*#__PURE__*/React.createElement("span", {
      className: "Select-loading-zone",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "Select-loading"
    }));
  },
  renderValue: function renderValue(valueArray, isOpen) {
    var _this14 = this;

    var renderLabel = this.props.valueRenderer || this.getOptionLabel;
    var ValueComponent = this.props.valueComponent;

    if (!valueArray.length) {
      return !this.state.inputValue ? /*#__PURE__*/React.createElement("div", {
        className: "Select-placeholder"
      }, this.props.placeholder) : null;
    }

    var onClick = this.props.onValueClick ? this.handleValueClick : null;

    if (this.props.multi) {
      return valueArray.map(function (value, i) {
        return /*#__PURE__*/React.createElement(ValueComponent, {
          id: _this14._instancePrefix + '-value-' + i,
          instancePrefix: _this14._instancePrefix,
          disabled: _this14.props.disabled || value.clearableValue === false,
          key: "value-" + i + "-" + value[_this14.props.valueKey],
          onClick: onClick,
          onRemove: _this14.removeValue,
          value: value
        }, renderLabel(value, i), /*#__PURE__*/React.createElement("span", {
          className: "Select-aria-only"
        }, "\xA0"));
      });
    } else if (!this.state.inputValue) {
      if (isOpen) onClick = null;
      return /*#__PURE__*/React.createElement(ValueComponent, {
        id: this._instancePrefix + '-value-item',
        disabled: this.props.disabled,
        instancePrefix: this._instancePrefix,
        onClick: onClick,
        value: valueArray[0]
      }, renderLabel(valueArray[0]));
    }
  },
  renderInput: function renderInput(valueArray, focusedOptionIndex) {
    var _this15 = this;

    var className = classNames('Select-input', this.props.inputProps.className);
    var isOpen = !!this.state.isOpen;
    var ariaOwns = classNames(isOpen && this._instancePrefix + '-list', this.props.multi && !this.props.disabled && this.state.isFocused && !this.state.inputValue && this._instancePrefix + '-backspace-remove-message'); // TODO: Check how this project includes Object.assign()

    var inputProps = Object.assign({}, this.props.inputProps, {
      role: 'combobox',
      'aria-expanded': '' + isOpen,
      'aria-owns': ariaOwns,
      'aria-haspopup': '' + isOpen,
      'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
      'aria-describedby': this.props['aria-describedby'],
      'aria-labelledby': this.props['aria-labelledby'],
      'aria-label': this.props['aria-label'],
      className: className,
      tabIndex: this.props.tabIndex,
      onBlur: this.handleInputBlur,
      onChange: this.handleInputChange,
      onFocus: this.handleInputFocus,
      ref: function ref(_ref13) {
        return _this15.input = _ref13;
      },
      required: this.state.required,
      value: this.state.inputValue
    });

    if (this.props.inputRenderer) {
      return this.props.inputRenderer(inputProps);
    }

    if (this.props.disabled || !this.props.searchable) {
      var _this$props$inputProp = this.props.inputProps,
          inputClassName = _this$props$inputProp.inputClassName,
          divProps = _objectWithoutProperties(_this$props$inputProp, ["inputClassName"]);

      return /*#__PURE__*/React.createElement("div", Object.assign({}, divProps, {
        role: "combobox",
        "aria-expanded": isOpen,
        "aria-owns": isOpen ? this._instancePrefix + '-list' : this._instancePrefix + '-value',
        "aria-activedescendant": isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
        className: className,
        tabIndex: this.props.tabIndex || 0,
        onBlur: this.handleInputBlur,
        onFocus: this.handleInputFocus,
        ref: function ref(_ref14) {
          return _this15.input = _ref14;
        },
        "aria-readonly": '' + !!this.props.disabled,
        style: {
          border: 0,
          width: 1,
          display: 'inline-block'
        }
      }));
    }

    if (this.props.autosize) {
      return /*#__PURE__*/React.createElement(AutosizeInput, Object.assign({}, inputProps, {
        minWidth: "5"
      }));
    }

    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("input", inputProps));
  },
  renderClear: function renderClear() {
    if (!this.props.clearable || !this.props.value || this.props.value === 0 || this.props.multi && !this.props.value.length || this.props.disabled || this.props.isLoading) return;
    var clear = this.props.clearRenderer();
    return /*#__PURE__*/React.createElement("span", {
      className: "Select-clear-zone",
      title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
      "aria-label": this.props.multi ? this.props.clearAllText : this.props.clearValueText,
      onMouseDown: this.clearValue,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEndClearValue
    }, clear);
  },
  renderArrow: function renderArrow() {
    var onMouseDown = this.handleMouseDownOnArrow;
    var isOpen = this.state.isOpen;
    var arrow = this.props.arrowRenderer({
      onMouseDown: onMouseDown,
      isOpen: isOpen
    });
    return /*#__PURE__*/React.createElement("span", {
      className: "Select-arrow-zone",
      onMouseDown: onMouseDown
    }, arrow);
  },
  filterFlatOptions: function filterFlatOptions(excludeOptions) {
    var filterValue = this.state.inputValue;
    var flatOptions = this._flatOptions;

    if (this.props.filterOptions) {
      // Maintain backwards compatibility with boolean attribute
      var filterOptions$1 = typeof this.props.filterOptions === 'function' ? this.props.filterOptions : filterOptions;
      return filterOptions$1(flatOptions, filterValue, excludeOptions, {
        filterOption: this.props.filterOption,
        ignoreAccents: this.props.ignoreAccents,
        ignoreCase: this.props.ignoreCase,
        labelKey: this.props.labelKey,
        matchPos: this.props.matchPos,
        matchProp: this.props.matchProp,
        valueKey: this.props.valueKey
      });
    } else {
      return flatOptions;
    }
  },
  flattenOptions: function flattenOptions(options, group) {
    if (!options) return [];
    var flatOptions = [];

    for (var i = 0; i < options.length; i++) {
      // We clone each option with a pointer to its parent group for efficient unflattening
      var optionCopy = clone(options[i]);
      optionCopy.isInTree = false;

      if (group) {
        optionCopy.group = group;
      }

      if (isGroup$1(optionCopy)) {
        flatOptions = flatOptions.concat(this.flattenOptions(optionCopy.options, optionCopy));
        optionCopy.options = [];
      } else {
        flatOptions.push(optionCopy);
      }
    }

    return flatOptions;
  },
  unflattenOptions: function unflattenOptions(flatOptions) {
    var groupedOptions = [];
    var parent, child; // Remove all ancestor groups from the tree

    flatOptions.forEach(function (option) {
      option.isInTree = false;
      parent = option.group;

      while (parent) {
        if (parent.isInTree) {
          parent.options = [];
          parent.isInTree = false;
        }

        parent = parent.group;
      }
    }); // Now reconstruct the options tree

    flatOptions.forEach(function (option) {
      child = option;
      parent = child.group;

      while (parent) {
        if (!child.isInTree) {
          parent.options.push(child);
          child.isInTree = true;
        }

        child = parent;
        parent = child.group;
      }

      if (!child.isInTree) {
        groupedOptions.push(child);
        child.isInTree = true;
      }
    });
    return groupedOptions;
  },
  onOptionRef: function onOptionRef(ref, isFocused) {
    if (isFocused) {
      this.focused = ref;
    }
  },
  renderMenu: function renderMenu(options, valueArray, focusedOption) {
    if (options && options.length) {
      return this.props.menuRenderer({
        focusedOption: focusedOption,
        focusOption: this.focusOption,
        instancePrefix: this._instancePrefix,
        labelKey: this.props.labelKey,
        onFocus: this.focusOption,
        onOptionRef: this.onOptionRef,
        onSelect: this.selectValue,
        optionClassName: this.props.optionClassName,
        optionComponent: this.props.optionComponent,
        optionGroupComponent: this.props.optionGroupComponent,
        optionRenderer: this.props.optionRenderer || this.getOptionLabel,
        options: options,
        selectValue: this.selectValue,
        valueArray: valueArray,
        valueKey: this.props.valueKey
      });
    } else if (this.props.noResultsText) {
      return /*#__PURE__*/React.createElement("div", {
        className: "Select-noresults"
      }, this.props.noResultsText);
    } else {
      return null;
    }
  },
  renderHiddenField: function renderHiddenField(valueArray) {
    var _this16 = this;

    if (!this.props.name) return;

    if (this.props.joinValues) {
      var value = valueArray.map(function (i) {
        return stringifyValue(i[_this16.props.valueKey]);
      }).join(this.props.delimiter);
      return /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        ref: function ref(_ref15) {
          return _this16.value = _ref15;
        },
        name: this.props.name,
        value: value,
        disabled: this.props.disabled
      });
    }

    return valueArray.map(function (item, index) {
      return /*#__PURE__*/React.createElement("input", {
        key: 'hidden.' + index,
        type: "hidden",
        ref: 'value' + index,
        name: _this16.props.name,
        value: stringifyValue(item[_this16.props.valueKey]),
        disabled: _this16.props.disabled
      });
    });
  },
  getFocusableOptionIndex: function getFocusableOptionIndex(selectedOption) {
    var options = this._visibleOptions;
    if (!options.length) return null;
    var focusedOption = this.state.focusedOption || selectedOption;

    if (focusedOption && !focusedOption.disabled) {
      var focusedOptionIndex = -1;
      options.some(function (option, index) {
        var isOptionEqual = option.value === focusedOption.value;

        if (isOptionEqual) {
          focusedOptionIndex = index;
        }

        return isOptionEqual;
      });

      if (focusedOptionIndex !== -1) {
        return focusedOptionIndex;
      }
    }

    for (var i = 0; i < options.length; i++) {
      if (!options[i].disabled) return i;
    }

    return null;
  },
  renderOuter: function renderOuter(options, valueArray, focusedOption) {
    var _this17 = this;

    var Dropdown = this.props.dropdownComponent;
    var menu = this.renderMenu(options, valueArray, focusedOption);

    if (!menu) {
      return null;
    }

    return /*#__PURE__*/React.createElement(Dropdown, null, /*#__PURE__*/React.createElement("div", {
      ref: function ref(_ref16) {
        return _this17.menuContainer = _ref16;
      },
      className: "Select-menu-outer",
      style: this.props.menuContainerStyle
    }, /*#__PURE__*/React.createElement("div", {
      ref: function ref(_ref17) {
        return _this17.menu = _ref17;
      },
      role: "listbox",
      className: "Select-menu",
      id: this._instancePrefix + '-list',
      style: this.props.menuStyle,
      onScroll: this.handleMenuScroll,
      onMouseDown: this.handleMouseDownOnMenu
    }, menu)));
  },
  render: function render() {
    var _this18 = this;

    var valueArray = this.getValueArray(this.props.value);
    this._visibleOptions = this.filterFlatOptions(this.props.multi ? valueArray : null);
    var options = this.unflattenOptions(this._visibleOptions);
    var isOpen = typeof this.props.isOpen === 'boolean' ? this.props.isOpen : this.state.isOpen;
    var focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);
    var focusedOption = null;

    if (focusedOptionIndex !== null) {
      focusedOption = this._focusedOption = this._visibleOptions[focusedOptionIndex];
    } else {
      focusedOption = this._focusedOption = null;
    }

    var className = classNames('Select', this.props.className, this.props.multi ? 'Select--multi' : 'Select--single', this.props.disabled && 'is-disabled', this.state.isFocused && 'is-focused', this.props.isLoading && 'is-loading', isOpen && 'is-open', this.state.isPseudoFocused && 'is-pseudo-focused', this.props.searchable && 'is-searchable', valueArray.length && 'has-value');
    var removeMessage = null;

    if (this.props.multi && !this.props.disabled && valueArray.length && !this.state.inputValue && this.state.isFocused && this.props.backspaceRemoves) {
      removeMessage = /*#__PURE__*/React.createElement("span", {
        id: this._instancePrefix + '-backspace-remove-message',
        className: "Select-aria-only",
        "aria-live": "assertive"
      }, this.props.backspaceToRemoveMessage.replace('{label}', valueArray[valueArray.length - 1][this.props.labelKey]));
    }

    return /*#__PURE__*/React.createElement("div", {
      ref: function ref(_ref18) {
        return _this18.wrapper = _ref18;
      },
      className: className,
      style: this.props.wrapperStyle
    }, this.renderHiddenField(valueArray), /*#__PURE__*/React.createElement("div", {
      ref: function ref(_ref19) {
        return _this18.control = _ref19;
      },
      className: "Select-control",
      style: this.props.style,
      onKeyDown: this.handleKeyDown,
      onMouseDown: this.handleMouseDown,
      onTouchEnd: this.handleTouchEnd,
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove
    }, /*#__PURE__*/React.createElement("span", {
      className: "Select-multi-value-wrapper",
      id: this._instancePrefix + '-value'
    }, this.renderValue(valueArray, isOpen), this.renderInput(valueArray, focusedOptionIndex)), removeMessage, this.renderLoading(), this.renderClear(), this.renderArrow()), isOpen ? this.renderOuter(options, !this.props.multi ? valueArray : null, focusedOption) : null);
  }
});
Select.stripDiacritics = stripDiacritics;
export default Select;