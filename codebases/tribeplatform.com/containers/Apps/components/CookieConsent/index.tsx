import React, { useEffect, useState } from 'react'

import { getCookieSettings } from 'lib/cookies'

import CookieConsentPopUp from './CookieConsentPopUp'
import CookieConsentPreferencesModal from './CookieConsentPreferencesModal'

type Props = {
  sidebarVisible?: boolean
}

const CookieConsent = ({ sidebarVisible }: Props) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(true)
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false)

  useEffect(() => {
    if (
      !isPopUpOpen &&
      !isPreferencesModalOpen &&
      !getCookieSettings()?.hasUserConsent
    ) {
      setIsPopUpOpen(true)
    }
  }, [isPopUpOpen, isPreferencesModalOpen])

  const onManagePreferences = () => {
    setIsPreferencesModalOpen(true)
    setIsPopUpOpen(false)
  }
  return (
    <>
      {isPopUpOpen && (
        <CookieConsentPopUp
          sidebarVisible={sidebarVisible}
          onManage={onManagePreferences}
          onClose={() => setIsPopUpOpen(false)}
        />
      )}
      <CookieConsentPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
      />
    </>
  )
}

export default CookieConsent
