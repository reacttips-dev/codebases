'use es6';

import { fromJS } from 'immutable';
import I18n from 'I18n';
export default fromJS([{
  index: 0,
  sequenceName: I18n.text('library.sequences.startFromScratch'),
  sequenceDescription: I18n.text('library.sequences.startFromScratchDescription')
}, {
  index: 1,
  sequenceName: I18n.text('library.sequences.recentConversion'),
  sequenceDescription: I18n.text('library.sequences.recentConversionDescription')
}, {
  index: 2,
  sequenceName: I18n.text('library.sequences.tradeShowFollowUp'),
  sequenceDescription: I18n.text('library.sequences.tradeShowFollowUpDescription')
}, {
  index: 3,
  sequenceName: I18n.text('library.sequences.productDemo'),
  sequenceDescription: I18n.text('library.sequences.productDemoDescription')
}, {
  index: 4,
  sequenceName: I18n.text('library.sequences.meetingFollowUp'),
  sequenceDescription: I18n.text('library.sequences.meetingFollowUpDescription')
}, {
  index: 5,
  sequenceName: I18n.text('library.sequences.prospecting'),
  sequenceDescription: I18n.text('library.sequences.prospectingDescription')
}, {
  index: 6,
  sequenceName: I18n.text('library.sequences.leftVoicemail'),
  sequenceDescription: I18n.text('library.sequences.leftVoicemailDescription')
}, {
  index: 7,
  sequenceName: I18n.text('library.sequences.rescheduleMeeting'),
  sequenceDescription: I18n.text('library.sequences.rescheduleMeetingDescription')
}, {
  index: 8,
  sequenceName: I18n.text('library.sequences.reengagement'),
  sequenceDescription: I18n.text('library.sequences.reengagementDescription')
}]);