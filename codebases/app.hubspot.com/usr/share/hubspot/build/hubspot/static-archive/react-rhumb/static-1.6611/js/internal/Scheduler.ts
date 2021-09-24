import * as Scheduler from 'scheduler';

var runWithLowPriority = function runWithLowPriority(cb) {
  return Scheduler.unstable_runWithPriority(Scheduler.unstable_LowPriority, function () {
    cb();
  });
};

export { runWithLowPriority };