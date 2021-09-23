'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import { PIPELINE_ID_ALL } from '../crm_ui/filter/pipelineTypes/all';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { connect } from 'general-store';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { clearSelected } from '../crm_ui/flux/grid/GridUIActions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import Pipeline, { allPipelineStores } from '../crm_ui/filter/pipelineTypes/all';
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UILink from 'UIComponents/link/UILink';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import ViewsActions from '../crm_ui/flux/views/ViewsActions';
import UITruncateString from 'UIComponents/text/UITruncateString';
import emptyFunction from 'react-utils/emptyFunction';
import identity from 'transmute/identity';
import unescapedText from 'I18n/utils/unescapedText';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import { usePipelinePermissions } from '../pipelinePermissions/hooks/usePipelinePermissions';
import get from 'transmute/get';
import { getPipelineSettingsHref } from '../utils/getPipelineSettingsHref';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';

var getEffectivePipelineId = function getEffectivePipelineId(value) {
  return value === PIPELINE_ID_ALL ? null : value;
};

var getPipelineIdForSelect = function getPipelineIdForSelect(value) {
  return value === null ? PIPELINE_ID_ALL : value;
};

var getAllPipelinesTooltip = function getAllPipelinesTooltip(_ref) {
  var canAccessAnyPipeline = _ref.canAccessAnyPipeline,
      objectType = _ref.objectType;
  var message = canAccessAnyPipeline ? "filterSidebar.allPipelinesDisabled." + objectType : 'filterSidebar.forbiddenPipeline';
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: message
  });
};

var getPipelinesOptions = function getPipelinesOptions(pipelines, pageType, objectType, permissions) {
  var canAccessPipeline = function canAccessPipeline(pipeline) {
    var pipelineId = get('pipelineId', pipeline);
    return get(pipelineId, permissions) !== HIDDEN;
  };

  var pipelineOptions = pipelines.valueSeq().filter(identity).sort(function (a, b) {
    var aDisabled = !canAccessPipeline(a);
    var bDisabled = !canAccessPipeline(b);

    if (aDisabled && !bDisabled) {
      return 1;
    } else if (bDisabled && !aDisabled) {
      return -1;
    }

    return get('displayOrder', a) - get('displayOrder', b);
  }).map(function (pipeline) {
    var disabled = !canAccessPipeline(pipeline);
    return {
      text: get('label', pipeline),
      value: get('pipelineId', pipeline),
      disabled: disabled,
      tooltip: disabled && /*#__PURE__*/_jsx(FormattedMessage, {
        message: "filterSidebar.forbiddenPipeline"
      })
    };
  }).toArray();
  var canAccessAnyPipeline = pipelines.some(canAccessPipeline);
  var isAllPipelinesOptionDisabled = pageType !== PageTypes.INDEX || !canAccessAnyPipeline;
  var allPipelinesOption = {
    disabled: isAllPipelinesOptionDisabled,
    text: unescapedText('contentTopbar.allPipelinesVerbose'),
    tooltip: isAllPipelinesOptionDisabled && getAllPipelinesTooltip({
      canAccessAnyPipeline: canAccessAnyPipeline,
      objectType: objectType
    }),
    value: PIPELINE_ID_ALL
  };
  return [allPipelinesOption].concat(_toConsumableArray(pipelineOptions));
};

var PipelineSelector = /*#__PURE__*/function (_PureComponent) {
  _inherits(PipelineSelector, _PureComponent);

  function PipelineSelector() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PipelineSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PipelineSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handlePipelineChange = function (evt) {
      var _this$props = _this.props,
          objectType = _this$props.objectType,
          onChange = _this$props.onChange,
          viewId = _this$props.viewId;
      var value = evt.target.value;
      var pipelineId = getEffectivePipelineId(value);
      Pipeline.savePipelineSettings(objectType, pipelineId);
      ViewsActions.changePipeline(objectType, viewId, pipelineId);
      clearSelected();
      onChange(pipelineId);
      CrmLogger.log('indexInteractions', {
        action: 'switch pipelines'
      });
    };

    return _this;
  }

  _createClass(PipelineSelector, [{
    key: "renderItemComponent",
    value: function renderItemComponent(_ref2) {
      var children = _ref2.children,
          option = _ref2.option;

      if (option.tooltip) {
        return /*#__PURE__*/_jsx(UITooltip, {
          disabled: !option.tooltip,
          placement: "right",
          title: option.tooltip,
          children: children
        });
      }

      return /*#__PURE__*/_jsx(UITruncateString, {
        tooltip: option.text,
        children: children
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          objectType = _this$props2.objectType,
          pageType = _this$props2.pageType,
          selectedPipelineId = _this$props2.pipelineId,
          pipelines = _this$props2.pipelines,
          pipelinePermissions = _this$props2.pipelinePermissions;
      var pipelineId = getPipelineIdForSelect(selectedPipelineId);
      var objectTypeId = ObjectTypesToIds[objectType] || objectType;
      var pipelineSettingsHref = getPipelineSettingsHref({
        objectTypeId: objectTypeId,
        pipelineId: pipelineId
      });
      var pipelinesOptions = pipelines ? getPipelinesOptions(pipelines, pageType, objectType, pipelinePermissions) : [{
        value: pipelineId
      }];
      var selectedPipelineOptions = Pipeline.getPipelineSelectOptions(objectType, pipelinesOptions);
      return /*#__PURE__*/_jsx(UISelect, {
        buttonUse: "tertiary-light",
        buttonSize: "small",
        align: "left",
        className: className + " p-left-2",
        "data-selenium-test": "pipelineSelector",
        defaultValue: PIPELINE_ID_ALL,
        itemComponent: this.renderItemComponent,
        menuWidth: 400,
        onChange: this.handlePipelineChange,
        options: selectedPipelineOptions,
        value: pipelineId,
        dropdownFooter: /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: pipelineSettingsHref,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.pipelineSelector.editLink"
          })
        })
      });
    }
  }]);

  return PipelineSelector;
}(PureComponent);

PipelineSelector.propTypes = {
  pipelinePermissions: PropTypes.object.isRequired,
  className: PropTypes.string,
  objectType: ObjectTypesType.isRequired,
  onChange: PropTypes.func,
  pageType: PageType.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pipelines: ImmutablePropTypes.orderedMapOf(ImmutablePropTypes.mapContains({
    label: PropTypes.string.isRequired,
    pipelineId: PropTypes.string.isRequired
  }, PropTypes.string)),
  viewId: PropTypes.string.isRequired
};
PipelineSelector.defaultProps = {
  onChange: emptyFunction
};
export var deps = {
  pipelines: {
    stores: allPipelineStores,
    deref: function deref(_ref3) {
      var objectType = _ref3.objectType;
      return Pipeline.getPipelines(objectType);
    }
  }
};
export var withPipelinePermissions = function withPipelinePermissions(Component) {
  return function (_ref4) {
    var props = Object.assign({}, _ref4);
    var permissions = usePipelinePermissions();
    return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
      pipelinePermissions: permissions
    }));
  };
};
var PipelineSelectorWrapped = withPipelinePermissions(connect(deps)(PipelineSelector));
export { PipelineSelectorWrapped as default, PipelineSelector as PipelineSelectorUnwrapped };