import React from 'react'
import { IProps } from './index'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'
import { Text } from 'marketing-site/src/library/elements/Text'
import { RichText } from '../../elements/RichText'
import { AllColorValues, mq, useMediaQuery } from '../../utils'
import styles from './styles.scss'

const contentStyles = {
  boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.245867)',
  borderRadius: '6px',
  width: '700px',
  margin: '0 auto',
  top: '150px',
  bottom: 'unset',
}

const overlayStyles = {
  backgroundColor: 'rgba(160, 160, 160, .7)',
  zIndex: '300',
  overflow: 'auto',
}

export function AddOnPricingModal({
  modalOpen,
  closeModal,
  title,
  description,
  subDescription,
  firstColumnTitle,
  secondColumnTitle,
  tableData,
  isRightAligned,
}: IProps) {
  const isMobile = useMediaQuery(`(${mq.mobile})`)
  const isTablet = useMediaQuery(`(${mq.tablet})`)
  const isDesktop = useMediaQuery(`(${mq.desktop})`)
  contentStyles.width = isMobile ? '350px' : isTablet || isDesktop ? '700px' : contentStyles.width
  return (
    <Modal
      isOpen={modalOpen}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      size={ModalSize.Small}
      onRequestClose={closeModal}
      backgroundColor={AllColorValues.White}
      style={{
        content: contentStyles,
        overlay: overlayStyles,
      }}
    >
      <div className="addon-pricing__container">
        <div className="addon-pricing__title">
          <Text size="xl">{title}</Text>
        </div>
        {description && (
          <div className="addon-pricing__description">
            <Text size="body">
              <RichText html={description} />
            </Text>
          </div>
        )}
        <div className="addon-pricing__table">
          <div className="addon-pricing__table--header">
            <div>
              <Text size="md+">{firstColumnTitle}</Text>
            </div>
            <div style={{ textAlign: isRightAligned ? 'right' : 'inherit' }}>
              <Text size="md+">{secondColumnTitle}</Text>
            </div>
          </div>
          {tableData.map((keyValuePair, index) => (
            <div className="addon-pricing__table--row" key={index}>
              <RichText html={keyValuePair.key} />
              {keyValuePair.value && (
                <div
                  style={{
                    textAlign: isRightAligned ? 'right' : 'inherit',
                    textDecoration: keyValuePair.isStrikethrough ? 'line-through' : 'none',
                  }}
                >
                  <RichText html={keyValuePair.value} />
                </div>
              )}
            </div>
          ))}
        </div>
        {subDescription && (
          <div className="addon-pricing__description">
            <Text size="caption">
              <RichText html={subDescription} />
            </Text>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </Modal>
  )
}
