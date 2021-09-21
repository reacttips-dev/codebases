/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { SliderInstanceType, SliderNodeType, VersionNumber } from '../../types'
import { isFleetServerAvailable } from '../stackDeployments/fleet'

export const getSliderDocLink = function ({
  sliderInstanceType,
  sliderNodeType,
  version,
}: {
  sliderInstanceType: SliderInstanceType
  sliderNodeType?: SliderNodeType
  version: VersionNumber | null
}): string | undefined {
  switch (sliderInstanceType) {
    case `elasticsearch`:
      switch (sliderNodeType) {
        case `ml`:
          return `machineLearningDocLink`
        case `ingest`:
          return `ingestIntroductionDocLink`
        default:
          return `elasticsearchIntroductionDocLink`
      }

    case `kibana`:
      return `kibanaIntroductionDocLink`
    case `apm`:
      if (isFleetServerAvailable({ version })) {
        // APM & Fleet page content has CTAs inline, so don't add more
        return undefined
      }

      return `apmOverviewDocLink`
    default:
      return undefined
  }
}
