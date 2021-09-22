import { createSelector } from 'reselect'
import { AppState } from '..'

export const selectLastSeen = createSelector(
  (state: AppState) => state.lastSeen?.data ?? [],
  lastSeen => lastSeen
)

export const selectIsLastSeenLoading = createSelector(
  (state: AppState) => state.lastSeen?.status ?? '',
  status => status === 'loading'
)
