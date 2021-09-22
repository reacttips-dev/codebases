import React, { useState } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../../helpers/omitType'
import Modal from '../../../components/Modal'
import Menu from '../../../components/Menu'
import CreateButton from '../../../components/CreateButton'
import Button from '../../../components/Button'
import Adjacent from '../../../components/Adjacent'
import { GlobalHeaderCTANodes, GlobalHeaderCTANode } from '../types'
import { useGlobalHeaderContext } from '../Provider'
import { CreateButtonOrder } from '../../../components/CreateButton/types'

export interface GlobalHeaderCTAProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size' | 'label'> {
  ctaNodes: GlobalHeaderCTANodes
  buttonOffset: number
  documentType?: CreateButtonOrder
}

const GlobalHeaderCTA = (props: GlobalHeaderCTANode) => {
  const { label, onClick, order, menuItems, documentType } = props
  const [isOpen, setIsOpen] = useState(false)
  const { isNavButtonSmaller, hasStickyNavBar } = useGlobalHeaderContext()

  function handleOpen() {
    onClick && onClick()
    setIsOpen(true)
  }

  function handleClose() {
    setIsOpen(false)
  }

  return (
    <div className="hds-global-header-cta-wrap">
      {order === 'primary' ? (
        <CreateButton
          size={hasStickyNavBar && isNavButtonSmaller ? '24' : '32'}
          onClick={handleOpen}
          tabIndex={0}
          order={documentType}
        >
          {label}
        </CreateButton>
      ) : (
        <Button
          size={hasStickyNavBar && isNavButtonSmaller ? '24' : '32'}
          onClick={handleOpen}
          tabIndex={0}
          order="secondary"
          as="button"
          type="button"
        >
          {label}
        </Button>
      )}
      {menuItems && menuItems.length && (
        <Modal
          className="hds-global-header-cta-modal"
          isOpen={isOpen}
          onRequestClose={handleClose}
          isUnstyled
        >
          <Menu
            items={menuItems}
            width={396}
            aria-label="Create documents menu"
          />
        </Modal>
      )}
    </div>
  )
}

const GlobalHeaderCTAs = (props: GlobalHeaderCTAProps) => {
  const { ctaNodes, buttonOffset, className, documentType, ...rest } = props
  const { isNavButtonSmaller } = useGlobalHeaderContext()

  return (
    <Adjacent
      {...rest}
      spacing="8"
      className={cx('hds-global-header-cta', className, {
        'hds-global-header-cta-is-stuck hds-global-header-cta-is-smaller': isNavButtonSmaller,
      })}
      style={{
        top: isNavButtonSmaller ? undefined : buttonOffset + 27,
      }}
    >
      {ctaNodes.map((ctaNode: GlobalHeaderCTANode, i: number) => {
        return (
          <GlobalHeaderCTA key={i} {...ctaNode} documentType={documentType} />
        )
      })}
    </Adjacent>
  )
}

export default GlobalHeaderCTAs
