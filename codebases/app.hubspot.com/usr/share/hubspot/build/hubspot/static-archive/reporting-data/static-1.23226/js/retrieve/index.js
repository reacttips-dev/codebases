'use es6';
/* This will become the source of truth for integration code
  Retrieve is responsible for the following:
  a) picking the integration to use
  b) generating the request from config
  c) transforming data to our format
  d) optionally hydrating any references into the reference store

  The return value of retrieve should always be a promise of a dataset,
  but for now the return value is Promise<{
    dataConfig,
    dataset,
    response
  }> to maintain backwards compatibility with existing code.
*/

import { List } from 'immutable';
import { RETRIEVE } from '../constants/phases';
import invariant from '../lib/invariant';
import { connectedPhase } from '../redux/resolve/connected';
import * as baseRetrieve from './baseRetrieve';
import addQuotaColumn from './custom/addQuotaColumn/addQuotaColumnRetrieve';
import attribution from './custom/attributionRetrieve';
import retrieveCampaignBroadcast from './custom/campaignBroadcastRetrieve';
import * as quotas from './custom/quotas/quotasRetrieve';
import unified2dCombination from './custom/unified2dCombinationRetrieve';
import * as legacyRetrieve from './legacyRetrieve';
var integrations = List([unified2dCombination, attribution, retrieveCampaignBroadcast, quotas, addQuotaColumn, baseRetrieve, legacyRetrieve]);
export var match = function match(dataConfig) {
  return integrations.find(function (integration) {
    return integration.match(dataConfig);
  });
};
export var retrieve = function retrieve(dataConfig, debug, runtimeOptions) {
  var integration = match(dataConfig);
  invariant(integration, 'expected integration but no matches were found for the given dataConfig');
  return integration.retrieve(dataConfig, debug, runtimeOptions);
};
export var connectedRetrieve = connectedPhase(RETRIEVE, retrieve);