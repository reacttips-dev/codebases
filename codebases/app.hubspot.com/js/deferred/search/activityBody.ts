import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import makeText from './makeText';
import ENGAGEMENT_TYPES from './const/ENGAGEMENT_TYPES';
export function activityBody(_ref) {
  var _engagements;

  var highlights = _ref.highlights,
      properties = _ref.properties,
      engagementType = _ref.properties.engagementType;
  var engagements = (_engagements = {}, _defineProperty(_engagements, ENGAGEMENT_TYPES.CALL, 'callBody'), _defineProperty(_engagements, ENGAGEMENT_TYPES.EMAIL, 'emailSubject'), _defineProperty(_engagements, ENGAGEMENT_TYPES.NOTE, 'noteBody'), _defineProperty(_engagements, ENGAGEMENT_TYPES.MEETING, 'meetingBody'), _engagements);
  return makeText(engagements, {
    highlights: highlights,
    properties: properties,
    resultType: engagementType
  });
}
export default activityBody;