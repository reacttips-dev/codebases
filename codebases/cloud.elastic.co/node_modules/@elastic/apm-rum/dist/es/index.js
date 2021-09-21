import { createServiceFactory, bootstrap, isBrowser } from '@elastic/apm-rum-core';
import ApmBase from './apm-base';

function getApmBase() {
  if (isBrowser && window.elasticApm) {
    return window.elasticApm;
  }

  var enabled = bootstrap();
  var serviceFactory = createServiceFactory();
  var apmBase = new ApmBase(serviceFactory, !enabled);

  if (isBrowser) {
    window.elasticApm = apmBase;
  }

  return apmBase;
}

var apmBase = getApmBase();
var init = apmBase.init.bind(apmBase);
export default init;
export { init, apmBase, ApmBase, apmBase as apm };