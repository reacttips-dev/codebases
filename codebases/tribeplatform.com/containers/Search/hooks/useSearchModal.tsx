import { useEffect, useCallback } from 'react'

import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'

const MODAL_ID = 'search'

export const useSearch = () => {
  const { open, isOpen, close } = useSpaceModal(MODAL_ID)

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        open()
      }
    },
    [open],
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return {
    isSearchModalOpen: isOpen,
    openSearchModal: open,
    closeSearchModal: close,
  }
}
