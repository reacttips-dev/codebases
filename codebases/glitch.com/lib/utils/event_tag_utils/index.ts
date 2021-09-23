/**
 * Copyright 2017, 2019-2020 Optimizely
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
import { sprintf } from '@optimizely/js-sdk-utils';

import { EventTags } from '@optimizely/js-sdk-event-processor';
import { LoggerFacade } from '@optimizely/js-sdk-logging';

import {
  LOG_LEVEL,
  LOG_MESSAGES,
  RESERVED_EVENT_KEYWORDS,
} from '../enums';

/**
 * Provides utility method for parsing event tag values
 */
const MODULE_NAME = 'EVENT_TAG_UTILS';
const REVENUE_EVENT_METRIC_NAME = RESERVED_EVENT_KEYWORDS.REVENUE;
const VALUE_EVENT_METRIC_NAME = RESERVED_EVENT_KEYWORDS.VALUE;

/**
 * Grab the revenue value from the event tags. "revenue" is a reserved keyword.
 * @param {EventTags} eventTags
 * @param {LoggerFacade} logger
 * @return {number|null}
 */
export function getRevenueValue(eventTags: EventTags, logger: LoggerFacade): number | null {
  if (eventTags.hasOwnProperty(REVENUE_EVENT_METRIC_NAME)) {
    const rawValue = eventTags[REVENUE_EVENT_METRIC_NAME];
    let parsedRevenueValue;
    if (typeof rawValue === 'string') {
      parsedRevenueValue = parseInt(rawValue);
      if (isNaN(parsedRevenueValue)) {
        logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FAILED_TO_PARSE_REVENUE, MODULE_NAME, rawValue));
        return null;
      }
      logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_REVENUE_VALUE, MODULE_NAME, parsedRevenueValue));
      return parsedRevenueValue;
    }
    if (typeof rawValue === 'number') {
      parsedRevenueValue = rawValue;
      logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_REVENUE_VALUE, MODULE_NAME, parsedRevenueValue));
      return parsedRevenueValue;
    }
    return null;
  }
  return null;
}

/**
 * Grab the event value from the event tags. "value" is a reserved keyword.
 * @param {EventTags} eventTags
 * @param {LoggerFacade} logger
 * @return {number|null}
 */
export function getEventValue(eventTags: EventTags, logger: LoggerFacade): number | null {
  if (eventTags.hasOwnProperty(VALUE_EVENT_METRIC_NAME)) {
    const rawValue = eventTags[VALUE_EVENT_METRIC_NAME];
    let parsedEventValue;
    if (typeof rawValue === 'string') {
      parsedEventValue = parseFloat(rawValue);
      if (isNaN(parsedEventValue)) {
        logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FAILED_TO_PARSE_VALUE, MODULE_NAME, rawValue));
        return null;
      }
    logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_NUMERIC_VALUE, MODULE_NAME, parsedEventValue));
    return parsedEventValue;
    }
    if (typeof rawValue === 'number') {
      parsedEventValue = rawValue;
      logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_NUMERIC_VALUE, MODULE_NAME, parsedEventValue));
      return parsedEventValue;
    }
    return null;
  }
  return null;
}
