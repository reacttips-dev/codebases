'use es6';

import { fromJS, List } from 'immutable';
import prefix from '../../lib/prefix';
import isBetPortal from '../../lib/isBetPortal';
var translate = prefix('reporting-data.properties.engagement');
var translateGroup = prefix('reporting-data.groups.engagement');
export var getBetEngagementPropertyGroups = function getBetEngagementPropertyGroups() {
  return isBetPortal() ? fromJS([{
    name: 'betEngagementInfo',
    displayName: translateGroup('betEngagementInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'engagement.activityType',
      label: translate('activityType'),
      type: 'enumeration',
      options: [{
        label: translate('activityTypes.CALL'),
        value: 'Call'
      }, {
        label: translate('activityTypes.IMA'),
        value: 'IMA'
      }, {
        label: translate('activityTypes.DEMO'),
        value: 'Demo'
      }, {
        label: translate('activityTypes.DISCOVERY'),
        value: 'Discovery'
      }, {
        label: translate('activityTypes.GOAL_SETTING'),
        value: 'Goal setting'
      }, {
        label: translate('activityTypes.PREQUALIFICATION_CALL'),
        value: 'Prequalification call'
      }, {
        label: translate('activityTypes.ACCOUNT_ASSIST'),
        value: 'Account assist'
      }, {
        label: translate('activityTypes.AGENCY_SERVICES'),
        value: 'Define agency services'
      }, {
        label: translate('activityTypes.BILLING_ISSUE'),
        value: 'Billing or contract issue'
      }, {
        label: translate('activityTypes.BUILD_LEAD_LIST'),
        value: 'Building a lead list'
      }, {
        label: translate('activityTypes.BUSINESS_STRATEGY'),
        value: 'Business strategy'
      }, {
        label: translate('activityTypes.CANCELLATION'),
        value: 'Cancellation/Downgrade'
      }, {
        label: translate('activityTypes.CLIENT_DELIVERY'),
        value: 'Client delivery'
      }, {
        label: translate('activityTypes.CONSULTING'),
        value: 'Consulting'
      }, {
        label: translate('activityTypes.CULTURE'),
        value: 'Hiring/HR/Culture'
      }, {
        label: translate('activityTypes.DEAL_REVIEW'),
        value: 'Deal review'
      }, {
        label: translate('activityTypes.DEVELOPING_SALES_PLAN'),
        value: 'Developing sales plan'
      }, {
        label: translate('activityTypes.ESCALATION'),
        value: 'Escalation'
      }, {
        label: translate('activityTypes.IMPLEMENTATION'),
        value: 'Implementation'
      }, {
        label: translate('activityTypes.INTERNAL_TRANSITION'),
        value: 'Internal transition'
      }, {
        label: translate('activityTypes.KICK_OFF'),
        value: 'Kick-off'
      }, {
        label: translate('activityTypes.PBE_REVIEW'),
        value: 'PBE review'
      }, {
        label: translate('activityTypes.PRICING_PACKAGING'),
        value: 'Pricing & packaging'
      }, {
        label: translate('activityTypes.PROACTIVE_PROSPECTING'),
        value: 'Proactive prospecting'
      }, {
        label: translate('activityTypes.QSR_DELIVERED'),
        value: 'QSR delivered'
      }, {
        label: translate('activityTypes.QUARTERLY_REVIEW'),
        value: 'Quarterly business review'
      }, {
        label: translate('activityTypes.RESELL_DISCUSSION'),
        value: 'Resell & retainers discussion'
      }, {
        label: translate('activityTypes.SALES_COACHING'),
        value: 'Sales coaching'
      }, {
        label: translate('activityTypes.SELLING_OPPORTUNITY'),
        value: 'Selling opportunity'
      }, {
        label: translate('activityTypes.SE_DISCOVERY'),
        value: 'Discovery'
      }, {
        label: translate('activityTypes.SMALL_GROUP_COACHING'),
        value: 'Small group coaching'
      }, {
        label: translate('activityTypes.DEAL_SPECIFIC_COACHING'),
        value: 'Deal specific coaching'
      }, {
        label: translate('activityTypes.FULL_DEMO'),
        value: 'Full demo'
      }, {
        label: translate('activityTypes.IN_PERSON'),
        value: 'In person'
      }, {
        label: translate('activityTypes.OFFLINE_SOLUTION_RESEARCH'),
        value: 'Offline solution research'
      }, {
        label: translate('activityTypes.PARTIAL_DEMO'),
        value: 'Partial demo'
      }, {
        label: translate('activityTypes.POST_SALE_SERVICES_SUPPORT'),
        value: 'Post sale services support'
      }, {
        label: translate('activityTypes.QUESTIONNAIRE_REVIEW_CALL'),
        value: 'Questionnaire review call'
      }, {
        label: translate('activityTypes.TECH_CONSULT'),
        value: 'Tech consult'
      }, {
        label: translate('activityTypes.SALES_NEW_BUSINESS_CALL'),
        value: 'New business'
      }, {
        label: translate('activityTypes.SALES_INSTALL_BASE_CALL'),
        value: 'Install base'
      }, {
        label: translate('activityTypes.SUPPORT_BILLING'),
        value: 'Billing'
      }, {
        label: translate('activityTypes.SUPPORT_CANCELLATION_DOWNGRADE'),
        value: 'Cancellation/Downgrade'
      }, {
        label: translate('activityTypes.SUPPORT_TECHNICAL_SUPPORT'),
        value: 'Technical support'
      }, {
        label: translate('activityTypes.SUPPORT_RENEWAL'),
        value: 'Renewal'
      }, {
        label: translate('activityTypes.SUPPORT_ACCOUNT_MANAGEMENT'),
        value: 'Account management'
      }, {
        label: translate('activityTypes.OTHER_TYPE'),
        value: 'Other'
      }]
    }, {
      name: 'engagement.productName',
      label: translate('productName'),
      type: 'enumeration',
      options: [{
        label: translate('productNames.PRODUCT_ADD_ONS'),
        value: 'PRODUCT_ADD_ONS'
      }, {
        label: translate('productNames.PRODUCT_CRM'),
        value: 'PRODUCT_CRM'
      }, {
        label: translate('productNames.PRODUCT_MARKETING_FREE'),
        value: 'PRODUCT_MARKETING_FREE'
      }, {
        label: translate('productNames.PRODUCT_SALES_FREE'),
        value: 'PRODUCT_SALES_FREE'
      }, {
        label: translate('productNames.PRODUCT_GROWTH_STACK'),
        value: 'PRODUCT_GROWTH_STACK'
      }, {
        label: translate('productNames.PRODUCT_MARKETING_PAID'),
        value: 'PRODUCT_MARKETING_PAID'
      }, {
        label: translate('productNames.PRODUCT_MARKETING_STARTER'),
        value: 'PRODUCT_MARKETING_STARTER'
      }, {
        label: translate('productNames.PRODUCT_SALES_PRO'),
        value: 'PRODUCT_SALES_PRO'
      }, {
        label: translate('productNames.PRODUCT_SALES_STARTER'),
        value: 'PRODUCT_SALES_STARTER'
      }, {
        label: translate('productNames.PRODUCT_SALES_HUB_ENTERPRISE'),
        value: 'PRODUCT_SALES_HUB_ENTERPRISE'
      }, {
        label: translate('productNames.PRODUCT_SERVICE_HUB'),
        value: 'PRODUCT_SERVICE_HUB'
      }, {
        label: translate('productNames.PRODUCT_SERVICE_PRO'),
        value: 'PRODUCT_SERVICE_PRO'
      }, {
        label: translate('productNames.PRODUCT_SERVICE_HUB_STARTER'),
        value: 'PRODUCT_SERVICE_HUB_STARTER'
      }, {
        label: translate('productNames.PRODUCT_SERVICE_HUB_ENTERPRISE'),
        value: 'PRODUCT_SERVICE_HUB_ENTERPRISE'
      }, {
        label: translate('productNames.PRODUCT_CMS'),
        value: 'PRODUCT_CMS'
      }, {
        label: translate('productNames.PRODUCT_UNKNOWN'),
        value: 'PRODUCT_UNKNOWN'
      }]
    }, {
      name: 'engagement.followUpAction',
      label: translate('followUpAction'),
      type: 'enumeration',
      options: [{
        label: translate('followUpActions.FOLLOW_UP_PASSED_TO_SALES'),
        value: 'FOLLOW_UP_PASSED_TO_SALES'
      }, {
        label: translate('followUpActions.FOLLOW_UP_INTERNAL_TRANSFER'),
        value: 'FOLLOW_UP_INTERNAL_TRANSFER'
      }, {
        label: translate('followUpActions.FOLLOW_UP_SENT_RESOURCES'),
        value: 'FOLLOW_UP_SENT_RESOURCES'
      }, {
        label: translate('followUpActions.FOLLOW_UP_NO_FOLLOW_UP'),
        value: 'FOLLOW_UP_NO_FOLLOW_UP'
      }]
    }]
  }]) : List();
};