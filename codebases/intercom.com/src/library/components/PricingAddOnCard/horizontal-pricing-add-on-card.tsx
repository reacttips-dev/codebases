import React from 'react'
import { AddOnPricingModal } from '../AddonPricingModal'
import { CTATheme } from '../../utils'
import { CTALink } from '../../elements/CTALink'
import { Text } from '../../elements/Text'
import { PriceForPeriod } from '../../elements/PriceForPeriod'
import { Tooltip } from '../../elements/Tooltip'
import styles from './styles.scss'
import { IPricingAddOnCardProps } from './component'

export function HorizontalPricingAddOnCard({
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
}: IPricingAddOnCardProps) {
  return (
    <>
      {addOnPricingModal && (
        <AddOnPricingModal {...addOnPricingModal} modalOpen={modalOpen} closeModal={closeModal} />
      )}
      <div className="addon-card horizontal">
        {/* Optional Banner */}
        {isComingFromSolutionsPage && (
          <div className="addon-card__banner">
            <Text size="caption+">{banner}</Text>
          </div>
        )}
        {/* Left column with Title Icon and Price */}
        <div className="addon-card__left">
          <div className="addon-card__left-headline">
            {image && <img src={image} alt="" className="addon-card__icon" />}
            <h3>
              <Text size="body+">{title}</Text>
            </h3>
          </div>
          {/* Price - priority is Pricing Modal > Pricing Tooltip > regular Price per Period */}
          {addOnPricingModal && (
            <>
              {/* wrap price in button to open pricing modal on desktop screens */}
              <div className="addon-card__show-on-desktop">
                <Text size="body">
                  {introText}{' '}
                  <span className="addon-card__price-for-period--dollar-amount">${price}</span>/
                  {periodText}
                </Text>
                <br />
                <Text size="caption">{subText}</Text>
                <br />
                <button className="addon-card__pricing-modal-button" onClick={modalClickHandler}>
                  {pricingInfoLinkText || 'How we calculate price'}
                </button>
              </div>
              {/* no pricing modal on mobile */}
              <div className="addon-card__hide-on-desktop">
                {introText}{' '}
                <span className="addon-card__price-for-period--dollar-amount">${price}</span>/
                {periodText}
              </div>
            </>
          )}
          {!addOnPricingModal && pricingTooltip && (
            <>
              {/* wrap price in tooltip to open on hover on desktop screens */}
              <div className="addon-card__show-on-desktop">
                <Text size="body">
                  {introText}{' '}
                  <span className="addon-card__price-for-period--dollar-amount">${price}</span>/
                  {periodText}
                </Text>
                <br />
                <Text size="caption">{subText}</Text>
                <br />
                <span className="addon-card__pricing-tooltip">
                  <Tooltip text={pricingTooltip}>
                    {pricingInfoLinkText || 'How we calculate price'}
                  </Tooltip>
                </span>
              </div>
              {/* no pricing tooltip on mobile */}
              <div className="addon-card__hide-on-desktop">
                {introText}{' '}
                <span className="addon-card__price-for-period--dollar-amount">${price}</span>/
                {periodText}
              </div>
            </>
          )}
          {!addOnPricingModal && !pricingTooltip && (
            <PriceForPeriod {...priceForPeriod} small={true} />
          )}
          {/* CTA button */}
          <div className="addon-card__cta left">
            <CTALink {...cta} bgColor={CTATheme.BlackOutline} />
          </div>
        </div>

        <div className="addon-card__details right">
          {/* Description */}
          <p className="addon-card__description">
            <Text size="body">{description}</Text>
          </p>

          {/* Feature List */}
          {/* eslint-disable-next-line */}
          <span className="addon-card__details-toggle" onClick={toggleDetails}>
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`addon-card__details-arrow ${
                detailsOpen ? 'addon-card__details-arrow--rotate' : ''
              }`}
            >
              <path
                d="M3.72868 6L1.23165e-07 1.6716L1.75 2.08685e-08L7 6L1.75 12L1.99336e-08 10.3284L3.72868 6Z"
                fill="#222222"
              />
            </svg>
            <Text size="body">{detailsOpen ? 'Hide details' : 'See details'}</Text>
          </span>
          <ul
            className={`addon-card__feature-list ${
              !detailsOpen ? 'addon-card__feature-list--hidden' : ''
            }`}
          >
            {featureList.items.map((feature) => {
              return (
                <li className="addon-card__feature-list-item" key={feature.text}>
                  <Tooltip text={feature.tooltip} above={true}>
                    <Text size="body">{feature.text}</Text>
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  )
}
