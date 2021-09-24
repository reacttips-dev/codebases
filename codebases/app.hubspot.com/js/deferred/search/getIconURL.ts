import BLOG_POST from 'bender-url!unified-navigation-ui/html/templates/icons/search/blog_icon.svg';
import CALL from 'bender-url!unified-navigation-ui/html/templates/icons/search/call_icon.svg';
import CAMPAIGN from 'bender-url!unified-navigation-ui/html/templates/icons/search/campaign_icon.svg';
import CERTIFICATION from 'bender-url!unified-navigation-ui/html/templates/icons/search/certification_icon.svg';
import CUSTOM_OBJECT from 'bender-url!unified-navigation-ui/html/templates/icons/search/custom_object_icon.svg';
import DEAL from 'bender-url!unified-navigation-ui/html/templates/icons/search/deal_icon.svg';
import EMAIL from 'bender-url!unified-navigation-ui/html/templates/icons/search/email_icon.svg';
import KNOWLEDGE_DOC from 'bender-url!unified-navigation-ui/html/templates/icons/search/knowledge_icon.svg';
import LIST from 'bender-url!unified-navigation-ui/html/templates/icons/search/list_icon.svg';
import LOCKED from 'bender-url!unified-navigation-ui/html/templates/icons/search/locked_icon.svg';
import MEETING from 'bender-url!unified-navigation-ui/html/templates/icons/search/meeting_icon.svg';
import NAVIGATION from 'bender-url!unified-navigation-ui/html/templates/icons/search/navigation_icon.svg';
import NOTE from 'bender-url!unified-navigation-ui/html/templates/icons/search/note_icon.svg';
import SETTINGS from 'bender-url!unified-navigation-ui/html/templates/icons/search/setting_icon.svg';
import SOCIAL from 'bender-url!unified-navigation-ui/html/templates/icons/search/social_icon.svg';
import TASK from 'bender-url!unified-navigation-ui/html/templates/icons/search/task_icon.svg';
import TICKET from 'bender-url!unified-navigation-ui/html/templates/icons/search/ticket_icon.svg';
import WEBSITE from 'bender-url!unified-navigation-ui/html/templates/icons/search/website_icon.svg';
import WORKFLOW from 'bender-url!unified-navigation-ui/html/templates/icons/search/workflow_icon.svg';
import RESULT_TYPES from './const/RESULT_TYPES';
export default function getIconURL(result) {
  var ICONS = {
    BLOG_POST: BLOG_POST,
    CALL: CALL,
    CAMPAIGN: CAMPAIGN,
    CUSTOM_OBJECT: CUSTOM_OBJECT,
    DEAL: DEAL,
    EMAIL: EMAIL,
    KNOWLEDGE_DOC: KNOWLEDGE_DOC,
    LEARNING_CENTER_LESSON: CERTIFICATION,
    LEARNING_CENTER_TRACK: CERTIFICATION,
    LIST: LIST,
    LOCKED: LOCKED,
    MEETING: MEETING,
    NAVIGATION: NAVIGATION,
    NOTE: NOTE,
    SETTINGS: SETTINGS,
    SOCIAL: SOCIAL,
    TASK: TASK,
    TICKET: TICKET,
    TRANSCRIPT: CALL,
    LANDING_PAGE: WEBSITE,
    SITE_PAGE: WEBSITE,
    WORKFLOW: WORKFLOW
  };
  var resultType = result.resultType,
      properties = result.properties;
  var CONTACT = RESULT_TYPES.CONTACT,
      COMPANY = RESULT_TYPES.COMPANY,
      RESULT_NAVIGATION = RESULT_TYPES.NAVIGATION,
      ACTIVITY = RESULT_TYPES.ACTIVITY;

  if (resultType === CONTACT || resultType === COMPANY) {
    return undefined;
  }

  if (resultType === RESULT_NAVIGATION) {
    return properties.isLocked === true ? LOCKED : NAVIGATION;
  }

  if (resultType === ACTIVITY) {
    return ICONS[properties.engagementType];
  }

  return ICONS[resultType];
}