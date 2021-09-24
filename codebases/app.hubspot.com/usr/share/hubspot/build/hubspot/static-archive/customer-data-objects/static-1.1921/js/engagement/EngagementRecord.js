'use es6';

import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { ENGAGEMENT } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
export default makeObjectRecord({
  idKey: ObjectIds[ENGAGEMENT],
  objectType: ENGAGEMENT,
  recordName: 'EngagementRecord',
  defaults: {
    associations: ImmutableMap(),
    engagement: ImmutableMap(),
    metadata: ImmutableMap(),
    attachments: List(),
    scheduledTasks: List(),
    inviteeEmails: ImmutableSet()
  }
}, {
  primary: ['metadata.body'],
  secondary: ['metadata.text']
});