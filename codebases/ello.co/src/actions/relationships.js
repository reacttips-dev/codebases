import { RELATIONSHIPS } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'

export function batchUpdateRelationship(userIds, priority) {
  return {
    type: RELATIONSHIPS.BATCH_UPDATE_INTERNAL,
    payload: { userIds, priority },
  }
}

export function updateRelationship(userId, priority, existing, internal = false) {
  const action = internal ?
    {
      type: RELATIONSHIPS.UPDATE_INTERNAL,
      meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
      payload: { userId, priority, existing },
    } :
    {
      type: RELATIONSHIPS.UPDATE,
      meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
      payload: {
        endpoint: api.relationshipAdd(userId, priority),
        existing,
        method: 'POST',
        priority,
        userId,
      },
    }
  return action
}

