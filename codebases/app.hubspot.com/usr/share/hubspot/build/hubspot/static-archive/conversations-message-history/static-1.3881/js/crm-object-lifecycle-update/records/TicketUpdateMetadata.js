'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";

var _Record2;

import { Record } from 'immutable';
import { UPDATE_TYPE } from '../constants/keyPaths';
import CrmCreationSource from './CrmCreationSource';

var TicketUpdateMetadata = /*#__PURE__*/function (_Record) {
  _inherits(TicketUpdateMetadata, _Record);

  function TicketUpdateMetadata() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TicketUpdateMetadata);

    return _possibleConstructorReturn(this, _getPrototypeOf(TicketUpdateMetadata).call(this, Object.assign({}, properties, {
      crmCreationSource: properties.crmCreationSource ? CrmCreationSource(properties.crmCreationSource) : null
    })));
  }

  return TicketUpdateMetadata;
}(Record((_Record2 = {}, _defineProperty(_Record2, UPDATE_TYPE, null), _defineProperty(_Record2, "pipelineId", null), _defineProperty(_Record2, "pipelineName", null), _defineProperty(_Record2, "pipelineStageId", null), _defineProperty(_Record2, "pipelineStage", null), _defineProperty(_Record2, "crmCreationSource", null), _Record2), 'TicketUpdateMetadata'));

export default TicketUpdateMetadata;