'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import omit from 'transmute/omit';
import toJS from 'transmute/toJS';
import get from 'transmute/get';
import { deref, watch, unwatch } from 'atom';
import { isResolved } from 'reference-resolvers/utils';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import DealStageIdSelect from 'customer-data-objects-ui-components/deal/DealStageIdSelect';
import { stageLabelTranslator } from 'property-translator/propertyTranslator';
var propTypes = {
  nextPipeline: PropTypes.string,
  objectType: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  resolver: ReferenceResolverType,
  pipeline: PropTypes.string,
  value: PropTypes.node
};
var BLOCKLIST = ['objectType', 'onPipelineChange', 'onSecondaryChange', 'onTracking', 'readOnlySourceData', 'showPlaceholder', 'subjectId'];
export var PropertyInputPipelineStage = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputPipelineStage, _PureComponent);

  function PropertyInputPipelineStage() {
    var _this;

    _classCallCheck(this, PropertyInputPipelineStage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputPipelineStage).call(this));

    _this.handlePipelinesReferenceChange = function (reference) {
      if (!isResolved(reference)) {
        return;
      }

      var pipelines = reference.reduce(function (acc, _ref) {
        var pipeline = _ref.referencedObject;
        return acc.set(pipeline.get('pipelineId'), pipeline);
      }, ImmutableMap());

      _this.setState({
        pipelines: pipelines
      });
    };

    _this.state = {
      pipelines: ImmutableMap()
    };
    return _this;
  }

  _createClass(PropertyInputPipelineStage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initReferenceAtom();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handlePipelinesReferenceChange);
      }
    }
  }, {
    key: "initReferenceAtom",
    value: function initReferenceAtom() {
      this.referenceAtom = this.props.resolver.all();
      watch(this.referenceAtom, this.handlePipelinesReferenceChange);
      this.handlePipelinesReferenceChange(deref(this.referenceAtom));
    }
  }, {
    key: "getStages",
    value: function getStages() {
      var _this$props = this.props,
          nextPipeline = _this$props.nextPipeline,
          pipeline = _this$props.pipeline,
          objectType = _this$props.objectType,
          value = _this$props.value;
      var pipelines = this.state.pipelines;
      var pipelineForInput = pipelines.get(nextPipeline || pipeline) || pipelines.size && pipelines.find(function (pl) {
        return pl.getIn(['stages']).find(function (stage) {
          return stage.get('stageId') === value;
        });
      }) || pipelines.first();
      var pipelineId = get('pipelineId', pipelineForInput);
      var stageOptions = pipelines.getIn([pipelineId, 'stages']);

      if (!stageOptions) {
        return undefined;
      }

      return stageOptions.sortBy(function (stage) {
        return stage.get('displayOrder');
      }).map(function (stage) {
        return stage.set('value', stage.get('stageId'));
      }).map(function (stage) {
        return stage.set('text', stageLabelTranslator({
          label: stage.get('label'),
          objectType: objectType,
          pipelineId: pipelineId,
          stageId: stage.get('stageId')
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = toJS(omit(BLOCKLIST, this.props));
      return /*#__PURE__*/_jsx(DealStageIdSelect, Object.assign({}, transferableProps, {
        dealStages: this.getStages(),
        menuWidth: 300,
        placement: "bottom right"
      }));
    }
  }]);

  return PropertyInputPipelineStage;
}(PureComponent);
PropertyInputPipelineStage.propTypes = propTypes;
export default PropertyInputPipelineStage;