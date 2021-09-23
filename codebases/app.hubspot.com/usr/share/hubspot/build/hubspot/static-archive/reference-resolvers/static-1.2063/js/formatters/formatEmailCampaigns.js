'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
export var formatEmailCampaignRecord = function formatEmailCampaignRecord(emailCampaign) {
  return new ReferenceRecord({
    id: "" + emailCampaign.id,
    label: emailCampaign.name,
    referencedObject: fromJS(emailCampaign)
  });
};
export var formatEmailCampaigns = function formatEmailCampaigns(response) {
  var results = indexBy(get('id'), List(response.results).map(formatEmailCampaignRecord));
  return {
    count: results.size,
    hasMore: response.hasMore,
    offset: response.offset,
    results: results
  };
};