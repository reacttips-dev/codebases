import { useState } from 'react'

export default function useModalOpenState(): [boolean, () => void, () => void] {
  const [modalOpen, setModalOpen] = useState(false)

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  return [modalOpen, openModal, closeModal]
}
