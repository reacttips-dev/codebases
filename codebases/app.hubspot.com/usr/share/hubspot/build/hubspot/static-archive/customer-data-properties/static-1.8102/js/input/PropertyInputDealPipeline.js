'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import { deref, watch, unwatch } from 'atom';
import { Map as ImmutableMap } from 'immutable';
import { isResolved } from 'reference-resolvers/utils';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import UIButton from 'UIComponents/button/UIButton';
import UISearchableSelectInput from 'UIComponents/input/UISearchableSelectInput';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import { makeOptionsFromPropertyWithoutBlankOptions } from 'customer-data-property-utils/PropertyValueDisplay';
import ChangePipelineDialog from 'customer-data-objects-ui-components/deal/ChangePipelineDialog';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import UILockBadge from 'UIComponents/badge/UILockBadge';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { HIDDEN } from '../constants/PipelineLevelPermissionValues';
import UISelect from 'UIComponents/input/UISelect';
import FormattedMessage from 'I18n/components/FormattedMessage';
var propTypes = {
  actions: PropTypes.shape({
    onPipelineChange: PropTypes.func
  }),
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onPipelineChange: PropTypes.func,
  placeholder: PropTypes.string,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  resolver: ReferenceResolverType,
  subject: PropTypes.oneOfType([PropTypes.instanceOf(DealRecord), PropTypes.instanceOf(ImmutableMap)]).isRequired,
  pipelineId: PropTypes.string,
  stageId: PropTypes.string,
  subjectId: PropTypes.string,
  value: PropTypes.node,
  'data-selenium-test': PropTypes.string,
  locked: PropTypes.bool,
  openPipelineUpgradeModal: PropTypes.func,
  onPipelineOpenChange: PropTypes.func
};
var defaultProps = {
  onPipelineChange: emptyFunction,
  actions: {
    onPipelineChange: emptyFunction
  },
  onPipelineOpenChange: emptyFunction
};

var getPipelineOptions = function getPipelineOptions(pipelines) {
  return pipelines.sortBy(function (pipeline) {
    return pipeline.get('displayOrder');
  }).map(function (opt) {
    return PropertyOptionRecord({
      displayOrder: opt.get('displayOrder'),
      label: opt.get('label'),
      value: opt.get('pipelineId') || opt.get('value')
    });
  }).toList();
};

var PropertyInputDealPipeline = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputDealPipeline, _Component);

  function PropertyInputDealPipeline() {
    var _this;

    _classCallCheck(this, PropertyInputDealPipeline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputDealPipeline).call(this));

    _this.handleAddError = function () {
      return addError('customerDataProperties.alertUpdatePropertiesError');
    };

    _this.handlePipelinesReferenceChange = function (reference) {
      if (!isResolved(reference)) {
        return;
      }

      var pipelines = reference.map(function (_ref) {
        var pipeline = _ref.referencedObject;
        return pipeline;
      });
      var permissions = pipelines.reduce(function (pipelinesMap, pipeline) {
        pipelinesMap[get('pipelineId', pipeline)] = getIn(['permission', 'accessLevel'], pipeline);
        return pipelinesMap;
      }, {});

      _this.setState({
        pipelines: pipelines,
        permissions: permissions
      });
    };

    _this.handlePipelineReferenceChange = function (reference) {
      if (!isResolved(reference)) {
        return;
      }

      var pipeline = reference.referencedObject;

      if (!pipeline) {
        return;
      }

      _this.setState({
        pipeline: pipeline
      });
    };

    _this.handlePipelineChange = function (updates) {
      var _this$props = _this.props,
          onPipelineChange = _this$props.onPipelineChange,
          subject = _this$props.subject;
      var pipeline = _this.state.pipeline;
      var newPipelineId = updates.get('pipelineId');

      if (pipeline && // deals can be imported without pipelines
      newPipelineId !== pipeline.get('pipelineId')) {
        _this.resetReferenceAtomById(newPipelineId);
      }

      var propertyUpdates = ImmutableMap({
        pipeline: updates.get('pipelineId'),
        dealstage: updates.get('stageId')
      });

      if (onPipelineChange === emptyFunction) {
        return _this.props.actions.onPipelineChange(subject, propertyUpdates, _this.handleAddError);
      }

      return onPipelineChange(propertyUpdates);
    };

    _this.handlePipelineEdit = function (evt) {
      var _this$props2 = _this.props,
          resolver = _this$props2.resolver,
          pipelineId = _this$props2.pipelineId,
          stageId = _this$props2.stageId;
      evt.preventDefault();
      return ChangePipelineDialog({
        pipelineId: pipelineId,
        stageId: stageId,
        objectType: DEAL,
        resolver: resolver
      }).then(_this.handlePipelineChange, rethrowError).done();
    };

    _this.shouldShowLockedDropdown = function () {
      if (!_this.state.pipelines) {
        return false;
      }

      var options = _this.getOptions(); // We only want to show the PQL if the portal has only one pipeline and doesn't have access to multiple pipelines
      // This check is needed since there are some portals that have more than one pipelines but not access to multiple pipelines
      // See https://git.hubteam.com/HubSpot/crm-settings/pull/558 and https://git.hubteam.com/HubSpot/crm-settings/pull/598 for more details


      return _this.props.locked && options && options.length === 1;
    };

    _this.state = {
      pipeline: null,
      pipelines: null,
      permissions: {}
    };
    return _this;
  }

  _createClass(PropertyInputDealPipeline, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initReferenceAtom();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var newPipelineId = this.props.value;

      if (prevProps.value !== newPipelineId && !this.referenceAtomById) {
        this.initReferenceAtom();
      } else if (prevProps.value !== newPipelineId && this.referenceAtomById) {
        this.resetReferenceAtomById(newPipelineId);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtomAll) {
        unwatch(this.referenceAtomAll, this.handlePipelinesReferenceChange);
      }

      if (this.referenceAtomById) {
        unwatch(this.referenceAtomById, this.handlePipelineReferenceChange);
      }
    }
  }, {
    key: "initReferenceAtom",
    value: function initReferenceAtom() {
      if (this.isNewDeal()) {
        this.referenceAtomAll = this.props.resolver.all();
        watch(this.referenceAtomAll, this.handlePipelinesReferenceChange);
        this.handlePipelinesReferenceChange(deref(this.referenceAtomAll));
      } else if (this.props.value) {
        this.referenceAtomById = this.props.resolver.byId(this.props.value);
        watch(this.referenceAtomById, this.handlePipelineReferenceChange);
        this.handlePipelineReferenceChange(deref(this.referenceAtomById));
      }
    }
  }, {
    key: "resetReferenceAtomById",
    value: function resetReferenceAtomById(newId) {
      unwatch(this.referenceAtomById, this.handlePipelineReferenceChange);
      this.setState({
        pipeline: null
      });
      this.referenceAtomById = this.props.resolver.byId(newId);
      watch(this.referenceAtomById, this.handlePipelineReferenceChange);
      this.handlePipelineReferenceChange(deref(this.referenceAtomById));
    }
  }, {
    key: "isNewDeal",
    value: function isNewDeal() {
      return !this.props.subjectId;
    }
  }, {
    key: "getOptions",
    value: function getOptions() {
      var permissions = this.state.permissions;
      return makeOptionsFromPropertyWithoutBlankOptions(this.props.property.set('options', getPipelineOptions(this.state.pipelines))).map(function (option) {
        var pipelineId = option.value;
        return Object.assign({}, option, {
          disabled: get(pipelineId, permissions) === HIDDEN
        });
      });
    }
  }, {
    key: "renderPromptLink",
    value: function renderPromptLink() {
      var _this$props3 = this.props,
          autoFocus = _this$props3.autoFocus,
          className = _this$props3.className,
          readOnly = _this$props3.readOnly,
          disabled = _this$props3.disabled;
      var pipeline = this.state.pipeline;
      return /*#__PURE__*/_jsx(UIButton, {
        autoFocus: autoFocus,
        className: className,
        disabled: readOnly || disabled,
        onClick: this.handlePipelineEdit,
        use: "form",
        children: pipeline && pipeline.get('label')
      });
    }
  }, {
    key: "renderLockedDropdown",
    value: function renderLockedDropdown() {
      if (!this.state.pipelines) {
        return null;
      }

      var _this$props4 = this.props,
          className = _this$props4.className,
          onChange = _this$props4.onChange,
          value = _this$props4.value,
          readOnly = _this$props4.readOnly,
          disabled = _this$props4.disabled,
          autoFocus = _this$props4.autoFocus,
          openPipelineUpgradeModal = _this$props4.openPipelineUpgradeModal,
          onPipelineOpenChange = _this$props4.onPipelineOpenChange;
      var options = [].concat(_toConsumableArray(this.getOptions()), [{
        text: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataProperties.PropertyInputDealPipeline.addAnother"
        }),
        locked: true,
        badge: /*#__PURE__*/_jsx(UILockBadge, {
          className: "m-left-1",
          size: "small"
        })
      }]);
      var selectedOption = options.find(function (opt) {
        return opt.value === value;
      });
      return /*#__PURE__*/_jsx(UISelect, {
        autoFocus: autoFocus,
        onChange: onChange,
        className: className,
        readOnly: readOnly,
        disabled: disabled,
        options: options,
        "data-selenium-test": this.props['data-selenium-test'],
        onOpenChange: onPipelineOpenChange,
        onSelectedOptionChange: function onSelectedOptionChange(e) {
          if (e.target.value.locked) {
            if (typeof openPipelineUpgradeModal === 'function') {
              openPipelineUpgradeModal();
            }
          }
        },
        value: selectedOption
      });
    }
  }, {
    key: "renderDropdown",
    value: function renderDropdown() {
      if (!this.state.pipelines) {
        return null;
      }

      var _this$props5 = this.props,
          autoFocus = _this$props5.autoFocus,
          className = _this$props5.className,
          onChange = _this$props5.onChange,
          placeholder = _this$props5.placeholder,
          value = _this$props5.value,
          readOnly = _this$props5.readOnly,
          disabled = _this$props5.disabled,
          onPipelineOpenChange = _this$props5.onPipelineOpenChange;
      var options = this.getOptions();
      var minNeededForDropdown = 2; // HACK: Handle the case where value is undefined

      var pipelineValue = value ? "" + value : value;
      return /*#__PURE__*/_jsx(UISearchableSelectInput, {
        autoFocus: autoFocus,
        onChange: onChange,
        className: className,
        readOnly: readOnly,
        disabled: disabled || options.length < minNeededForDropdown,
        options: options,
        value: pipelineValue,
        placeholder: placeholder,
        "data-selenium-test": this.props['data-selenium-test'],
        onOpenChange: onPipelineOpenChange
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.isNewDeal()) {
        return this.shouldShowLockedDropdown() ? this.renderLockedDropdown() : this.renderDropdown();
      }

      return this.renderPromptLink();
    }
  }]);

  return PropertyInputDealPipeline;
}(Component);

PropertyInputDealPipeline.propTypes = propTypes;
PropertyInputDealPipeline.defaultProps = defaultProps;
export default PropertyInputDealPipeline;