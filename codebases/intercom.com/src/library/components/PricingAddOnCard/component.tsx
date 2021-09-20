import React, { useState, useEffect } from 'react'
import { IProps } from './index'
import { VerticalPricingAddOnCard } from './vertical-pricing-add-on-card'
import { HorizontalPricingAddOnCard } from './horizontal-pricing-add-on-card'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import { AnalyticsEvent, RouterWithQueryParams } from '../../utils'
import { useRouter } from 'next/router'

export interface IPricingAddOnCardProps extends IProps {
  closeModal: () => void
  detailsOpen: boolean
  introText?: string
  isComingFromSolutionsPage: boolean
  modalClickHandler: () => void
  modalOpen: boolean
  periodText?: string
  price: number
  subText?: string
  toggleDetails: () => void
}

export function PricingAddOnCard({
  title,
  description,
  featureList,
  priceForPeriod,
  cta,
  image,
  banner,
  addOnPricingModal,
  pricingTooltip,
  eventContext,
  pricingInfoLinkText,
  horizontal = false,
}: IProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  function toggleDetails() {
    detailsOpen ? setDetailsOpen(false) : setDetailsOpen(true)
  }

  const [modalOpen, openModal, closeModal] = useModalOpenState()

  const modalClickHandler = function () {
    new AnalyticsEvent({
      action: 'clicked',
      object: 'price_calculation',
      place: 'pricing_page',
      context: eventContext || title,
      metadata: {},
    }).send()
    openModal && openModal()
  }

  const { introText, price, periodText, subText } = priceForPeriod || {
    introText: 'from',
    price: null,
    periodText: 'mo',
    subText: null,
  }

  const [solutionsAddOnString, setSolutionsAddOnString] = useState('')

  const router = new RouterWithQueryParams(useRouter())
  const { addOns: solutionAddOn } = router.queryParams()

  const isComingFromSolutionsPage = Boolean(
    solutionsAddOnString && eventContext && eventContext.indexOf(solutionsAddOnString) > -1,
  )

  useEffect(() => {
    if (solutionAddOn) {
      setSolutionsAddOnString(solutionAddOn as string)
      isComingFromSolutionsPage &&
        document.getElementsByClassName('pricing-addons')[0].scrollIntoView(false)
    }
  }, [isComingFromSolutionsPage, solutionAddOn])

  const pricingAddOnCardProps: IPricingAddOnCardProps = {
    addOnPricingModal,
    banner,
    closeModal,
    cta,
    description,
    detailsOpen,
    featureList,
    image,
    introText,
    isComingFromSolutionsPage,
    modalClickHandler,
    modalOpen,
    periodText,
    price,
    priceForPeriod,
    pricingInfoLinkText,
    pricingTooltip,
    subText,
    title,
    toggleDetails,
  }

  const PricingAddOnCardComponent = horizontal
    ? HorizontalPricingAddOnCard
    : VerticalPricingAddOnCard
  return <PricingAddOnCardComponent {...pricingAddOnCardProps} />
}
