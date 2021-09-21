import { navigate } from "gatsby"
import { SessionStorageItems } from "@modules/localStorage/constants"

export {
  isAuthenticated,
  processLoginAttempt,
  authenticatePreview,
} from "./utils"
export { default as useCurrentUser } from "./hooks/useCurrentUser"

export function logout(path) {
  localStorage.setItem(`gatsby:token`, ``)
  localStorage.setItem(`gatsby:userid`, ``)
  localStorage.setItem(`gatsby:token-expiration`, ``)

  localStorage.setItem(`gatsby:ssotoken`, ``)
  localStorage.setItem(`gatsby:ssotoken-expiration`, ``)
  sessionStorage.removeItem(SessionStorageItems.NewSpaceForm)

  navigate(`/dashboard/login${path || ``}`)
}
