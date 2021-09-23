/**
 * Copyright 2019-2020, Optimizely
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
import {
    getLogger
} from '@optimizely/js-sdk-logging';

import fns from '../../utils/fns';
import projectConfig from '../project_config';
import * as eventTagUtils from '../../utils/event_tag_utils';
import * as attributesValidator from '../../utils/attributes_validator';
import * as decision from '../decision';

var logger = getLogger('EVENT_BUILDER');

/**
 * Creates an ImpressionEvent object from decision data
 * @param  {Object}  config
 * @param  {Object}  config.decisionObj
 * @param  {String}  config.userId
 * @param  {String}  config.flagKey
 * @param  {boolean} config.enabled
 * @param  {Object}  config.userAttributes
 * @param  {String}  config.clientEngine
 * @param  {String}  config.clientVersion
 * @return {Object}  an ImpressionEvent object
 */
export var buildImpressionEvent = function(config) {
    var configObj = config.configObj;
    var decisionObj = config.decisionObj;
    var userId = config.userId;
    var flagKey = config.flagKey;
    var enabled = config.enabled;
    var userAttributes = config.userAttributes;
    var clientEngine = config.clientEngine;
    var clientVersion = config.clientVersion;
    var ruleType = decisionObj.decisionSource;
    var experimentKey = decision.getExperimentKey(decisionObj);
    var variationKey = decision.getVariationKey(decisionObj);

    let experimentId = null;
    let variationId = null;

    if (experimentKey !== '' && variationKey !== '') {
        variationId = projectConfig.getVariationIdFromExperimentAndVariationKey(configObj, experimentKey, variationKey);
    }
    if (experimentKey !== '') {
        experimentId = projectConfig.getExperimentId(configObj, experimentKey);
    }
    let layerId = null;
    if (experimentId !== null) {
        layerId = projectConfig.getLayerId(configObj, experimentId);
    }
    return {
        type: 'impression',
        timestamp: fns.currentTimestamp(),
        uuid: fns.uuid(),

        user: {
            id: userId,
            attributes: buildVisitorAttributes(configObj, userAttributes),
        },

        context: {
            accountId: configObj.accountId,
            projectId: configObj.projectId,
            revision: configObj.revision,
            clientName: clientEngine,
            clientVersion: clientVersion,
            anonymizeIP: configObj.anonymizeIP || false,
            botFiltering: configObj.botFiltering,
        },

        layer: {
            id: layerId,
        },

        experiment: {
            id: experimentId,
            key: experimentKey,
        },

        variation: {
            id: variationId,
            key: variationKey,
        },

        ruleKey: experimentKey,
        flagKey: flagKey,
        ruleType: ruleType,
        enabled: enabled,
    };
};

/**
 * Creates a ConversionEvent object from track
 * @param {Object} config
 * @param {Object} config.configObj
 * @param {String} config.eventKey
 * @param {Object|undefined} config.eventTags
 * @param {String} config.userId
 * @param {Object} config.userAttributes
 * @param {String} config.clientEngine
 * @param {String} config.clientVersion
 * @return {Object} a ConversionEvent object
 */
export var buildConversionEvent = function(config) {
    var configObj = config.configObj;
    var userId = config.userId;
    var userAttributes = config.userAttributes;
    var clientEngine = config.clientEngine;
    var clientVersion = config.clientVersion;

    var eventKey = config.eventKey;
    var eventTags = config.eventTags;
    var eventId = projectConfig.getEventId(configObj, eventKey);

    let revenue = null;
    let eventValue = null;

    if (eventTags) {
        revenue = eventTagUtils.getRevenueValue(eventTags, logger);
        eventValue = eventTagUtils.getEventValue(eventTags, logger);
    }

    return {
        type: 'conversion',
        timestamp: fns.currentTimestamp(),
        uuid: fns.uuid(),

        user: {
            id: userId,
            attributes: buildVisitorAttributes(configObj, userAttributes),
        },

        context: {
            accountId: configObj.accountId,
            projectId: configObj.projectId,
            revision: configObj.revision,
            clientName: clientEngine,
            clientVersion: clientVersion,
            anonymizeIP: configObj.anonymizeIP || false,
            botFiltering: configObj.botFiltering,
        },

        event: {
            id: eventId,
            key: eventKey,
        },

        revenue: revenue,
        value: eventValue,
        tags: eventTags,
    };
};

function buildVisitorAttributes(configObj, attributes) {
    var builtAttributes = [];
    // Omit attribute values that are not supported by the log endpoint.
    Object.keys(attributes || {}).forEach(function(attributeKey) {
        var attributeValue = attributes[attributeKey];
        if (attributesValidator.isAttributeValid(attributeKey, attributeValue)) {
            var attributeId = projectConfig.getAttributeId(configObj, attributeKey, logger);
            if (attributeId) {
                builtAttributes.push({
                    entityId: attributeId,
                    key: attributeKey,
                    value: attributes[attributeKey],
                });
            }
        }
    });

    return builtAttributes;
}