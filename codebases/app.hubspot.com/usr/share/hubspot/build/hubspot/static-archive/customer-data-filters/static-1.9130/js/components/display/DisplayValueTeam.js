'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { deref, unwatch, watch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import { listOf } from 'react-immutable-proptypes';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import { PureComponent } from 'react';
import get from 'transmute/get';

function getFlattenedTeamMap(teams) {
  return teams.reduce(function (acc, team) {
    return acc.merge(_defineProperty({}, team.get('id'), team)).merge(getFlattenedTeamMap(team.get('childTeams')));
  }, ImmutableMap());
}

var DisplayValueTeam = /*#__PURE__*/function (_PureComponent) {
  _inherits(DisplayValueTeam, _PureComponent);

  function DisplayValueTeam() {
    var _this;

    _classCallCheck(this, DisplayValueTeam);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DisplayValueTeam).call(this));

    _this.handleReferenceChange = function (reference) {
      if (isResolved(reference)) {
        var value = _this.props.value;
        reference = reference.map(function (team) {
          return team.get('referencedObject');
        });

        _this.setState({
          reference: getFlattenedTeamMap(reference).get(String(value))
        });
      }
    };

    _this.state = {
      reference: null
    };
    _this.referenceAtom = null;
    return _this;
  }

  _createClass(DisplayValueTeam, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          getFamilyValueResolver = _this$props.getFamilyValueResolver,
          operator = _this$props.operator;
      var resolver = getFamilyValueResolver(operator);

      if (resolver && resolver.all) {
        this.referenceAtom = resolver.all();
        watch(this.referenceAtom, this.handleReferenceChange);
        this.handleReferenceChange(deref(this.referenceAtom));
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleReferenceChange);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          value = _this$props2.value,
          specialOptions = _this$props2.specialOptions;
      var reference = this.state.reference;
      var matchingSpecialOption = specialOptions && specialOptions.find(function (_ref) {
        var v = _ref.value;
        return v === value;
      }) || {};
      var valueName = matchingSpecialOption.label || matchingSpecialOption.text || get('name', reference) || get('id', reference) || value;
      return /*#__PURE__*/_jsx("span", {
        children: valueName
      });
    }
  }]);

  return DisplayValueTeam;
}(PureComponent);

export { DisplayValueTeam as default };
DisplayValueTeam.propTypes = {
  getFamilyValueResolver: PropTypes.func.isRequired,
  operator: FilterOperatorType.isRequired,
  specialOptions: listOf(PropTypes.instanceOf(PropertyOptionRecord).isRequired),
  value: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.string]).isRequired
};