'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { CALL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import FeedbackLoader from 'feedback-loader';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
export var CALLS_SURVEY_ID_PROD = 416;

var FeedbackSurveyLoader = function FeedbackSurveyLoader() {
  var objectTypeId = useSelectedObjectTypeId();
  var hasAllGates = useHasAllGates();
  var hasCIGate = hasAllGates('conversation-intelligence-phase-1');
  var shouldShowCallsSurvey = hasCIGate && objectTypeId === CALL_TYPE_ID;

  if (!shouldShowCallsSurvey) {
    return null;
  }

  return /*#__PURE__*/_jsx(FeedbackLoader, {
    onClientLoad: function onClientLoad(feedbackClient) {
      feedbackClient.loadSurvey('CSAT', CALLS_SURVEY_ID_PROD);
    }
  });
};

export default FeedbackSurveyLoader;