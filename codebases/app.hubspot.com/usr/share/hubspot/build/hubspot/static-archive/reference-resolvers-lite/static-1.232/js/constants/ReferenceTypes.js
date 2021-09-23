'use es6';
/**
 * Types should be a superset of the ReferenceTypes
 * described in the previous iteration of this library,
 * taken from reference-resolvers/constants/ReferenceTypes.js
 *
 * This is the set of enums that a client should use to
 * reference one of the valid reference resolvers within
 * this library.
 */

/**
 * Add new external option types to this object whenever BE support
 * is added.
 *
 * See https://git.hubteam.com/HubSpot/ExternalOptions/blob/master/ExternalOptionsCore/src/main/java/com/hubspot/externaloptions/core/ReferenceType.java#L10
 */

var ExternalOptionsReferenceTypes = {
  MULTI_CURRENCY_CURRENCY_CODE: 'MULTI_CURRENCY_CURRENCY_CODE',
  OBJECT_REQUIREMENTS: 'OBJECT_REQUIREMENTS',
  OWNER: 'OWNER',
  PERSONA: 'PERSONA',
  TEAM: 'TEAM',
  PIPELINE: 'PIPELINE',
  PIPELINE_STAGE: 'PIPELINE_STAGE',
  WORKFLOW: 'WORKFLOW',
  BUSINESS_UNIT: 'BUSINESS_UNIT'
};
/**
 * While the default api uses the ExternalOptions service,
 * resolvers can make calls to any api. Therefore, this
 * set of enums won't always reflect support via the
 * ExternalOptions service.
 */

export var MULTI_CURRENCY_CURRENCY_CODE = ExternalOptionsReferenceTypes.MULTI_CURRENCY_CURRENCY_CODE;
export var OBJECT_REQUIREMENTS = ExternalOptionsReferenceTypes.OBJECT_REQUIREMENTS;
export var OWNER = ExternalOptionsReferenceTypes.OWNER;
export var PERSONA = ExternalOptionsReferenceTypes.PERSONA;
export var TEAM = ExternalOptionsReferenceTypes.TEAM;
export var PIPELINE = ExternalOptionsReferenceTypes.PIPELINE;
export var PIPELINE_STAGE = ExternalOptionsReferenceTypes.PIPELINE_STAGE;
export var WORKFLOW = ExternalOptionsReferenceTypes.WORKFLOW;
export var BUSINESS_UNIT = ExternalOptionsReferenceTypes.BUSINESS_UNIT;