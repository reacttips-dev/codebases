'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { withBetGroups } from '../partial/bet-engagements';
import getDispositionOptions from '../partial/call-disposition-options';
import { ENGAGEMENTS } from '../../constants/dataTypes';
import { mergeProperties } from '../mergeProperties';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import engagementsModule from '../../dataTypeDefinitions/inboundDb/engagements';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
var ENGAGEMENT_TYPE_BLOCKLIST = ['EMAIL_REPLY', 'PROJECT_TASK', 'PUBLISHING_TASK', 'FEEDBACK_SUBMISSION'];

var ENGAGEMENTS_OVERRIDES = function ENGAGEMENTS_OVERRIDES() {
  return {
    'associations.contact': {
      name: 'associations.contact',
      label: I18n.text('reporting-data.properties.common.associatedContacts'),
      type: 'enumeration',
      scripted: true
    },
    'associations.company': {
      name: 'associations.company',
      label: I18n.text('reporting-data.properties.common.associatedCompanies'),
      type: 'enumeration',
      scripted: true
    },
    hs_lastmodifieddate: {
      hidden: true
    },
    hs_modified_by: {
      hidden: true
    },
    hs_engagement_source: {
      hidden: false
    },
    hs_all_accessible_team_ids: {
      hidden: true
    },
    hs_all_owner_ids: {
      hidden: true
    },
    hs_all_team_ids: {
      hidden: true
    },
    hs_at_mentioned_owner_ids: {
      hidden: true
    },
    hs_attachment_ids: {
      hidden: true
    }
  };
};

var CALL_OVERRIDES = function CALL_OVERRIDES(dispositions) {
  return {
    hs_call_duration: {
      type: 'duration'
    },
    hs_call_disposition: {
      options: dispositions
    }
  };
};

var CONVERSATION_SESSION_OVERRIDES = function CONVERSATION_SESSION_OVERRIDES() {
  return {
    hs_conversation_session_duration: {
      type: 'duration'
    },
    hs_conversation_session_agent_response_time: {
      type: 'duration',
      hidden: false
    },
    hs_conversation_session_visitor_wait_time: {
      type: 'duration'
    },
    hs_conversation_session_online: {
      hidden: true
    },
    hs_conversation_session_thread_id: {
      hidden: true
    },
    hs_conversation_session_session_closed_at: {
      hidden: false
    }
  };
};

var EMAIL_OVERRIDES = function EMAIL_OVERRIDES() {
  return {
    hs_email_text: {
      hidden: true
    },
    hs_email_tracker_key: {
      hidden: true
    },
    hs_email_message_id: {
      hidden: true
    },
    hs_email_thread_id: {
      hidden: true
    },
    hs_email_sent_via: {
      hidden: false
    },
    hs_email_attached_video_id: {
      hidden: true
    },
    hs_email_error_message: {
      hidden: true
    },
    hs_email_facsimile_send_id: {
      hidden: true
    },
    hs_email_logged_from: {
      hidden: true
    },
    hs_email_media_processing_status: {
      hidden: true
    },
    hs_email_post_send_status: {
      hidden: true
    },
    hs_email_recipient_drop_reasons: {
      hidden: true
    },
    hs_email_send_event_id: {
      hidden: true
    },
    hs_email_send_event_id_created: {
      hidden: true
    },
    hs_email_validation_skipped: {
      hidden: true
    }
  };
};

var MEETING_OVERRIDES = function MEETING_OVERRIDES() {
  return {
    hs_meeting_created_from_link_id: {
      hidden: true
    },
    hs_meeting_end_time: {
      hidden: true
    },
    hs_meeting_external_url: {
      hidden: true
    },
    hs_meeting_pre_meeting_prospect_reminders: {
      hidden: true
    },
    hs_meeting_source_id: {
      hidden: true
    },
    hs_meeting_web_conference_meeting_id: {
      hidden: true
    }
  };
};

var TASK_OVERRIDES = function TASK_OVERRIDES() {
  return {
    hs_task_for_object_type: {
      hidden: true
    },
    hs_task_reminders: {
      hidden: true
    },
    hs_task_send_default_reminder: {
      hidden: true
    }
  };
};

var PROJECT_TASK_OVERRIDES = function PROJECT_TASK_OVERRIDES() {
  return {
    hs_project_task_assignee_owner_ids: {
      hidden: true
    },
    hs_project_task_body: {
      hidden: true
    },
    hs_project_task_due_date: {
      hidden: true
    },
    hs_project_task_for_object_type: {
      hidden: true
    },
    hs_project_task_parent_id: {
      hidden: true
    },
    hs_project_task_parent_type: {
      hidden: true
    },
    hs_project_task_sort: {
      hidden: true
    },
    hs_project_task_status: {
      hidden: true
    },
    hs_project_task_subject: {
      hidden: true
    },
    hs_project_task_tags: {
      hidden: true
    },
    hs_project_task_top_level_parent_id: {
      hidden: true
    },
    hs_project_task_top_level_parent_type: {
      hidden: true
    }
  };
};

var PUBLISHING_TASK_OVERRIDES = function PUBLISHING_TASK_OVERRIDES() {
  return {
    hs_publishing_task_body: {
      hidden: true
    },
    hs_publishing_task_campaign_guid: {
      hidden: true
    },
    hs_publishing_task_category: {
      hidden: true
    },
    hs_publishing_task_category_id: {
      hidden: true
    },
    hs_publishing_task_content_id: {
      hidden: true
    },
    hs_publishing_task_name: {
      hidden: true
    },
    hs_publishing_task_state: {
      hidden: true
    }
  };
};

var filterEngagementTypes = function filterEngagementTypes(propertyGroups) {
  var groupIndex = propertyGroups.findIndex(function (group) {
    return group.get('name') === 'engagement';
  });

  if (groupIndex === -1) {
    return groupIndex;
  }

  return propertyGroups.update(groupIndex, function (group) {
    return group.update('properties', function (properties) {
      var propertyIndex = properties.findIndex(function (property) {
        return property.get('name') === 'hs_engagement_type';
      });

      if (propertyIndex === -1) {
        return properties;
      }

      return properties.update(propertyIndex, function (property) {
        return property.update('options', function (options) {
          return options.filter(function (option) {
            return !ENGAGEMENT_TYPE_BLOCKLIST.includes(option.get('value'));
          });
        });
      });
    });
  });
};

export var getPropertyGroups = function getPropertyGroups() {
  return Promise.all([getInboundDbPropertyGroups(ENGAGEMENTS), getDispositionOptions()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        propertyGroups = _ref2[0],
        dispositions = _ref2[1];

    var mergedGroups = propertyGroups;
    mergedGroups = mergeProperties(withBetGroups(propertyGroups), 'engagement', ENGAGEMENTS_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'call', CALL_OVERRIDES(dispositions));
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'conversation_session', CONVERSATION_SESSION_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'email', EMAIL_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'meeting', MEETING_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'task', TASK_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'project_task', PROJECT_TASK_OVERRIDES());
    mergedGroups = mergeProperties(withBetGroups(mergedGroups), 'publishing_task', PUBLISHING_TASK_OVERRIDES());
    return mergedGroups;
  }).then(filterEngagementTypes);
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(ENGAGEMENTS));
  })().then(overridePropertyTypes(engagementsModule.getInboundSpec()));
};