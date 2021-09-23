'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import SubjectType from 'customer-data-objects-ui-components/propTypes/SubjectType';
import emptyFunction from 'react-utils/emptyFunction';
import PropertyInputDealPipeline from 'customer-data-properties/input/PropertyInputDealPipeline';
import PropertyInputTicketPipeline from 'customer-data-properties/input/PropertyInputTicketPipeline';
import PropertyUpdateErrorHandler from 'customer-data-properties/PropertyUpdateErrorHandler';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';

var PropertyInputPipeline = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputPipeline, _PureComponent);

  function PropertyInputPipeline() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputPipeline);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputPipeline)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handlePipelineChange = function (updates) {
      ObjectsActions.updateStores(_this.props.subject, updates, {
        onError: PropertyUpdateErrorHandler
      });

      _this.props.onPipelineChange(updates);
    };

    return _this;
  }

  _createClass(PropertyInputPipeline, [{
    key: "render",
    value: function render() {
      var objectType = this.props.objectType;
      var PipelineComponent = objectType === DEAL ? PropertyInputDealPipeline : PropertyInputTicketPipeline;
      return /*#__PURE__*/_jsx(PipelineComponent, Object.assign({}, this.props, {
        onPipelineChange: this.handlePipelineChange
      }));
    }
  }]);

  return PropertyInputPipeline;
}(PureComponent);

PropertyInputPipeline.propTypes = {
  className: PropTypes.string,
  objectType: ObjectTypesType,
  onChange: PropTypes.func,
  onPipelineChange: PropTypes.func,
  placeholder: PropTypes.string,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  resolver: ReferenceResolverType.isRequired,
  subject: SubjectType.isRequired,
  subjectId: PropTypes.string,
  value: PropTypes.node,
  openPipelineUpgradeModal: PropTypes.func
};
PropertyInputPipeline.defaultProps = {
  onPipelineChange: emptyFunction
};
export default PropertyInputPipeline;