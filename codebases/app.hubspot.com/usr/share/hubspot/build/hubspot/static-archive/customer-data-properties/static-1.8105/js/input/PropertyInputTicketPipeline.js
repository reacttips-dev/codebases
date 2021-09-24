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
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import { makeOptionsFromPropertyWithoutBlankOptions } from 'customer-data-property-utils/PropertyValueDisplay';
import ChangePipelineDialog from 'customer-data-objects-ui-components/deal/ChangePipelineDialog';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { HIDDEN } from '../constants/PipelineLevelPermissionValues';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILockBadge from 'UIComponents/badge/UILockBadge';
import UISelect from 'UIComponents/input/UISelect';
import UISearchableSelectInput from 'UIComponents/input/UISearchableSelectInput';
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
  subject: PropTypes.oneOfType([PropTypes.instanceOf(TicketRecord), PropTypes.instanceOf(ImmutableMap)]).isRequired,
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
      value: opt.get('pipelineId')
    });
  }).toList();
};

var PropertyInputTicketPipeline = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputTicketPipeline, _Component);

  function PropertyInputTicketPipeline() {
    var _this;

    _classCallCheck(this, PropertyInputTicketPipeline);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputTicketPipeline).call(this));

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

      if (newPipelineId !== pipeline.get('pipelineId')) {
        _this.resetReferenceAtomById(newPipelineId);
      }

      var propertyUpdates = ImmutableMap({
        hs_pipeline: updates.get('pipelineId'),
        hs_pipeline_stage: updates.get('stageId')
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
        objectType: TICKET,
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
      pipelines: null
    };
    return _this;
  }

  _createClass(PropertyInputTicketPipeline, [{
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
      if (this.isNewTicket()) {
        this.referenceAtomAll = this.props.resolver.all();
        watch(this.referenceAtomAll, this.handlePipelinesReferenceChange);
        this.handlePipelinesReferenceChange(deref(this.referenceAtomAll));
      } else {
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
    key: "isNewTicket",
    value: function isNewTicket() {
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
          autoFocus = _this$props4.autoFocus,
          className = _this$props4.className,
          readOnly = _this$props4.readOnly,
          disabled = _this$props4.disabled,
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
      return /*#__PURE__*/_jsx(UISelect, {
        autoFocus: autoFocus,
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
        value: options[0]
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
          readOnly = _this$props5.readOnly,
          disabled = _this$props5.disabled,
          value = _this$props5.value;
      var options = this.getOptions();
      var minNeededForDropdown = 2; // HACK: Handle the case where value is undefined

      var pipelineValue = value ? "" + value : value;
      return /*#__PURE__*/_jsx(UISearchableSelectInput, {
        autoFocus: autoFocus,
        className: className,
        readOnly: readOnly,
        disabled: disabled || options.length < minNeededForDropdown,
        onChange: onChange,
        options: options,
        placeholder: placeholder,
        value: pipelineValue,
        "data-selenium-test": this.props['data-selenium-test']
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.isNewTicket()) {
        return this.shouldShowLockedDropdown() ? this.renderLockedDropdown() : this.renderDropdown();
      }

      return this.renderPromptLink();
    }
  }]);

  return PropertyInputTicketPipeline;
}(Component);

PropertyInputTicketPipeline.propTypes = propTypes;
PropertyInputTicketPipeline.defaultProps = defaultProps;
export default PropertyInputTicketPipeline;