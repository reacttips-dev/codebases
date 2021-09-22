import { Reducer } from 'redux'
import concat from 'lodash/concat'
import remove from 'lodash/remove'
import { SEND } from '../invitations'
import { BulkItemsState } from './bulkItems.types'
import { ADD_BULK_ITEMS, RESET_BULK_ITEMS, TOGGLE_BULK_ITEMS } from './bulkItems.actions'

const initialState: BulkItemsState = {
  ids: [],
  bulkType: '',
  selectionStatus: 'none'
}

const bulkItemsReducer: Reducer<BulkItemsState> = (
  state = initialState,
  action = { type: '' }
) => {
  switch (action.type) {
    case TOGGLE_BULK_ITEMS: {
      const currentIds = state.ids
      const payloadId = action.payload.id

      let ids

      // @ts-ignore -- TS can't handle the param possibly not being in the array
      if (currentIds.includes(payloadId)) {
        // @ts-ignore -- TS can't handle the param possibly not being in the array
        ids = remove(currentIds, id => id !== payloadId)
      } else {
        ids = concat(currentIds, payloadId)
      }

      return {
        ...state,
        bulkType: action.payload.bulkType,
        ids,
        selectionStatus: ids.length === 0 ? 'none' : 'some'
      }
    }

    case RESET_BULK_ITEMS:
    case SEND.SUCCESS: {
      return {
        ...initialState,
        selectionStatus: 'none'
      }
    }

    case ADD_BULK_ITEMS: {
      return {
        ...state,
        ids: [...action.payload.ids],
        selectionStatus: action.payload.selectionStatus
      }
    }

    default: {
      return state
    }
  }
}

export default bulkItemsReducer
