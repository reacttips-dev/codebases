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

import { createId, createEntity } from './lib/createEntity'
import { SEARCH } from '../../constants/actions'
import { AsyncAction } from '../../types'

function toEntities({ hits }: any, previousEntities: State): State {
  return hits.hits.reduce((acc, hit) => {
    acc[createId(hit)] = createEntity(hit, previousEntities[createId(hit)])
    return acc
  }, {})
}

interface State {
  [id: string]: any
}

type SearchAction = AsyncAction<typeof SEARCH>

export default function entitiesReducer(entities: State = {}, action: SearchAction): State {
  if (action.type === SEARCH) {
    if (action.error || action.payload === undefined) {
      return entities
    }

    return {
      ...entities,
      ...toEntities(action.payload, entities),
    }
  }

  return entities
}

export const getEntityById = (state: State, id: string) => state[id]
