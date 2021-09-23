import { useEffect } from 'react'

import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { getCookieSettings } from 'lib/cookies'

const VERIFY_REDIRECT_COOKIE = 'verified'

export const useVerifyNotification = () => {
  const toast = useToast()
  const { t } = useTranslation()
  useEffect(() => {
    const cookieSettings = getCookieSettings()
    if (!cookieSettings?.ANALYTICS_AND_FUNCTIONAL?.enabled) return
    if (localStorage.getItem(VERIFY_REDIRECT_COOKIE)) {
      toast({
        title: t('network:auth.verify.verified.title', 'Thank you.'),
        description: t(
          'network:auth.verify.verified.description',
          'You have confirmed your email address.',
        ),
        status: 'success',
      })

      if (typeof window !== 'undefined') {
        localStorage.removeItem(VERIFY_REDIRECT_COOKIE)
      }
    }
  }, [])
}
