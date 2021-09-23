import * as MAPPING_TYPES from '../../constants/mapping_types'

export function notificationsFromActivities(activities) {
  return { type: MAPPING_TYPES.NOTIFICATIONS, ids: activities }
}

export function settingsToggles(settings) {
  return { type: MAPPING_TYPES.SETTINGS, ids: settings }
}

export function userResults(users) {
  const result = { type: MAPPING_TYPES.USERS, ids: [] }
  users.forEach((user) => {
    result.ids.push(`${user.id}`)
  })
  return result
}

