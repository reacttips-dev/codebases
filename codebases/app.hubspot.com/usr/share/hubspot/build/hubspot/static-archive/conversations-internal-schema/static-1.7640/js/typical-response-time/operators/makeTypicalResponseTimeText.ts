import { makeCustomResponse } from './makeCustomResponse';
import { makeStandardResponse } from './makeStandardResponse';
export function makeTypicalResponseTimeText() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      typicalResponseTime = _ref.typicalResponseTime;

  if (!typicalResponseTime) return undefined;
  var usingCustomResponse = typicalResponseTime.usingCustomResponse,
      standardResponse = typicalResponseTime.standardResponse,
      customResponseQuantity = typicalResponseTime.customResponseQuantity,
      customResponseUnit = typicalResponseTime.customResponseUnit;

  if (usingCustomResponse && !customResponseQuantity) {
    return '';
  }

  if (usingCustomResponse) {
    return makeCustomResponse({
      customResponseQuantity: customResponseQuantity,
      customResponseUnit: customResponseUnit
    });
  }

  return makeStandardResponse({
    standardResponse: standardResponse
  });
}