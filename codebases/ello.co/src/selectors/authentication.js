// state.authentication.xxx
export const selectAccessToken = state => state.authentication.get('accessToken')
export const selectExpirationDate = state => state.authentication.get('expirationDate')
export const selectIsLoggedIn = state => state.authentication.get('isLoggedIn')
export const selectConfirmationCodeRequestStatus = state => state.authentication.get('confirmationCodeRequestStatus')
export const selectRefreshToken = state => state.authentication.get('refreshToken')
export const selectPublicToken = state => state.authentication.getIn(['publicToken', 'accessToken'])
export const selectPublicTokenExpirationDate = state =>
  state.authentication.getIn(['publicToken', 'expirationDate'])

// Autentication selectors are not memoized because of the date time check
export const selectUnexpiredAccessToken = (state) => {
  const accessToken = selectAccessToken(state)
  const expDate = selectExpirationDate(state)
  if (accessToken && expDate > new Date()) {
    return accessToken
  }
  return null
}

export const selectValidRefreshToken = (state) => {
  const accessToken = selectAccessToken(state)
  const expDate = selectExpirationDate(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const refreshToken = selectRefreshToken(state)
  if (isLoggedIn && accessToken && !(expDate > new Date())) {
    return refreshToken
  }
  return null
}

export const selectUnexpiredPublicToken = (state) => {
  const publicToken = selectPublicToken(state)
  const expDate = selectPublicTokenExpirationDate(state)
  if (publicToken && expDate > new Date()) {
    return publicToken
  }
  return null
}
