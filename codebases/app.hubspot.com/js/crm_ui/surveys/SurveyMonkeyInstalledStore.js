'use es6';

import { isSurveyMonkeyIntegrationInstalledOnPortal } from 'surveymonkey-crm-card/api/SurveyMonkeyIntegrationClient';
import { SURVEY_MONKEY_INSTALLED } from 'crm_data/actions/ActionNamespaces';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import dispatcher from 'dispatcher/dispatcher';
var SurveyMonkeyInstalledStore = defineLazyValueStore({
  namespace: SURVEY_MONKEY_INSTALLED,
  fetch: isSurveyMonkeyIntegrationInstalledOnPortal
}).defineName('SurveyMonkeyInstalledStore').register(dispatcher);
export default SurveyMonkeyInstalledStore;