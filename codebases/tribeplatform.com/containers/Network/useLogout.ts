import { resetAuthCookies } from 'utils/authCookies.utils'

export const useLogout = () => {
  const logout = async () => {
    resetAuthCookies()
    window.location.href = '/auth/login'
  }

  return {
    logout,
  }
}
