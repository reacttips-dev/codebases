'use es6';

import { List } from 'immutable';
import once from 'hs-lodash/once';
import debounce from 'transmute/debounce';
import NewSequence from './NewSequence';
import RecentConversionSequence from './RecentConversionSequence';
import TradeShowFollowUpSequence from './TradeShowFollowUpSequence';
import DemoRequestSequence from './DemoRequestSequence';
import MeetingFollowUpSequence from './MeetingFollowUpSequence';
import ProspectingSequence from './ProspectingSequence';
import LeftVoicemailSequence from './LeftVoicemailSequence';
import RescheduleMeetingSequence from './RescheduleMeetingSequence';
import ReEngagementSequence from './ReEngagementSequence';

var getSequences = function getSequences() {
  return List([NewSequence(), RecentConversionSequence(), TradeShowFollowUpSequence(), DemoRequestSequence(), MeetingFollowUpSequence(), ProspectingSequence(), LeftVoicemailSequence(), RescheduleMeetingSequence(), ReEngagementSequence()]);
};

var getSequencesLibraryList = function getSequencesLibraryList() {
  return new Promise(function (resolve) {
    return debounce(1, function () {
      return resolve(getSequences());
    })();
  });
};

export default once(getSequencesLibraryList);