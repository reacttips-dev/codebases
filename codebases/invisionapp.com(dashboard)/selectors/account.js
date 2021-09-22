import { createSelector } from 'reselect'

const FREEHAND_ONLY_SEAT = 3

const selectAccount = state => state.account

const selectUserV2 = createSelector(
  selectAccount,
  account => {
    if (account) {
      return account.userV2
    }
  }
)

const selectUserV2User = createSelector(
  selectUserV2,
  userV2 => {
    if (userV2) {
      return userV2.user
    }
  }
)

export const selectSeatTypeId = createSelector(
  selectUserV2User,
  user => {
    if (user) {
      return user.seatTypeID
    }
  }
)

export const isFreehandOnlySeat = createSelector(
  selectSeatTypeId,
  seatTypeID => seatTypeID === FREEHAND_ONLY_SEAT
)

export const selectUserV2Flags = createSelector(
  selectUserV2,
  user => {
    if (user) {
      return user.flags
    }

    return {}
  }
)
