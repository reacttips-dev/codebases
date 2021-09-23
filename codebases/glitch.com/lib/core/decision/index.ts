/**
 * Copyright 2020, Optimizely
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

import { DecisionObj } from '../decision_service';

/**
 * Get experiment key from the provided decision object
 * @param   {DecisionObj} decisionObj       Object representing decision
 * @returns {string}                        Experiment key or empty string if experiment is null
 */
export function getExperimentKey(decisionObj: DecisionObj): string {
   return decisionObj.experiment?.key ?? '';
}

/**
 * Get variation key from the provided decision object
 * @param   {DecisionObj} decisionObj       Object representing decision
 * @returns {string}                        Variation key or empty string if variation is null
 */
export function getVariationKey(decisionObj: DecisionObj): string {
   return decisionObj.variation?.key ?? '';
}

/**
 * Get featureEnabled from variation in the provided decision object
 * @param   {DecisionObj} decisionObj       Object representing decision
 * @returns {boolean}                       featureEnabled boolean or false if variation is null
 */
export function getFeatureEnabledFromVariation(decisionObj: DecisionObj): boolean {
   return decisionObj.variation?.featureEnabled ?? false;
}
