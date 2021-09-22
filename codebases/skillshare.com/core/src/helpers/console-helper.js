// Make it safe to do console.log() always.
(function(con) {
  let method;
  const dummy = function() {};
  const methods = ('assert,count,debug,dir,dirxml,error,exception,group,'
    + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,'
    + 'time,timeEnd,trace,warn').split(',');
  // eslint-disable-next-line no-constant-condition
  while (true) {
    method = methods.pop();
    if (!method) {
      break;
    }
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});
