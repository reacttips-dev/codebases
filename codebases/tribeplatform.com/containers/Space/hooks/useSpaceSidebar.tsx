import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

export type SpaceSidebarContextProps = {
  openModals: {
    [modal: string]: boolean
  }
  openModal: (modal: string) => void
  closeModal: (modal: string) => void
}
export const SpaceSidebarContext = createContext<
  SpaceSidebarContextProps | undefined
>(undefined)

export const SpaceSidebarContextProvider: FC = ({ children }) => {
  const [openModals, setOpenModals] = useState<
    SpaceSidebarContextProps['openModals']
  >({})

  const openModal = useCallback(
    (modal: string) => {
      setOpenModals({ ...openModals, [modal]: true })
    },
    [openModals],
  )

  const closeModal = useCallback(
    (modal: string) => {
      setOpenModals({ ...openModals, [modal]: false })
    },
    [openModals],
  )

  return (
    <SpaceSidebarContext.Provider
      value={{
        openModals,
        openModal,
        closeModal,
      }}
    >
      {children}
    </SpaceSidebarContext.Provider>
  )
}

export const useSpaceModal = (
  modalId: string,
  { defaultIsOpen = false } = {},
) => {
  const { openModal, openModals, closeModal } =
    useContext(SpaceSidebarContext) || {}

  const open = useCallback(() => {
    if (openModal) openModal(modalId)
  }, [modalId, openModal])

  const close = useCallback(() => {
    if (closeModal) closeModal(modalId)
  }, [modalId, closeModal])

  const toggle = useCallback(
    (isOpen: boolean) => {
      if (isOpen) open()
      else close()
    },
    [open, close],
  )

  // Check if the modal is open by default
  useEffect(() => {
    if (defaultIsOpen) {
      open()
    }

    // Do this only on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultIsOpen])

  return {
    isOpen: openModals && openModals[modalId],
    toggle,
    open,
    close,
  }
}
