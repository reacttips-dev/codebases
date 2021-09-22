import multiTracker from 'js/app/multitrackerSingleton';
import retracked from 'js/lib/retracked';

var recordingFn = (fullEventKey: string, values: Record<string, any>) => multiTracker.pushV2([fullEventKey, values]);

// REF https://docs.google.com/presentation/d/1Zw0sZWtBolOt5_mc0xTVxOUBPvDgqNbIvczFF3EeF8s/edit#slide=id.g7af01553b_086
var actionNames = [
  'render',
  'emit',
  'redirect',

  'view',
  'click', // or tap
  'hover',
  'scroll',
  'swipe',
  'pinch',
  'expand',
];

retracked.setup(recordingFn, actionNames);

export default retracked;
