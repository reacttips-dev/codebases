'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { deref, unwatch, watch } from 'atom';
import { mapResolve } from 'reference-resolvers/utils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import { Component } from 'react';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import TeamSelect from 'ui-addon-teams/components/TeamSelect';
import emptyFunction from 'react-utils/emptyFunction';
import isEmpty from 'transmute/isEmpty';

var atomToPromise = function atomToPromise(atom) {
  return new Promise(function (resolve, reject) {
    var toPromise = mapResolve({
      loading: emptyFunction,
      error: function error(value) {
        reject(value.reason);
        unwatch(atom, toPromise);
      },
      resolved: function resolved(value) {
        resolve(value);
        unwatch(atom, toPromise);
      }
    });
    watch(atom, toPromise);
    toPromise(deref(atom));
  });
};

var getOptions = function getOptions(options, specialOptions, resolver) {
  if (resolver) {
    return List.isList(specialOptions) ? specialOptions : List();
  }

  if (List.isList(options) && List.isList(specialOptions)) {
    return specialOptions.concat(options);
  }

  if (isEmpty(options) && List.isList(specialOptions)) {
    return specialOptions;
  }

  return options || List();
};

var FilterOperatorTeamInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorTeamInput, _Component);

  function FilterOperatorTeamInput(props) {
    var _this;

    _classCallCheck(this, FilterOperatorTeamInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorTeamInput).call(this, props));
    _this.loadTeams = _this.loadTeams.bind(_assertThisInitialized(_this));
    _this.state = {
      isLoading: true,
      teams: List()
    };
    return _this;
  }

  _createClass(FilterOperatorTeamInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var resolver = this.props.resolver;
      this.loadTeams(resolver);
    }
  }, {
    key: "loadTeams",
    value: function loadTeams(resolver) {
      var _this2 = this;

      if (!resolver || !resolver.all) {
        return;
      }

      var promise = atomToPromise(resolver.all());
      promise.then(function (resp) {
        _this2.setState({
          isLoading: false,
          teams: resp.toList()
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          buttonUse = _this$props.buttonUse,
          options = _this$props.options,
          resolver = _this$props.resolver,
          specialOptions = _this$props.specialOptions,
          rest = _objectWithoutProperties(_this$props, ["buttonUse", "options", "resolver", "specialOptions"]);

      var _this$state = this.state,
          isLoading = _this$state.isLoading,
          teams = _this$state.teams;
      return /*#__PURE__*/_jsx(TeamSelect, Object.assign({
        buttonUse: buttonUse,
        customOptions: getOptions(options, specialOptions, resolver),
        isLoading: isLoading,
        showPlaceholder: false,
        showTags: true,
        teams: teams
      }, rest));
    }
  }]);

  return FilterOperatorTeamInput;
}(Component);

export { FilterOperatorTeamInput as default };
FilterOperatorTeamInput.propTypes = {
  buttonUse: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: ImmutablePropTypes.listOf(PropTypes.instanceOf(PropertyOptionRecord)),
  resolver: ReferenceResolverType,
  specialOptions: ImmutablePropTypes.listOf(PropTypes.instanceOf(PropertyOptionRecord)),
  value: ImmutablePropTypes.listOf(PropTypes.string)
};
FilterOperatorTeamInput.defaultProps = {
  buttonUse: 'form'
};