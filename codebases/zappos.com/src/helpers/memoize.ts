import ExecutionEnvironment from 'exenv';
import memoize from 'fast-memoize';

let exposedMemoize: (...args: any[]) => any;

// only truly memoize in the browser until we can set a max cache size without affect memoization performance.
if (ExecutionEnvironment.canUseDOM) {
  exposedMemoize = memoize;
} else {
  exposedMemoize = fn => function() {
    return fn.apply(null, arguments);
  };
}

export default exposedMemoize;
