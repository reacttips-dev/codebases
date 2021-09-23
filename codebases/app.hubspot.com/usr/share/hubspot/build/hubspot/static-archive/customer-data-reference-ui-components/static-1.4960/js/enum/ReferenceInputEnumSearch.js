'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { deref, watch, unwatch } from 'atom';
import debounce from 'transmute/debounce';
import forEach from 'transmute/forEach';
import get from 'transmute/get';
import omit from 'transmute/omit';
import { OptionType } from 'UIComponents/types/OptionTypes';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReferenceResolverSearchType from 'reference-resolvers/schema/ReferenceResolverSearchType';
import UISelect from 'UIComponents/input/UISelect';
import { isResolved } from 'reference-resolvers/utils';
import defaultFilterOptions from 'customer-data-reference-ui-components/defaults/defaultFilterOptions';
import { defaultEnumOptionFormatter } from '../defaults/defaultEnumOptionFormatter';
var propertiesToOmit = ['open', 'onOpenChange', 'onSecondaryChange', 'onInvalidProperty', 'onCancel', 'requestOptions', 'onPipelineChange', 'optionFormatter', 'minimumSearchLength', 'searchCount', 'onTracking'];
var unwatchAll = forEach(function (unwatcher) {
  return unwatcher();
});

function getUniqueOptions(options) {
  var hasValue = {};
  return options.filter(function (_ref) {
    var value = _ref.value,
        nestedOptions = _ref.options;

    /*
      We never de-dupe grouped options.
      Search does not currently return grouped options, but if it ever does, multiple groups
      with the same name and contents may appear. Grouped options passed in the `options` prop
      will not be de-duped with search results, allowing the same value to be used by multiple
      options in the select (once in the custom `options` group and again in the search
      results in the root)
    */
    if (nestedOptions) {
      return true;
    }

    if (hasValue[value]) {
      return false;
    }

    hasValue[value] = true;
    return true;
  });
}

var defaultFormatter = function defaultFormatter(record) {
  return Object.assign({}, defaultEnumOptionFormatter(record), {
    record: record
  });
};

var propTypes = {
  autoload: PropTypes.bool.isRequired,
  ButtonContent: PropTypes.func,
  filterOptions: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  menuWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  minimumSearchLength: PropTypes.number.isRequired,
  multi: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onOpenChange: PropTypes.func,
  open: PropTypes.bool,
  optionFormatter: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionType.isRequired),
  placeholder: PropTypes.node,
  readOnly: PropTypes.bool.isRequired,
  requestOptions: PropTypes.object,
  resolver: ReferenceResolverSearchType.isRequired,
  searchCount: PropTypes.number.isRequired,
  searchDebounceTimeout: PropTypes.number.isRequired,
  showTags: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)])
};
var defaultProps = {
  autoload: true,
  minimumSearchLength: 0,
  optionFormatter: defaultFormatter,
  options: [],
  readOnly: false,
  searchCount: 10,
  searchDebounceTimeout: 300,
  showTags: true,
  filterOptions: defaultFilterOptions
};
var initialState = {
  open: false,
  valueOptions: []
};

var ReferenceInputEnumSearch = /*#__PURE__*/function (_Component) {
  _inherits(ReferenceInputEnumSearch, _Component);

  function ReferenceInputEnumSearch(props) {
    var _this;

    _classCallCheck(this, ReferenceInputEnumSearch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReferenceInputEnumSearch).call(this));

    _this.handleInputChange = function (_ref2) {
      var value = _ref2.target.value;

      _this.setState({
        value: value
      });
    };

    _this.handleLoadOptionsSearch = function (search, loadOptions) {
      // don't load options until the dropdown is showing
      if (!_this.isOpen()) {
        return;
      }

      var _this$props = _this.props,
          minimumSearchLength = _this$props.minimumSearchLength,
          optionFormatter = _this$props.optionFormatter,
          requestOptions = _this$props.requestOptions,
          resolver = _this$props.resolver,
          searchCount = _this$props.searchCount;

      if (search.length < minimumSearchLength) {
        var options = getUniqueOptions(_this.getOptions());
        loadOptions(null, {
          options: options,
          pagination: {
            hasMore: false,
            length: options.length
          }
        });
        return;
      }

      if (!_this.searchHasMore && // don't delegate to local search if filterOptions is false, as it
      // won't properly narrow down results
      _this.props.filterOptions !== false && search.indexOf(_this.prevSearchValue) === 0 && _this.prevSearchResult) {
        loadOptions(null, _this.createSearchResult());
        return;
      }

      var searchId = _this.nextSearchId();

      var searchAtom = resolver.search(Object.assign({
        query: search,
        count: searchCount,
        offset: _this.prevSearchValue === search && _this.prevSearchResult && _this.prevSearchResult.pagination.searchOffset || 0,
        nextCursor: _this.prevSearchValue === search && _this.prevSearchResult && _this.prevSearchResult.pagination.nextCursor || null
      }, requestOptions));

      var searchHandler = function searchHandler(response) {
        if (!isResolved(response)) {
          return;
        }

        var hasMore = get('hasMore', response);
        var offset = get('offset', response);
        var results = get('results', response);
        var total = get('total', response); // support for cursor pagination; see SlackAPI for example

        var nextCursor = get('nextCursor', response);
        var prevOptions = _this.prevSearchValue === search && _this.prevSearchResult && _this.prevSearchResult.options || [];
        var options = getUniqueOptions(prevOptions.concat(results.map(optionFormatter).toArray()));
        _this.searchHasMore = hasMore;
        _this.prevSearchValue = search;
        _this.prevSearchResult = {
          options: options,
          pagination: {
            hasMore: hasMore,
            length: total,
            offset: total ? total - options.length : undefined,
            searchOffset: offset,
            nextCursor: nextCursor
          }
        };

        _this.unwatchSearchAtom(searchId);

        loadOptions(null, _this.createSearchResult());
      };

      var currentResult = deref(searchAtom);

      if (isResolved(currentResult)) {
        searchHandler(currentResult);
      } else {
        _this.watchSearchAtom(searchId, searchAtom, searchHandler);
      }
    };

    _this.handleLoadOptions = function (search, loadOptions) {
      if (search) {
        _this.handleLoadOptionsSearchDebounced(search, loadOptions);
      } else {
        _this.handleLoadOptionsSearch(search, loadOptions);
      }
    };

    _this.handleOpenChange = function (evt) {
      var onOpenChange = _this.props.onOpenChange;
      var value = evt.target.value;

      _this.setState({
        open: value
      });

      if (onOpenChange) {
        onOpenChange(evt);
      }
    };

    _this.handleValueOptionReferenceResolved = function (reference) {
      var optionFormatter = _this.props.optionFormatter;

      if (isResolved(reference)) {
        _this.setState(function (prevState) {
          return {
            valueOptions: prevState.valueOptions.concat(optionFormatter(reference))
          };
        });
      }
    };

    _this.handleLoadOptionsSearchDebounced = debounce(props.searchDebounceTimeout, _this.handleLoadOptionsSearch);
    _this.prevSearchResult = null;
    _this.prevSearchValue = '';
    _this.unwatchSearchAtoms = {};
    _this.searchHasMore = true;
    _this.state = initialState;
    _this.watchedReferenceAtoms = [];
    _this.searchId = 0;
    return _this;
  }

  _createClass(ReferenceInputEnumSearch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          resolver = _this$props2.resolver,
          value = _this$props2.value,
          options = _this$props2.options;
      this.loadCurrentValueOptions(resolver, value, options);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var resolver = nextProps.resolver,
          value = nextProps.value,
          options = nextProps.options;

      if (value !== this.props.value) {
        this.loadCurrentValueOptions(resolver, value, options);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this2 = this;

      this.unwatchAllSearchAtoms();
      this.watchedReferenceAtoms.forEach(function (referenceAtom) {
        unwatch(referenceAtom, _this2.handleValueOptionReferenceResolved);
      });
    }
  }, {
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "nextSearchId",
    value: function nextSearchId() {
      return String(++this.searchId);
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var extraOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var options = this.props.options;
      var valueOptions = this.state.valueOptions;
      return options.concat(valueOptions, extraOptions);
    }
  }, {
    key: "isOpen",
    value: function isOpen() {
      if (this.props.open !== undefined) {
        return this.props.open;
      }

      return this.state.open;
    }
  }, {
    key: "createSearchResult",
    value: function createSearchResult() {
      // Appends search results to client-side options
      return Object.assign({}, this.prevSearchResult, {
        options: getUniqueOptions(this.getOptions(this.prevSearchResult.options))
      });
    }
  }, {
    key: "watchSearchAtom",
    value: function watchSearchAtom(id, searchAtom, searchHandler) {
      this.unwatchSearchAtoms[id] = function () {
        return unwatch(searchAtom, searchHandler);
      };

      watch(searchAtom, searchHandler);
    }
  }, {
    key: "unwatchSearchAtom",
    value: function unwatchSearchAtom(id) {
      if (!this.unwatchSearchAtoms[id]) {
        return;
      }

      this.unwatchSearchAtoms[id]();
      delete this.unwatchSearchAtoms[id];
    }
  }, {
    key: "unwatchAllSearchAtoms",
    value: function unwatchAllSearchAtoms() {
      unwatchAll(this.unwatchSearchAtoms);
      this.unwatchSearchAtoms = {};
    }
  }, {
    key: "loadCurrentValueOptions",
    value: function loadCurrentValueOptions(resolver, value) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (!value) {
        return;
      }

      var optionValues = options.map(function (option) {
        return option.value;
      });
      var arrayValue = Array.isArray(value) ? value : [value];
      this.watchedReferenceAtoms.forEach(function (reference) {
        unwatch(reference, _this3.handleValueOptionReferenceResolved);
      });
      this.watchedReferenceAtoms = arrayValue.filter(function (id) {
        return optionValues.indexOf(id) === -1;
      }).map(function (id) {
        return resolver.byId(id);
      });
      this.watchedReferenceAtoms.forEach(function (reference) {
        watch(reference, _this3.handleValueOptionReferenceResolved);

        _this3.handleValueOptionReferenceResolved(deref(reference));
      });
    }
  }, {
    key: "getButtonContent",
    value: function getButtonContent() {
      if (!this.props.showTags) {
        return this.props.ButtonContent;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          value = _this$props3.value,
          placeholder = _this$props3.placeholder,
          filterOptions = _this$props3.filterOptions;
      var transferrableProps = omit(propertiesToOmit, this.props);
      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, transferrableProps, {
        anchorType: "button",
        cache: null,
        filterOptions: filterOptions,
        loadOptions: this.handleLoadOptions,
        onInputValueChange: this.handleInputChange,
        onOpenChange: this.handleOpenChange,
        ButtonContent: this.getButtonContent(),
        open: this.isOpen(),
        options: this.getOptions(),
        placeholder: placeholder,
        ref: "input",
        value: value,
        menuWidth: this.props.menuWidth
      }));
    }
  }]);

  return ReferenceInputEnumSearch;
}(Component);

export { ReferenceInputEnumSearch as default };
ReferenceInputEnumSearch.propTypes = propTypes;
ReferenceInputEnumSearch.defaultProps = defaultProps;