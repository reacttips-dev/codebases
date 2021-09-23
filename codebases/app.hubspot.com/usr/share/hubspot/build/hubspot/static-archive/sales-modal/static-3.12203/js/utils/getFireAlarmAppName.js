'use es6';

import * as FireAlarmAppNames from 'sales-modal/constants/FireAlarmAppNames';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
export default (function (tab) {
  switch (tab) {
    case SalesModalTabs.DOCUMENTS:
      return FireAlarmAppNames.DOCUMENTS_APPNAME;

    case SalesModalTabs.TEMPLATES:
    case SalesModalTabs.SEQUENCES:
      return FireAlarmAppNames.TEMPLATES_SEQUENCES_APPNAME;

    default:
      return FireAlarmAppNames.TEMPLATES_SEQUENCES_APPNAME;
  }
});