/** @jsx jsx */
import React, { useRef } from 'react'
import { Box, Flex, jsx } from 'theme-ui'
import { useOverlayTriggerState } from '@react-stately/overlays'
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProvider,
  OverlayContainer,
} from '@react-aria/overlays'
import { useDialog } from '@react-aria/dialog'
import { FocusScope } from '@react-aria/focus'
import { useButton } from '@react-aria/button'
import { Button, Link } from '../Button/Button'
import Heading from '../Heading/Heading'
import { Icon } from '../Icons/Icon'

const ModalDialog = (props) => {
  const { title, children, onClose } = props

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef()
  const { overlayProps } = useOverlay(props, ref)

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll()
  const { modalProps } = useModal()

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref)

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FocusScope contain restoreFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          sx={{
            backgroundColor: 'background',
            color: 'text',
            margin: '6pt auto',
            border: '1px solid',
            borderColor: 'gray.1',
            boxSizing: 'border-box',
            boxShadow: '-8px 12px 24px #adbcff',
            padding: '34px 34px',
            borderRadius: '4px',
            transition: 'all 0.2s ease 0s',
            width: ['300px', '600px'],
            maxHeight: ['400px', '800px'],
            overflow: 'auto',
          }}
        >
          <Flex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <Heading as="h4" {...titleProps} style={{ marginTop: 0 }}>
              {title}
            </Heading>
            <Button
              variant="blank"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'blue',
                },
                lineHeight: '0',
                fontSize: 3,
              }}
              onClick={onClose}
            >
              <Icon
                icon="x"
                alt="Close overlay"
              />
            </Button>
          </Flex>
          {children}
        </div>
      </FocusScope>
    </Box>
  )
}

export interface IOverlayProps {
  variant?: string
  title?: string,
  buttonText?: string,
  passThroughTrigger?: React.ReactNode,
  children: JSX.Element,
}

export const Overlay: React.FC<IOverlayProps> = ({
  children,
  buttonText,
  passThroughTrigger,
  title,
  ...props
}) => {
  const state = useOverlayTriggerState({})

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes!
  const { buttonProps: openButtonProps } = useButton({
    onPress: () => state.open(),
  })

  const { buttonProps: closeButtonProps } = useButton({
    onPress: () => state.close(),
  })

  return (
    <OverlayProvider>
      <React.Fragment>
        { buttonText && <Button {...openButtonProps}>{buttonText}</Button> }
        { passThroughTrigger && (
          <span {...openButtonProps}>{passThroughTrigger}</span>
        )}
        {state.isOpen && (
          <OverlayContainer>
            <ModalDialog
              title={title}
              onClose={state.close}
              isOpen
              isDismissable
            >
              {children()}
            </ModalDialog>
          </OverlayContainer>
        )}
      </React.Fragment>
    </OverlayProvider>
  )
}

