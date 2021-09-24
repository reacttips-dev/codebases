import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _SURVEY_OPTIONS_BY_UP, _ContextualPromptConf;

import { MARKETING_PRO, SALES_PROFESSIONAL, MARKETING_ENTERPRISE, SALES_ENTERPRISE, SERVICE_PROFESSIONAL, SERVICE_ENTERPRISE, OPERATIONS_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
import PortalIdParser from 'PortalIdParser';
export var SURVEY_OPTIONS_BY_UPGRADE_PRODUCT = (_SURVEY_OPTIONS_BY_UP = {}, _defineProperty(_SURVEY_OPTIONS_BY_UP, MARKETING_PRO, ['landing-pages', 'email', 'marketing-workflows', 'content-strategy']), _defineProperty(_SURVEY_OPTIONS_BY_UP, SALES_PROFESSIONAL, ['sequences', 'meetings', 'quotes', 'sales-workflows']), _defineProperty(_SURVEY_OPTIONS_BY_UP, MARKETING_ENTERPRISE, ['landing-pages', 'email', 'marketing-workflows', 'content-strategy']), _defineProperty(_SURVEY_OPTIONS_BY_UP, SALES_ENTERPRISE, ['sales-workflows', 'playbooks', 'sequences', 'quotes']), _defineProperty(_SURVEY_OPTIONS_BY_UP, SERVICE_PROFESSIONAL, ['tickets', 'feedback', 'knowledge-base', 'service-workflows']), _defineProperty(_SURVEY_OPTIONS_BY_UP, SERVICE_ENTERPRISE, ['tickets', 'feedback', 'knowledge-base', 'service-workflows']), _defineProperty(_SURVEY_OPTIONS_BY_UP, OPERATIONS_PROFESSIONAL, ['custom-coded-workflow-actions', 'custom-coded-bot-actions', 'webhooks', 'data-quality-automation']), _SURVEY_OPTIONS_BY_UP);
export var NEXT_STEPS_SURVEY_UPGRADE_PRODUCTS = [MARKETING_ENTERPRISE, SALES_ENTERPRISE, SERVICE_PROFESSIONAL, SERVICE_ENTERPRISE, OPERATIONS_PROFESSIONAL];
export var TRIAL_GUIDE_UPGRADE_PRODUCTS = [MARKETING_PRO, SALES_PROFESSIONAL];
export var promptTypes = {
  DEMO_PROMPT: 'demo-prompt',
  KB_ARTICLE: 'kb-article' // KB = Knowledge Base

};
export var ContextualPromptConfig = (_ContextualPromptConf = {}, _defineProperty(_ContextualPromptConf, MARKETING_PRO, {
  campaigns: {
    href: 'https://knowledge.hubspot.com/campaigns/create-campaigns',
    promptType: promptTypes.KB_ARTICLE
  },
  seo: {
    href: "/trial-guide/" + PortalIdParser.get() + "/seo-intro?flowId=seo&source=seo-demo-prompt",
    promptType: promptTypes.DEMO_PROMPT
  },
  social: {
    href: "/trial-guide/" + PortalIdParser.get() + "/social-intro?flowId=social&source=social-demo-prompt",
    promptType: promptTypes.DEMO_PROMPT
  },
  workflows: {
    href: "/trial-guide/" + PortalIdParser.get() + "/reports-dashboard?flowId=nurture-qualify&source=workflows-demo-prompt",
    promptType: promptTypes.DEMO_PROMPT
  }
}), _defineProperty(_ContextualPromptConf, SALES_PROFESSIONAL, {
  sequences: {
    href: 'https://knowledge.hubspot.com/sequences/create-and-edit-sequences',
    promptType: promptTypes.KB_ARTICLE
  },
  workflows: {
    href: 'https://knowledge.hubspot.com/workflows/get-started-with-workflows',
    promptType: promptTypes.KB_ARTICLE
  },
  products: {
    href: 'https://knowledge.hubspot.com/deals/how-do-i-use-products',
    promptType: promptTypes.KB_ARTICLE
  },
  quotes: {
    href: 'https://knowledge.hubspot.com/deals/use-quotes',
    promptType: promptTypes.KB_ARTICLE
  },
  forecasting: {
    href: 'https://knowledge.hubspot.com/forecast/set-up-the-forecast-tool',
    promptType: promptTypes.KB_ARTICLE
  }
}), _ContextualPromptConf);