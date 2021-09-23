import React, { useState, useCallback } from 'react'

import { useRouter } from 'next/router'

import { GlobalModal, GlobalModalProps } from './GlobalModal'

type ModalsContextProps = {
  modals: GlobalModalProps[]
  showModal: (
    modalType: GlobalModalProps['type'],
    modalProps: GlobalModalProps,
  ) => void
  hideModal: (modalType: GlobalModalProps['type']) => void
}

export const modalsContext = React.createContext<ModalsContextProps | null>(
  null,
)

export const GlobalModalsProvider = ({ children }) => {
  const [modals, setModals] = useState<GlobalModalProps[]>([])
  const router = useRouter()

  const showModal = useCallback(
    (modalType: string, modalProps: GlobalModalProps) => {
      setModals(modals => [
        ...modals,
        {
          ...modalProps,
          type: modalType,
        },
      ])

      const { routeTo } = modalProps

      // If the modal wants to change the route
      if (routeTo) {
        router.push({ query: { ...router.query, ...modalProps } }, routeTo, {
          shallow: true,
        })
      }
    },
    [router],
  )

  const hideModal = useCallback(
    (modalType: GlobalModalProps['type']) => {
      const modal = modals.find(modal => modal.type === modalType)
      setModals(modals => modals.filter(modal => modal.type !== modalType))

      // If URL has been changed by the modal
      if (modal?.routeTo) router.back()
    },
    [router, modals],
  )

  return (
    <modalsContext.Provider value={{ modals, showModal, hideModal }}>
      {children}
    </modalsContext.Provider>
  )
}

export { GlobalModal }
