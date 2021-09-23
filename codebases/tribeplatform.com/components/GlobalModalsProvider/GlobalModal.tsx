import React, { ReactNode } from 'react'

import { runIfFn } from '@chakra-ui/utils'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from 'tribe-components'

import useGlobalModal from 'hooks/useGlobalModal'

export interface GlobalModalProps {
  type: string
  routeTo?: string
  children: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any
}

/** HOC for each global modal */
export const GlobalModal = ({ type, children, ...props }: GlobalModalProps) => {
  const { isVisible, hide, modal = {} } = useGlobalModal(type)

  return (
    <Modal isOpen={isVisible} onClose={hide}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {runIfFn(children, { type, ...props, ...modal })}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
