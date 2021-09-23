'use es6';

import { Record } from 'immutable';
export default Record({
  action: null,
  name: null,
  stepOrder: 0,
  sends: 0,
  opensPerSend: 0,
  clicksPerSend: 0,
  repliesPerSend: 0,
  meetingsBookedPerSend: 0,
  unsubscribesPerSend: 0,
  bouncesPerSend: 0
}, 'StepReportRecord');