'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { deref, watch, unwatch } from 'atom';
import omit from 'transmute/omit';
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import debounce from 'transmute/debounce';
import get from 'transmute/get';
import { OptionType } from 'UIComponents/types/OptionTypes';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import ReferenceResolverSearchType from 'reference-resolvers/schema/ReferenceResolverSearchType';
import UISelect from 'UIComponents/input/UISelect';
import { mapResolve, isResolved } from 'reference-resolvers/utils';
import UITextInput from 'UIComponents/input/UITextInput';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import { PRODUCT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { hubSpotSourceFilter, addUniqueFilters } from 'crm_data/products/ProductsFilters';
var propertiesToOmit = ['onSecondaryChange', 'onInvalidProperty', 'onCancel'];

var atomToPromise = function atomToPromise(atom) {
  return new Promise(function (resolve, reject) {
    var toPromise = mapResolve({
      loading: function loading() {},
      error: function error(value) {
        reject(value.reason);
        unwatch(atom, toPromise);
      },
      resolved: function resolved(value) {
        if (value != null) {
          resolve(value);
          unwatch(atom, toPromise);
        }
      }
    });
    watch(atom, toPromise);
    toPromise(deref(atom));
  });
};

function getUniqueOptions(options) {
  var hasValue = {};
  return options.filter(function (_ref) {
    var value = _ref.value;

    if (hasValue[value]) {
      return false;
    }

    hasValue[value] = true;
    return true;
  });
}

var propTypes = {
  autoload: PropTypes.bool.isRequired,
  currencyCode: PropTypes.string,
  getPriceForEffectiveCurrency: PropTypes.func.isRequired,
  hasUsedSync: PropTypes.bool,
  minimumSearchLength: PropTypes.number.isRequired,
  multi: PropTypes.bool,
  onSelectedOptionChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionType.isRequired),
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  resolver: ReferenceResolverSearchType.isRequired,
  searchCount: PropTypes.number.isRequired,
  searchDebounceTimeout: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)])
};
var defaultProps = {
  autoload: true,
  minimumSearchLength: 0,
  options: [],
  searchCount: 10,
  searchDebounceTimeout: 300
};
var initialState = {
  open: false,
  valueOptions: []
};

var ProductResolverSelect = /*#__PURE__*/function (_Component) {
  _inherits(ProductResolverSelect, _Component);

  function ProductResolverSelect(props) {
    var _this;

    _classCallCheck(this, ProductResolverSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProductResolverSelect).call(this));

    _this.handleLoadOptions = function (search, done) {
      // don't load options until the dropdown is showing
      if (!_this.state.open) {
        return;
      }

      var _this$props = _this.props,
          minimumSearchLength = _this$props.minimumSearchLength,
          resolver = _this$props.resolver,
          searchCount = _this$props.searchCount,
          hasUsedSync = _this$props.hasUsedSync;

      if (search.length < minimumSearchLength) {
        var options = getUniqueOptions(_this.getOptions());
        done(null, {
          options: options,
          pagination: {
            hasMore: false,
            length: options.length
          }
        });
        return;
      }

      if (!_this.searchHasMore && search.indexOf(_this.prevSearchValue) === 0 && _this.prevSearchResult) {
        done(null, _this.prevSearchResult);
        return;
      }

      var baseQuery = fromJS({
        query: search,
        count: searchCount,
        offset: _this.prevSearchValue === search && _this.prevSearchResult && _this.prevSearchResult.pagination.searchOffset || 0,
        sorts: List([ImmutableMap({
          property: 'createdate',
          order: 'DESC'
        })]),
        filterGroups: List()
      });
      var searchQuery = hasUsedSync ? addUniqueFilters(baseQuery, hubSpotSourceFilter) : baseQuery;
      var nextSearchAtom = resolver.search(searchQuery);

      if (_this.searchAtom) {
        unwatch(_this.searchAtom, _this.searchHandler);
      }

      _this.searchAtom = nextSearchAtom;

      _this.searchHandler = function (response) {
        if (isResolved(response)) {
          var hasMore = get('hasMore', response);
          var offset = get('offset', response);
          var results = get('results', response);
          var total = get('total', response);
          var prevOptions = _this.prevSearchValue === search && _this.prevSearchResult && _this.prevSearchResult.options || [];

          var _options = getUniqueOptions(_this.getOptions(prevOptions.concat(results.map(function (record) {
            return Object.assign({}, ReferenceRecord.toOption(record), {
              record: record
            });
          }).toArray())));

          _this.searchHasMore = hasMore;
          _this.prevSearchValue = search;
          _this.prevSearchResult = {
            // we need to prepend client-side options to every page
            // or it'll be unreachable
            options: _options,
            pagination: {
              hasMore: hasMore,
              length: total,
              offset: total ? total - (_options.length - _this.props.options.length) : undefined,
              searchOffset: offset
            }
          };
          done(null, _this.prevSearchResult);
        }
      };

      watch(_this.searchAtom, _this.searchHandler);
      var currentResult = deref(_this.searchAtom);

      if (currentResult !== undefined) {
        _this.searchHandler(currentResult);
      }
    };

    _this.handleOpenChange = function (_ref2) {
      var value = _ref2.target.value;

      _this.setState({
        open: value
      });
    };

    _this.handleLoadOptions = debounce(props.searchDebounceTimeout, _this.handleLoadOptions);
    _this.prevSearchResult = null;
    _this.prevSearchValue = '';
    _this.searchAtom = null;
    _this.searchHandler = null;
    _this.searchHasMore = true;
    _this.state = initialState;
    return _this;
  }

  _createClass(ProductResolverSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          resolver = _this$props2.resolver,
          value = _this$props2.value,
          options = _this$props2.options;
      this.loadValueOptions(resolver, value, options).then(function (valueOptions) {
        // eslint-disable-next-line react/no-did-mount-set-state
        _this2.setState({
          valueOptions: valueOptions
        });
      }).done();
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var resolver = nextProps.resolver,
          value = nextProps.value,
          currencyCode = nextProps.currencyCode,
          options = nextProps.options;

      if (currencyCode !== this.props.currencyCode) {
        this.prevSearchResult = null;
      }

      if (value !== this.props.value) {
        this.loadValueOptions(resolver, value, options).then(function (valueOptions) {
          return _this3.setState({
            valueOptions: valueOptions
          });
        }).done();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.searchAtom) {
        unwatch(this.searchAtom, this.searchHandler);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var extraOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _this$props3 = this.props,
          options = _this$props3.options,
          getPriceForEffectiveCurrency = _this$props3.getPriceForEffectiveCurrency;
      var valueOptions = this.state.valueOptions;
      var allOptions = options.concat(valueOptions, extraOptions);
      return allOptions.map(function (option) {
        var hasPrice = !!getPriceForEffectiveCurrency(option);

        if (!hasPrice) {
          return Object.assign({}, option, {
            disabled: true
          });
        }

        return option;
      });
    }
  }, {
    key: "loadValueOptions",
    value: function loadValueOptions(resolver, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      /**
       * "Value options" refer to the already-selected products in the multi-select.
       * We need to load data about these products on mount for them to display
       * properly initially.
       */
      if (!value) {
        return Promise.resolve([]);
      }

      var optionValues = options.map(function (option) {
        return option.value;
      });
      var arrayValue = Array.isArray(value) ? value : [value];
      var byIdPromises = arrayValue.filter(function (id) {
        return optionValues.indexOf(id) === -1;
      }).map(function (id) {
        return atomToPromise(resolver.byId(id));
      });
      return Promise.all(byIdPromises).then(function (results) {
        return results.map(function (record) {
          return Object.assign({}, ReferenceRecord.toOption(record), {
            record: record
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          value = _this$props4.value,
          placeholder = _this$props4.placeholder,
          rest = _objectWithoutProperties(_this$props4, ["value", "placeholder"]);

      var options = this.getOptions();

      if (this.props.readOnly) {
        var valueObject = options.find(function (option) {
          return option.value === value;
        });
        return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, rest, {
          value: valueObject ? valueObject.text : undefined
        }));
      }

      var transferrableProps = omit(propertiesToOmit, this.props);
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferrableProps, {
        cache: null,
        loadOptions: this.handleLoadOptions,
        onOpenChange: this.handleOpenChange,
        open: this.state.open,
        options: options,
        ref: "input",
        value: value,
        placeholder: placeholder
      }));
    }
  }]);

  return ProductResolverSelect;
}(Component);

ProductResolverSelect.propTypes = propTypes;
ProductResolverSelect.defaultProps = defaultProps;
var getResolvers = ConnectReferenceResolvers(function (resolvers) {
  return {
    resolver: resolvers[PRODUCT]
  };
});
export default getResolvers(ProductResolverSelect);