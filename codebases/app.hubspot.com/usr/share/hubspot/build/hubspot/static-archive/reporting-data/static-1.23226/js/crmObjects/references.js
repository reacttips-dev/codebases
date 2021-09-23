'use es6';

import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import { GLOBAL_NULL } from '../constants/defaultNullValues';
import { generateBusinessUnitLabel } from '../references/businessUnit';
import { generateCampaignLabel } from '../references/campaign/index';
import { generateChatflowLabel } from '../references/chatflows/index';
import { generateCompanyLabel } from '../references/company';
import { generateContactLabel } from '../references/contact/index';
import { generateConversationInboxLabel } from '../references/conversation-inbox/index';
import { generateCtaLabel } from '../references/ctas/ctas';
import { generateCurrencyLabel } from '../references/currency/index';
import { generateDealLabel } from '../references/deal/index';
import { generateFormLabel } from '../references/form';
import { generateInteractionTypeLabel } from '../references/interactionType/index';
import { generateListMembershipIdLabel } from '../references/list';
import { generateMarketableReasonIdLabel } from '../references/marketableReason/index';
import { generateOwnerLabel } from '../references/owner/index';
import { generatePipelineLabel } from '../references/pipeline/index';
import { generatePipelineStageLabel } from '../references/pipelineStage/index';
import { generateProductLabel } from '../references/products';
import { generateSalesforceCampaignLabel } from '../references/salesforce-campaign';
import { generateTeamLabel } from '../references/team';
import { generateTicketLabel } from '../references/ticket';
import { generateUserLabel } from '../references/user';
import { generateAnalyticsSourceData2Label } from './specialReferenceLabelers'; // a map for all the referenced object types with the corresponding function to handle generating labels

export var referenceTypes = ImmutableMap({
  USER: generateUserLabel,
  OWNER: generateOwnerLabel,
  CAMPAIGN: generateCampaignLabel,
  PIPELINE: generatePipelineLabel,
  PIPELINE_STAGE: generatePipelineStageLabel,
  TEAM: generateTeamLabel,
  CURRENCY_CODE: generateCurrencyLabel,
  INTERACTION_TYPE: generateInteractionTypeLabel,
  CTA: generateCtaLabel,
  FORM: generateFormLabel,
  LIST: generateListMembershipIdLabel,
  MARKETABLE_REASON: generateMarketableReasonIdLabel,
  SALESFORCE_CAMPAIGN: generateSalesforceCampaignLabel,
  ANALYTICS_SOURCE_DATA_2: generateAnalyticsSourceData2Label,
  '0-1': generateContactLabel,
  '0-2': generateCompanyLabel,
  '0-3': generateDealLabel,
  '0-5': generateTicketLabel,
  '0-7': generateProductLabel,
  '0-55': generateConversationInboxLabel,
  '0-56': generateChatflowLabel,
  BUSINESS_UNIT: generateBusinessUnitLabel
});
export var getReferenceLabeler = function getReferenceLabeler(referenceType) {
  var referenceLabeler = referenceTypes.get(referenceType) ? referenceTypes.get(referenceType) : function (_, key) {
    return key;
  };
  return function (reference, key) {
    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    var label = referenceLabeler.apply(void 0, [reference, key].concat(rest));

    if (!label && key === GLOBAL_NULL) {
      return I18n.text('reporting-data.missing.value');
    }

    return label === undefined || label === null ? key : label;
  };
};