import React from 'react'
import { IProps as IPlanColumnGroupLayout } from './index'
import { PricingTable, IProps as IPricingTable } from '../PricingTable'
import { PricingModal, IProps as IPricingModal } from '../PricingModal'

type IProps = {
  pricingModal: IPlanColumnGroupLayout['pricingModal']
  modalOpen: boolean
  closeModal: () => void
}

const PricingModalRenderer = ({ pricingModal, modalOpen, closeModal }: IProps) => {
  if ((pricingModal as IPricingTable).planGroupings) {
    return (
      <PricingTable
        {...(pricingModal as IPricingTable)}
        modalOpen={modalOpen}
        closeModal={closeModal}
      />
    )
  }
  return (
    <PricingModal
      {...(pricingModal as IPricingModal)}
      modalOpen={modalOpen}
      closeModal={closeModal}
    />
  )
}

export default PricingModalRenderer
