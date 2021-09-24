'use es6';

export var CREATE_DATE = 'hs_createdate';
export var LAST_MODIFIED_DATE = 'hs_lastmodifieddate';
export var OWNER_ID = 'hubspot_owner_id';
export var TEAM_ID = 'hubspot_team_id';
export var OWNER_ASSIGNED_DATE = 'hubspot_owner_assigneddate';
export var ENGAGEMENT_TYPE = 'hs_engagement_type'; // This corresponds to the objectId returned with an object

export var OBJECT_ID = 'hs_object_id'; // this property is used like a foreign key to relate back to a sequence or workflow

export var ENGAGEMENT_ID = 'hs_unique_id';
export var ENGAGEMENT_TIMESTAMP = 'hs_timestamp';
export var ACTIVITY_TYPE = 'hs_activity_type';
export var ENGAGEMENT_SOURCE = 'hs_engagement_source';
export var ENGAGEMENT_SOURCE_ID = 'hs_engagement_source_id';
export var AT_MENTIONED_OWNERS = 'hs_at_mentioned_owner_ids';
export var CREATED_BY = 'hs_created_by';
export var MODIFIED_BY = 'hs_modified_by';
export var ATTACHMENT_IDS = 'hs_attachment_ids';
export var ALL_ACCESSIBLE_TEAM_IDS = 'hs_all_accessible_team_ids';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}