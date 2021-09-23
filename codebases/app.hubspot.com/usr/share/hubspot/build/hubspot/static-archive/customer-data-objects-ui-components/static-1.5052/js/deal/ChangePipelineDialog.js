'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { deref, watch, unwatch } from 'atom';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import Promptable from 'UIComponents/decorators/Promptable';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UISearchableSelectInput from 'UIComponents/input/UISearchableSelectInput';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import FormattedMessage from 'I18n/components/FormattedMessage';
var propTypes = Object.assign({
  pipelineId: PropTypes.string.isRequired,
  stageId: PropTypes.string.isRequired,
  resolver: ReferenceResolverType.isRequired,
  objectType: ObjectTypesType.isRequired
}, PromptablePropInterface);

var getPipelineStageOptions = function getPipelineStageOptions(pipeline) {
  return pipeline.get('stages').map(function (stage) {
    return stage.merge({
      value: stage.get('stageId'),
      text: stage.get('label')
    });
  });
};

var CustomPipelineOption = function CustomPipelineOption(props) {
  var children = props.children,
      _props$option = props.option,
      disabled = _props$option.disabled,
      tooltipMessage = _props$option.tooltipMessage,
      rest = _objectWithoutProperties(props, ["children", "option"]);

  return /*#__PURE__*/_jsx(UITooltip, {
    placement: "left",
    disabled: !disabled,
    title: tooltipMessage && /*#__PURE__*/_jsx(FormattedMessage, {
      message: tooltipMessage
    }),
    children: /*#__PURE__*/_jsx("li", Object.assign({}, rest, {
      children: children
    }))
  });
};

export var mapReferenceToOptions = function mapReferenceToOptions(reference) {
  return reference.map(function (_ref) {
    var pipeline = _ref.referencedObject,
        disabled = _ref.disabled;
    return {
      value: pipeline.get('pipelineId'),
      text: pipeline.get('label'),
      disabled: disabled,
      tooltipMessage: disabled && 'customerDataObjectsUiComponents.ChangePipelineDialog.forbiddenPipeline'
    };
  }).toArray();
};
export var ChangePipelineDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(ChangePipelineDialog, _PureComponent);

  function ChangePipelineDialog(props) {
    var _this;

    _classCallCheck(this, ChangePipelineDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChangePipelineDialog).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleInitReferenceAtom = function () {
      _this.referenceAtom = _this.props.resolver.all();
      watch(_this.referenceAtom, _this.handlePipelinesReferenceChange);

      _this.handlePipelinesReferenceChange(deref(_this.referenceAtom));
    };

    _this.handlePipelinesReferenceChange = function (reference) {
      if (!reference) {
        return;
      }

      var pipelineOptions = mapReferenceToOptions(reference);
      var pipelines = reference.reduce(function (acc, _ref2) {
        var pipeline = _ref2.referencedObject;

        if (!pipeline.get('stageOptions')) {
          pipeline = pipeline.merge({
            stageOptions: getPipelineStageOptions(pipeline)
          });
        }

        return acc.set(pipeline.get('pipelineId'), pipeline);
      }, ImmutableMap());

      _this.setState({
        pipelines: pipelines,
        pipelineOptions: pipelineOptions
      });
    };

    _this.handleInputChange = function (property, evt) {
      var inputChanges = {};
      var newValue = evt.target.value;
      inputChanges[property] = newValue;

      if (property === 'pipelineId') {
        inputChanges.stageId = _this.state.pipelines.getIn([newValue, 'stages']).first().get('stageId');
      }

      return _this.setState(inputChanges);
    };

    _this.handleSave = function () {
      var updates = fromJS({
        pipelineId: _this.state.pipelineId,
        stageId: _this.state.stageId
      });
      return _this.props.onConfirm(updates);
    };

    _this.partial = memoize(partial);
    var stageId = props.stageId,
        pipelineId = props.pipelineId;
    _this.state = {
      pipelineId: pipelineId,
      pipelines: ImmutableMap(),
      pipelineOptions: [],
      stageId: stageId
    };
    return _this;
  }

  _createClass(ChangePipelineDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleInitReferenceAtom();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handlePipelinesReferenceChange);
      }
    }
  }, {
    key: "renderPipelineSelect",
    value: function renderPipelineSelect() {
      var _this$state = this.state,
          pipelineId = _this$state.pipelineId,
          pipelineOptions = _this$state.pipelineOptions;
      return /*#__PURE__*/_jsx(UIGrid, {
        children: /*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 12
          },
          children: /*#__PURE__*/_jsx(UISearchableSelectInput, {
            onChange: this.partial(this.handleInputChange, 'pipelineId'),
            options: pipelineOptions,
            value: pipelineId,
            itemComponent: CustomPipelineOption
          })
        })
      });
    }
  }, {
    key: "renderStageSelect",
    value: function renderStageSelect() {
      var _this$state2 = this.state,
          pipelineId = _this$state2.pipelineId,
          stageId = _this$state2.stageId,
          pipelines = _this$state2.pipelines;
      var stages = pipelines.getIn([pipelineId, 'stageOptions']);
      stages = stages ? stages.toJS() : [];
      return /*#__PURE__*/_jsx(UIGrid, {
        className: "m-top-5",
        children: /*#__PURE__*/_jsx(UIGridItem, {
          size: {
            xs: 12
          },
          children: /*#__PURE__*/_jsx(UISearchableSelectInput, {
            onChange: this.partial(this.handleInputChange, 'stageId'),
            options: stages,
            value: stageId
          })
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          objectType = _this$props.objectType,
          onReject = _this$props.onReject;
      return /*#__PURE__*/_jsxs(BaseDialog, {
        title: I18n.text("customerDataObjectsUiComponents.ChangePipelineDialog.title." + objectType),
        confirmLabel: I18n.text('customerDataObjectsUiComponents.ChangePipelineDialog.save'),
        onConfirm: this.handleSave,
        onReject: onReject,
        width: 500,
        children: [this.renderPipelineSelect(), this.renderStageSelect()]
      });
    }
  }]);

  return ChangePipelineDialog;
}(PureComponent);
ChangePipelineDialog.propTypes = propTypes;
export default Promptable(ChangePipelineDialog);