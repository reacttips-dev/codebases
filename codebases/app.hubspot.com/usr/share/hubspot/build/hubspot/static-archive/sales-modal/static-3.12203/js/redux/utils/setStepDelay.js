'use es6';

export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      step = _ref.step,
      delay = _ref.delay;
  var startingStepOrder = sequenceEnrollment.startingStepOrder;
  var stepOrder = step.get('stepOrder');
  var stepDelayPath = ['steps', stepOrder, 'delay'];
  return startingStepOrder === stepOrder ? sequenceEnrollment.set('initialTouchDelay', delay) : sequenceEnrollment.setIn(stepDelayPath, delay);
}