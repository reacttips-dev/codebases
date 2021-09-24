import { useCallback, useEffect, useState } from 'react'

import ToolsLineIcon from 'remixicon-react/ToolsLineIcon'

import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

export const EXPERIMENTAL_FEATURES_FLAG = 'dev_mode'

export const EXPERIMENTAL_FEATURES_TOGGLE_THRESHOLD = 8

export const EXPERIMENTAL_FEATURES_ENABLED = Boolean(
  typeof window !== 'undefined' &&
    localStorage.getItem(EXPERIMENTAL_FEATURES_FLAG) === '1',
)

const initialFooterClickCount = EXPERIMENTAL_FEATURES_ENABLED
  ? EXPERIMENTAL_FEATURES_TOGGLE_THRESHOLD
  : 0

const useDevMode = () => {
  const [enabled, setEnabled] = useState(EXPERIMENTAL_FEATURES_ENABLED)
  const [clickCount, setClickCount] = useState(initialFooterClickCount)
  const toast = useToast()
  const { t } = useTranslation()

  const enableExperimentalFeatures = useCallback(() => setEnabled(true), [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener(
      EXPERIMENTAL_FEATURES_FLAG,
      enableExperimentalFeatures,
    )

    return () => {
      window.removeEventListener(
        EXPERIMENTAL_FEATURES_FLAG,
        enableExperimentalFeatures,
      )
    }
  }, [enableExperimentalFeatures])

  const onDevPlaceholderClick = useCallback(() => {
    // If user clicked enough times,
    // enable experimental features (like dark mode)
    if (clickCount + 1 === EXPERIMENTAL_FEATURES_TOGGLE_THRESHOLD) {
      localStorage.setItem(EXPERIMENTAL_FEATURES_FLAG, '1')
      window.dispatchEvent(new Event(EXPERIMENTAL_FEATURES_FLAG))
      setClickCount(EXPERIMENTAL_FEATURES_TOGGLE_THRESHOLD)
      toast({
        title: t('common:experimental_features.title'),
        description: t('common:experimental_features.description'),
        icon: ToolsLineIcon,
      })
    } else if (clickCount < EXPERIMENTAL_FEATURES_TOGGLE_THRESHOLD) {
      setClickCount(count => count + 1)
    }
  }, [clickCount])

  return {
    onDevPlaceholderClick,
    enabled,
  }
}

export default useDevMode
