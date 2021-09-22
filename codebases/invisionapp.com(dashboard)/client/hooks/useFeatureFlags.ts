import { useSelector } from 'react-redux'
import { selectFeatureFlags } from '../stores/featureFlags'

export const useFeatureFlags = () => {
  const flags = useSelector(selectFeatureFlags)

  return flags
}
