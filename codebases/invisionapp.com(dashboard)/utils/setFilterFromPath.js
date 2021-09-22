import { DEFAULT_FILTER_TYPE, FILTER_PATHS } from '../constants/FilterTypes'

export default function setFilterFromUrlType (type = '') {
  if (!type) return DEFAULT_FILTER_TYPE
  if (FILTER_PATHS[type]) return FILTER_PATHS[type]
  return type
}
