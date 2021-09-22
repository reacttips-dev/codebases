import { createSelector } from 'reselect'

import { AppState } from '../index'
import { RowItem } from '../tables'

const selectBulkItemsState = (state: AppState) => (state ? state.bulkItems : undefined)

export const selectBulkIds = createSelector([selectBulkItemsState], bulkItemsState => {
  return bulkItemsState ? bulkItemsState.ids : undefined
})

export const selectBulkType = createSelector([selectBulkItemsState], bulkItemsState => {
  return bulkItemsState ? bulkItemsState.bulkType : undefined
})

export const selectSelectionStatus = createSelector([selectBulkItemsState], bulkItemsState => {
  return bulkItemsState ? bulkItemsState.selectionStatus : undefined
})

// TODO: store the bulk editable items in the state instead of passing in
export const selectDidSelectAll = (bulkEditableItems: RowItem[] = []) => {
  return createSelector([selectBulkIds], bulkIds => {
    if (bulkIds === undefined) {
      return false
    }

    return bulkIds.length > 0 && bulkIds.length >= bulkEditableItems.length
  })
}

// Let's us know if we can go ahead and show the "select every single one" button
// TODO: store the bulk editable items in the state instead of passing in
export const selectCanSelectAllAll = (bulkEditableItems: RowItem[] = []) =>
  createSelector(
    [selectDidSelectAll(bulkEditableItems), selectSelectionStatus],
    (didSelectAll, selectionStatus) => {
      switch (selectionStatus) {
        case 'page':
          return true
        case 'all': {
          return false
        }
        default:
          return didSelectAll
      }
    }
  )

export const selectHasBulkItems = createSelector([selectBulkIds], ids => {
  if (ids === undefined) {
    return false
  }

  return ids.length > 0
})

// TODO: store the bulk editable items in the state instead of passing in
export const selectItemsFromBulkIds = (items: [{ id: number | string }]) => {
  return createSelector([selectBulkIds], bulkIds => {
    if (bulkIds === undefined) {
      return []
    }

    // @ts-ignore -- TS can't handle the param possibly not being in the array
    return items.filter(item => bulkIds.includes(item.id))
  })
}
