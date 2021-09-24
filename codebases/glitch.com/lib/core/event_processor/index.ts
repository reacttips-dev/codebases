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

import { LogTierV1EventProcessor, LocalStoragePendingEventsDispatcher } from '@optimizely/js-sdk-event-processor';

export function createEventProcessor(
  ...args: ConstructorParameters<typeof LogTierV1EventProcessor>
): LogTierV1EventProcessor {
  return new LogTierV1EventProcessor(...args);
}

export type { EventProcessor } from '@optimizely/js-sdk-event-processor';

export default { createEventProcessor, LocalStoragePendingEventsDispatcher };
