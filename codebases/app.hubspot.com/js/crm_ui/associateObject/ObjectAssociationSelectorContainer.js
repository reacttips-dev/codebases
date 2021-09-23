'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'general-store';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import ObjectAssociationSelector from './ObjectAssociationSelector';

var makeObjectAssociationSelectorContainer = function makeObjectAssociationSelectorContainer(dependencies) {
  var ConnectedAssociatedSelector = connect(dependencies)(ObjectAssociationSelector);

  var ObjectAssociationSelectorContainer = /*#__PURE__*/function (_Component) {
    _inherits(ObjectAssociationSelectorContainer, _Component);

    function ObjectAssociationSelectorContainer(props) {
      var _this;

      _classCallCheck(this, ObjectAssociationSelectorContainer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectAssociationSelectorContainer).call(this, props));

      _this.handleUpdateSearch = function (searchText) {
        _this.setState({
          searchText: searchText
        });

        _this.setState({
          overrideMinimumSearch: false
        });
      };

      _this.handleEnterKey = function () {
        // we allow users to skip the minimum search character count
        // to make searching without recall easier
        _this.setState({
          overrideMinimumSearch: true
        });
      };

      _this.handleAddSubject = function (subjectId) {
        var selectedAssociations = _this.state.selectedAssociations;

        _this.setState({
          selectedAssociations: [].concat(_toConsumableArray(selectedAssociations), [+subjectId])
        });
      };

      _this.handleRemoveSubject = function (subjectId) {
        var selectedAssociations = _this.state.selectedAssociations;

        _this.setState({
          selectedAssociations: selectedAssociations.filter(function (id) {
            return id !== +subjectId;
          })
        });
      };

      _this.handleConfirm = function () {
        var idsToAssociate = _this.getIdsToAssociate();

        var idsToDisassociate = _this.getIdsToDisassociate();

        _this.props.onConfirm({
          idsToAssociate: idsToAssociate,
          idsToDisassociate: idsToDisassociate
        });
      };

      _this.state = {
        searchText: '',
        selectedAssociations: props.existingAssociations || []
      };
      return _this;
    }

    _createClass(ObjectAssociationSelectorContainer, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (!prevProps.existingAssociations && this.props.existingAssociations) {
          this.setState({
            selectedAssociations: this.props.existingAssociations
          });
        }

        return null;
      }
    }, {
      key: "getIdsToAssociate",
      value: function getIdsToAssociate() {
        var _this$state$selectedA = this.state.selectedAssociations,
            selectedAssociations = _this$state$selectedA === void 0 ? [] : _this$state$selectedA;
        var _this$props$existingA = this.props.existingAssociations,
            existingAssociations = _this$props$existingA === void 0 ? [] : _this$props$existingA;
        return selectedAssociations.filter(function (a) {
          return !existingAssociations.includes(a);
        });
      }
    }, {
      key: "getIdsToDisassociate",
      value: function getIdsToDisassociate() {
        var _this$state$selectedA2 = this.state.selectedAssociations,
            selectedAssociations = _this$state$selectedA2 === void 0 ? [] : _this$state$selectedA2;
        var _this$props$existingA2 = this.props.existingAssociations,
            existingAssociations = _this$props$existingA2 === void 0 ? [] : _this$props$existingA2;
        return existingAssociations.filter(function (a) {
          return !selectedAssociations.includes(a);
        });
      }
    }, {
      key: "getUnsavedAssociationChangeCount",
      value: function getUnsavedAssociationChangeCount() {
        return this.getIdsToDisassociate().length + this.getIdsToAssociate().length;
      }
    }, {
      key: "getShouldDisableSaveButton",
      value: function getShouldDisableSaveButton() {
        var existingAssociations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var selectedAssociations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        return existingAssociations.length === selectedAssociations.length && existingAssociations.every(function (assocId, idx) {
          return assocId === selectedAssociations[idx];
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$state = this.state,
            selectedAssociations = _this$state.selectedAssociations,
            state = _objectWithoutProperties(_this$state, ["selectedAssociations"]);

        return /*#__PURE__*/_jsx(ConnectedAssociatedSelector, {
          associationObjectType: this.props.associationObjectType,
          unsavedChangeCount: this.getUnsavedAssociationChangeCount(),
          onReject: this.props.onReject,
          objectType: this.props.objectType,
          onAdd: this.handleAddSubject,
          onCreateObject: this.props.onCreateObject,
          onConfirm: this.handleConfirm,
          onRemove: this.handleRemoveSubject,
          onUpdateSearch: this.handleUpdateSearch,
          onEnterKey: this.handleEnterKey,
          selected: selectedAssociations,
          subjectId: this.props.subjectId,
          suggestedAssociations: this.props.suggestedAssociations,
          shouldDisableSaveButton: this.getShouldDisableSaveButton(this.props.existingAssociations, selectedAssociations),
          state: state
        });
      }
    }]);

    return ObjectAssociationSelectorContainer;
  }(Component);

  ObjectAssociationSelectorContainer.propTypes = {
    objectType: ObjectTypesType.isRequired,
    associationObjectType: ObjectTypesType.isRequired,
    existingAssociations: PropTypes.array,
    onCreateObject: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    subjectId: PropTypes.string.isRequired,
    suggestedAssociations: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      objectType: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }))
  };
  return ObjectAssociationSelectorContainer;
};

export default makeObjectAssociationSelectorContainer;