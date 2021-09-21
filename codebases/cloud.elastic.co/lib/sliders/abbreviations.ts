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

// For cases we need to distinguish between sliders, but
// don't have enough real estate to display the full name
export const getSliderAbbreviation = function (sliderName: string): string {
  switch (sliderName) {
    case `AppSearch App-Server`:
      return `S`
    case `AppSearch Worker`:
      return `W`
    default:
      return ``
  }
}
