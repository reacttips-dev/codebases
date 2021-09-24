/**
 * Copyright 2016-2020, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import fns from '../../utils/fns';
import {
    CONTROL_ATTRIBUTES,
    RESERVED_EVENT_KEYWORDS
} from '../../utils/enums';
import projectConfig from '../project_config';
import * as eventTagUtils from '../../utils/event_tag_utils';
import * as attributeValidator from '../../utils/attributes_validator';

var ACTIVATE_EVENT_KEY = 'campaign_activated';
var CUSTOM_ATTRIBUTE_FEATURE_TYPE = 'custom';
var ENDPOINT = 'https://logx.optimizely.com/v1/events';
var HTTP_VERB = 'POST';

/**
 * Get params which are used same in both conversion and impression events
 * @param  {Object} options.attributes    Object representing user attributes and values which need to be recorded
 * @param  {string} options.clientEngine  The client we are using: node or javascript
 * @param  {string} options.clientVersion The version of the client
 * @param  {Object} options.configObj     Object representing project configuration, including datafile information and mappings for quick lookup
 * @param  {string} options.userId        ID for user
 * @param  {Object} options.Logger        logger
 * @return {Object}                       Common params with properties that are used in both conversion and impression events
 */
function getCommonEventParams(options) {
    var attributes = options.attributes;
    var configObj = options.configObj;
    var anonymize_ip = configObj.anonymizeIP;
    var botFiltering = configObj.botFiltering;

    if (anonymize_ip === null || anonymize_ip === undefined) {
        anonymize_ip = false;
    }

    var visitor = {
        snapshots: [],
        visitor_id: options.userId,
        attributes: [],
    };

    var commonParams = {
        account_id: configObj.accountId,
        project_id: configObj.projectId,
        visitors: [visitor],
        revision: configObj.revision,
        client_name: options.clientEngine,
        client_version: options.clientVersion,
        anonymize_ip: anonymize_ip,
        enrich_decisions: true,
    };

    // Omit attribute values that are not supported by the log endpoint.
    Object.keys(attributes || {}).forEach(function(attributeKey) {
        var attributeValue = attributes[attributeKey];
        if (attributeValidator.isAttributeValid(attributeKey, attributeValue)) {
            var attributeId = projectConfig.getAttributeId(options.configObj, attributeKey, options.logger);
            if (attributeId) {
                commonParams.visitors[0].attributes.push({
                    entity_id: attributeId,
                    key: attributeKey,
                    type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
                    value: attributes[attributeKey],
                });
            }
        }
    });

    if (typeof botFiltering === 'boolean') {
        commonParams.visitors[0].attributes.push({
            entity_id: CONTROL_ATTRIBUTES.BOT_FILTERING,
            key: CONTROL_ATTRIBUTES.BOT_FILTERING,
            type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
            value: botFiltering,
        });
    }
    return commonParams;
}

/**
 * Creates object of params specific to impression events
 * @param  {Object}  configObj    Object representing project configuration
 * @param  {string}  experimentId ID of experiment for which impression needs to be recorded
 * @param  {string}  variationId  ID for variation which would be presented to user
 * @param  {string}  ruleKey      Key of experiment for which impression needs to be recorded
 * @param  {string}  ruleType     Type for the decision source
 * @param  {string}  flagKey      Key for a feature flag
 * @param  {boolean} enabled      Boolean representing if feature is enabled
 * @return {Object}               Impression event params
 */
function getImpressionEventParams(configObj, experimentId, variationId, ruleKey, ruleType, flagKey, enabled) {
    let campaignId = null;
    if (experimentId !== null) {
        campaignId = projectConfig.getLayerId(configObj, experimentId);
    }

    let variationKey = projectConfig.getVariationKeyFromId(configObj, variationId);
    if (variationKey === null) {
        variationKey = '';
    }

    var impressionEventParams = {
        decisions: [{
            campaign_id: campaignId,
            experiment_id: experimentId,
            variation_id: variationId,
            metadata: {
                flag_key: flagKey,
                rule_key: ruleKey,
                rule_type: ruleType,
                variation_key: variationKey,
                enabled: enabled,
            }
        }, ],
        events: [{
            entity_id: campaignId,
            timestamp: fns.currentTimestamp(),
            key: ACTIVATE_EVENT_KEY,
            uuid: fns.uuid(),
        }, ],
    };

    return impressionEventParams;
}

/**
 * Creates object of params specific to conversion events
 * @param  {Object} configObj                 Object representing project configuration
 * @param  {string} eventKey                  Event key representing the event which needs to be recorded
 * @param  {Object} eventTags                 Values associated with the event.
 * @param  {Object} logger                    Logger object
 * @return {Object}                           Conversion event params
 */
function getVisitorSnapshot(configObj, eventKey, eventTags, logger) {
    var snapshot = {
        events: [],
    };

    var eventDict = {
        entity_id: projectConfig.getEventId(configObj, eventKey),
        timestamp: fns.currentTimestamp(),
        uuid: fns.uuid(),
        key: eventKey,
    };

    if (eventTags) {
        var revenue = eventTagUtils.getRevenueValue(eventTags, logger);
        if (revenue !== null) {
            eventDict[RESERVED_EVENT_KEYWORDS.REVENUE] = revenue;
        }

        var eventValue = eventTagUtils.getEventValue(eventTags, logger);
        if (eventValue !== null) {
            eventDict[RESERVED_EVENT_KEYWORDS.VALUE] = eventValue;
        }

        eventDict['tags'] = eventTags;
    }
    snapshot.events.push(eventDict);

    return snapshot;
}

/**
 * Create impression event params to be sent to the logging endpoint
 * @param  {Object}  options               Object containing values needed to build impression event
 * @param  {Object}  options.attributes    Object representing user attributes and values which need to be recorded
 * @param  {string}  options.clientEngine  The client we are using: node or javascript
 * @param  {string}  options.clientVersion The version of the client
 * @param  {Object}  options.configObj     Object representing project configuration, including datafile information and mappings for quick lookup
 * @param  {string}  options.experimentId  Experiment for which impression needs to be recorded
 * @param  {string}  options.userId        ID for user
 * @param  {string}  options.variationId   ID for variation which would be presented to user
 * @param  {string}  options.ruleKey       Key of an experiment for which impression needs to be recorded
 * @param  {string}  options.ruleType      Type for the decision source
 * @param  {string}  options.flagKey       Key for a feature flag
 * @param  {boolean} options.enabled       Boolean representing if feature is enabled
 * @return {Object}                        Params to be used in impression event logging endpoint call
 */
export var getImpressionEvent = function(options) {
    var impressionEvent = {
        httpVerb: HTTP_VERB,
    };

    var commonParams = getCommonEventParams(options);
    impressionEvent.url = ENDPOINT;

    var impressionEventParams = getImpressionEventParams(
        options.configObj,
        options.experimentId,
        options.variationId,
        options.ruleKey,
        options.ruleType,
        options.flagKey,
        options.enabled,
    );
    // combine Event params into visitor obj
    commonParams.visitors[0].snapshots.push(impressionEventParams);

    impressionEvent.params = commonParams;

    return impressionEvent;
};

/**
 * Create conversion event params to be sent to the logging endpoint
 * @param  {Object} options                           Object containing values needed to build conversion event
 * @param  {Object} options.attributes                Object representing user attributes and values which need to be recorded
 * @param  {string} options.clientEngine              The client we are using: node or javascript
 * @param  {string} options.clientVersion             The version of the client
 * @param  {Object} options.configObj                 Object representing project configuration, including datafile information and mappings for quick lookup
 * @param  {string} options.eventKey                  Event key representing the event which needs to be recorded
 * @param  {Object} options.eventTags                 Object with event-specific tags
 * @param  {Object} options.logger                    Logger object
 * @param  {string} options.userId                    ID for user
 * @return {Object}                                   Params to be used in conversion event logging endpoint call
 */
export var getConversionEvent = function(options) {
    var conversionEvent = {
        httpVerb: HTTP_VERB,
    };

    var commonParams = getCommonEventParams(options);
    conversionEvent.url = ENDPOINT;

    var snapshot = getVisitorSnapshot(options.configObj, options.eventKey, options.eventTags, options.logger);

    commonParams.visitors[0].snapshots = [snapshot];
    conversionEvent.params = commonParams;

    return conversionEvent;
};

export default {
    getConversionEvent: getConversionEvent,
    getImpressionEvent: getImpressionEvent,
};