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
import {
  UPDATE_PENDING_TEMPLATE_DESCRIPTION,
  UPDATE_PENDING_TEMPLATE_NAME,
} from '../../constants/actions'

export type State = {
  name: string
  description: string
}

const initialState: State = {
  name: '',
  description: '',
}

export default function pendingTemplateReducer(state: State = initialState, action) {
  if (action.type === UPDATE_PENDING_TEMPLATE_NAME) {
    if (action.payload === undefined) {
      return initialState
    }

    const { name } = action.payload

    return {
      ...state,
      name,
    }
  }

  if (action.type === UPDATE_PENDING_TEMPLATE_DESCRIPTION) {
    if (action.payload === undefined) {
      return initialState
    }

    const { description } = action.payload

    return {
      ...state,
      description,
    }
  }

  return state
}
