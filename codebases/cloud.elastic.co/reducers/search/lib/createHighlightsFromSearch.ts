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

import { forOwn, sortBy, get } from 'lodash'

export default function createHighlights({ highlight, oldHit, nameField }) {
  if (!highlight) {
    return {
      extraFields: get(oldHit, [`highlights`, `extraFields`]),
      title: get(oldHit, [`highlights`, `title`]),
    }
  }

  let extraFields: any[] = []
  let title: any = null

  forOwn(highlight, (value, key) => {
    if (key === nameField) {
      title = { field: key, text: value[0] }
    } else {
      extraFields.push({ field: key, text: value[0] })
    }
  })

  // sort based on the length of the key, since shorter keys will be further up the chain and probably more relevant
  extraFields = sortBy(extraFields, (o) => o.field.length)

  return {
    extraFields,
    title,
  }
}
