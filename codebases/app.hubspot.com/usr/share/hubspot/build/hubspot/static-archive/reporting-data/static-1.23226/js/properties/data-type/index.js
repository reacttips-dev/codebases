'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Object$assign2, _Object$assign3;

import { OrderedMap } from 'immutable';
import * as DataTypes from '../../constants/dataTypes';
import * as empty from '../empty';
import * as analyticsFunnel from './analytics-funnel';
import * as analyticsSources from './analytics-sources';
import * as attribution from './attribution';
import * as attributionTouchPoints from './attribution-touch-points';
import * as calls from './calls';
import * as companies from './companies';
import * as contacts from './contacts';
import * as contactCreateAttribution from './contact-create-attribution';
import * as conversations from './conversations';
import * as conversion from './conversion';
import * as dealCreateAttribution from './deal-create-attribution';
import * as deals from './deals';
import * as emails from './email';
import * as engagement from './engagement';
import * as engagementEmails from './engagement-emails';
import * as engagements from './engagements';
import * as feedbackSubmissions from './feedback-submissions';
import * as knowledgeArticles from './knowledge-articles';
import * as lineItem from './line-items';
import * as meeting from './meetings';
import * as notes from './notes';
import * as products from './products';
import * as quotas from './quotas';
import * as socialPosts from './social-posts';
import * as tasks from './tasks';
import * as tickets from './tickets';
import { createUnifiedProperties } from './unified';
import * as experimentalRevenue from './__experimental__/revenue';
import * as unifiedDataTypes from '../../constants/dataTypes/unified';
var unifiedPropertyGroups = Object.keys(unifiedDataTypes).reduce(function (groups, dataType) {
  return Object.assign({}, groups, _defineProperty({}, dataType, createUnifiedProperties(dataType)));
}, {});
export default OrderedMap(Object.assign((_Object$assign2 = {}, _defineProperty(_Object$assign2, DataTypes.ANALYTICS_FUNNEL, analyticsFunnel), _defineProperty(_Object$assign2, DataTypes.ATTRIBUTION, attribution), _defineProperty(_Object$assign2, DataTypes.ATTRIBUTION_TOUCH_POINTS, attributionTouchPoints), _defineProperty(_Object$assign2, DataTypes.CALLS, calls), _defineProperty(_Object$assign2, DataTypes.COMPANIES, companies), _defineProperty(_Object$assign2, DataTypes.CONTACTS, contacts), _defineProperty(_Object$assign2, DataTypes.CONTACT_CREATE_ATTRIBUTION, contactCreateAttribution), _defineProperty(_Object$assign2, DataTypes.CONVERSATIONS, conversations), _defineProperty(_Object$assign2, DataTypes.CONVERSION, conversion), _defineProperty(_Object$assign2, DataTypes.CROSS_OBJECT, empty), _defineProperty(_Object$assign2, DataTypes.CRM_OBJECT, empty), _defineProperty(_Object$assign2, DataTypes.DEAL_CREATE_ATTRIBUTION, dealCreateAttribution), _defineProperty(_Object$assign2, DataTypes.DEALS, deals), _defineProperty(_Object$assign2, DataTypes.EMAIL, emails), _defineProperty(_Object$assign2, DataTypes.ENGAGEMENT, engagement), _defineProperty(_Object$assign2, DataTypes.ENGAGEMENTS, engagements), _defineProperty(_Object$assign2, DataTypes.ENGAGEMENT_EMAILS, engagementEmails), _defineProperty(_Object$assign2, DataTypes.FEEDBACK_SUBMISSIONS, feedbackSubmissions), _defineProperty(_Object$assign2, DataTypes.KNOWLEDGE_ARTICLES, knowledgeArticles), _defineProperty(_Object$assign2, DataTypes.LINE_ITEMS, lineItem), _defineProperty(_Object$assign2, DataTypes.MEETINGS, meeting), _defineProperty(_Object$assign2, DataTypes.NOTES, notes), _defineProperty(_Object$assign2, DataTypes.PRODUCTS, products), _defineProperty(_Object$assign2, DataTypes.QUOTAS, quotas), _defineProperty(_Object$assign2, DataTypes.SOCIAL_POSTS, socialPosts), _defineProperty(_Object$assign2, DataTypes.TASKS, tasks), _defineProperty(_Object$assign2, DataTypes.TICKETS, tickets), _Object$assign2), unifiedPropertyGroups, (_Object$assign3 = {}, _defineProperty(_Object$assign3, DataTypes.ANALYTICS_SOURCES, analyticsSources), _defineProperty(_Object$assign3, DataTypes.EXPERIMENTAL_REVENUE, experimentalRevenue), _Object$assign3)));