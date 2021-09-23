'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { CRM_OBJECT_LIFECYCLE_UPDATE } from '../constants/messageTypes';
import { buildCrmObjectLifecycleUpdateMetadata } from '../operators/buildCrmObjectLifecycleUpdateMetadata';

var CrmObjectLifecycleUpdate = /*#__PURE__*/function (_Record) {
  _inherits(CrmObjectLifecycleUpdate, _Record);

  function CrmObjectLifecycleUpdate() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CrmObjectLifecycleUpdate);

    return _possibleConstructorReturn(this, _getPrototypeOf(CrmObjectLifecycleUpdate).call(this, Object.assign({}, properties, {
      crmObjectUpdate: buildCrmObjectLifecycleUpdateMetadata(properties.objectType, properties.crmObjectUpdate)
    })));
  }

  return CrmObjectLifecycleUpdate;
}(Record({
  '@type': CRM_OBJECT_LIFECYCLE_UPDATE,
  id: null,
  objectType: null,
  objectId: null,
  objectName: null,
  source: null,
  sourceId: null,
  crmObjectUpdate: null,
  timestamp: null
}, 'CrmObjectLifecycleUpdate'));

export { CrmObjectLifecycleUpdate as default };