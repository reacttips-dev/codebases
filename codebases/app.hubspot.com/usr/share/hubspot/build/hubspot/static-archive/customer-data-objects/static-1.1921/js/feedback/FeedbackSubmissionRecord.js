'use es6';

import { Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { FEEDBACK_SUBMISSION } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[FEEDBACK_SUBMISSION],
  objectType: FEEDBACK_SUBMISSION,
  recordName: 'FeedbackSubmissionRecord',
  defaults: {
    associations: ImmutableMap(),
    objectId: null,
    surveyId: null,
    isDeleted: false,
    portalId: null,
    properties: ImmutableMap()
  }
}, {
  primary: ['hs_content'],
  secondary: ['hs_survey_type', 'hs_response_group']
});