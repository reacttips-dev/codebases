export { markFunction, markEnd, markStart } from './utils/markFunction';
export { addBootTiming, getBootTimings } from './utils/trackBootTimings';
export { trackBottleneck, getBottlenecks, addBottleneck } from './utils/bottlenecks';
export type { PromiseWithKey } from './utils/bottlenecks';
export { default as safeRequestAnimationFrame } from './utils/safeRequestAnimationFrame';
