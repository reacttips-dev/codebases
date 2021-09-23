/**
 * Copyright 2016, 2018-2020, Optimizely
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
import { ObjectWithUnknownProperties } from '../../shared_types';

import fns from '../../utils/fns';
import { ERROR_MESSAGES } from '../enums';

const MODULE_NAME = 'ATTRIBUTES_VALIDATOR';

/**
 * Validates user's provided attributes
 * @param  {unknown}  attributes
 * @return {boolean}  true if the attributes are valid
 * @throws If the attributes are not valid
 */

export function validate(attributes: unknown): boolean {
  if (typeof attributes === 'object' && !Array.isArray(attributes) && attributes !== null) {
    Object.keys(attributes).forEach(function(key) {
      if (typeof (attributes as ObjectWithUnknownProperties)[key] === 'undefined') {
        throw new Error(sprintf(ERROR_MESSAGES.UNDEFINED_ATTRIBUTE, MODULE_NAME, key));
      }
    });
    return true;
  } else {
    throw new Error(sprintf(ERROR_MESSAGES.INVALID_ATTRIBUTES, MODULE_NAME));
  }
}

/**
 * Validates user's provided attribute
 * @param  {unknown}  attributeKey
 * @param  {unknown}  attributeValue
 * @return {boolean}  true if the attribute is valid
 */
export function isAttributeValid(attributeKey: unknown, attributeValue: unknown): boolean {
  return (
    typeof attributeKey === 'string' &&
    (typeof attributeValue === 'string' ||
      typeof attributeValue === 'boolean' ||
      (fns.isNumber(attributeValue) && fns.isSafeInteger(attributeValue)))
  );
}
