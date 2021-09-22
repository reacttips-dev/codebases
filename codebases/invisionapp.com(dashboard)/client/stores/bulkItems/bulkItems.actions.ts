import { BulkType } from './bulkItems.types'

export const TOGGLE_BULK_ITEMS = 'bulk/TOGGLE'
export const RESET_BULK_ITEMS = 'bulk/RESET'
export const ADD_BULK_ITEMS = 'bulk/SELECT_ITEMS'

export const toggleBulkItems = (id: number | string, bulkType: BulkType) => {
  return {
    type: TOGGLE_BULK_ITEMS,
    payload: { id, bulkType }
  }
}

export const resetBulkItems = () => {
  return {
    type: RESET_BULK_ITEMS
  }
}

export const addBulkItems = (ids: number[] | string[]) => {
  return {
    type: ADD_BULK_ITEMS,
    payload: {
      ids,
      selectionStatus: 'some'
    }
  }
}

export const addSelectPageBulkItems = (ids: number[] | string[]) => {
  return {
    type: ADD_BULK_ITEMS,
    payload: {
      ids,
      selectionStatus: 'page'
    }
  }
}

export const addSelectAllBulkItems = (ids: number[] | string[]) => {
  return {
    type: ADD_BULK_ITEMS,
    payload: {
      ids,
      selectionStatus: 'all'
    }
  }
}
