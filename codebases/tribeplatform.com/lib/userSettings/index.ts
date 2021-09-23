import { getCookieSettings } from 'lib/cookies'
import {
  SetUserSettingValue,
  UserSettings,
  SetUserSettingType,
} from 'lib/userSettings/@types'

const isClient = typeof window !== 'undefined'

export const getUserSettings = (): UserSettings =>
  isClient && JSON?.parse(window.localStorage.getItem('userSettings') || '""')

export const setUserSetting = (
  type: SetUserSettingType,
  value: SetUserSettingValue,
): UserSettings | undefined => {
  const cookieSettings = getCookieSettings()
  if (isClient && cookieSettings?.ANALYTICS_AND_FUNCTIONAL?.enabled) {
    const userSettings: UserSettings = getUserSettings()
    let newUserSettings: UserSettings

    switch (type) {
      case 'spaceCollection':
        newUserSettings = {
          ...userSettings,
          spaceCollections: {
            ...userSettings?.spaceCollections,
            [value?.id]: {
              isExpanded: value?.isExpanded,
              name: value?.name,
            },
          },
        }
        break

      default:
        return undefined
        break
    }

    window.localStorage.setItem(
      'userSettings',
      JSON?.stringify(newUserSettings),
    )
    return newUserSettings
  }
}
