// state.modal.xxx
export const selectIsModalActive = state => state.modal.get('isActive')
export const selectModalKind = state => state.modal.get('kind')
export const selectModalType = state => state.modal.get('type')

// Memoized selectors

