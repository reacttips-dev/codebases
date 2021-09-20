import { Entry } from 'contentful'
import {
  CONTENT_TYPE,
  IModalButton as IContentfulModalButton,
} from 'marketing-site/@types/generated/contentful'
import { renderTransformedComponent } from 'marketing-site/lib/transformedComponents'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import { ModalSize } from 'marketing-site/src/components/common/Modal'
import { CTAButton, IProps as ICTAButton } from 'marketing-site/src/library/elements/CTAButton'
import { ModalWithPersistedState } from 'marketing-site/src/library/elements/ModalWithPersistedState'
import * as Utils from 'marketing-site/src/library/utils'
import React from 'react'

export function isModalButton(entry: Entry<any>): entry is IContentfulModalButton {
  return entry.sys.contentType.sys.id === 'modalButton'
}

export const ContentfulModalButton: React.FC<IContentfulModalButton> = (
  ctaButton: IContentfulModalButton,
) => {
  const [modalOpen, openModal, closeModal] = useModalOpenState()
  const modalContentTypeId = ctaButton.fields.modalComponent.sys.contentType.sys.id as CONTENT_TYPE
  const modalEntry = ctaButton.fields.modalComponent

  const modalSizeKey: keyof typeof ModalSize = ctaButton.fields.modalSize
  const modalSize = ModalSize[modalSizeKey]

  let backgroundColor: Utils.Color | undefined

  if (ctaButton.fields.backgroundColor) {
    backgroundColor = Utils.getHexColorFromName(ctaButton.fields.backgroundColor)
  }

  // Redirect url is defined on the button for better flexibility,
  // but needs to be passed down to the marketo form
  modalEntry.fields.redirectUrl = ctaButton.fields.redirectUrl

  return (
    <>
      <CTAButton {...transformModalButton(ctaButton, openModal)} />
      <ModalWithPersistedState
        isOpen={modalOpen}
        onRequestClose={closeModal}
        size={modalSize}
        backgroundColor={backgroundColor}
      >
        {renderTransformedComponent(modalContentTypeId, modalEntry)}
      </ModalWithPersistedState>
    </>
  )
}

function transformModalButton({ fields }: IContentfulModalButton, onClick: () => void): ICTAButton {
  return {
    ...fields,
    text: fields.label,
    bgColor:
      (fields.buttonBackgroundColor && Utils.CTATheme[fields.buttonBackgroundColor]) ||
      Utils.CTATheme.BlackFill,
    icon: fields.icon && Utils.getTypedIcon(fields.icon),
    onClick,
  }
}
