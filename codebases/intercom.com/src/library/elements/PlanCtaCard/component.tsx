import React from 'react'
import { IProps } from './index'
import { Text } from 'marketing-site/src/library/elements/Text'
import { CTALink } from '../../elements/CTALink'
import classnames from 'classnames'

export function PlanCtaCard({ plan, compact, context }: IProps) {
  const defaultPriceForPeriod = {
    introText: 'from',
    price: 0,
    periodText: 'mo',
    subText: '',
  }
  const { name, category, headerIcon, priceForPeriod = defaultPriceForPeriod, ctaProps } = plan
  const { introText, price, periodText, subText } = priceForPeriod

  return (
    <div
      key={name}
      className={classnames(`${context}__plan`, {
        [`${context}__plan--compact`]: compact,
      })}
    >
      <div
        className={classnames(`${context}__plan-wrapper-top`, {
          [`${context}__plan-wrapper-top--plan-title`]: compact,
        })}
      >
        {/* eslint-disable-next-line */}
        {headerIcon && !compact ? (
          <img className={`${context}__plan-header-icon`} src={headerIcon} alt="plan icon" />
        ) : null}
        {category && !compact ? (
          <span className={`${context}__plan-category`}>{category}</span>
        ) : null}
        <span
          className={classnames(`${context}__plan-name`, {
            [`${context}__plan-name--small`]: category,
          })}
        >
          {name}
        </span>
        {category ? null : (
          <div>
            <Text size="caption">
              {introText}&nbsp;
              <span className={`${context}__bold-text`}>${price}</span>
              {`/${periodText}`}
              <div
                className={classnames('pricing-tier-card__price-for-period-subtext', {
                  'pricing-tier-card__price-for-period-subtext--compact': compact,
                })}
              >
                <Text size="caption">{subText}</Text>
              </div>
            </Text>
          </div>
        )}
      </div>
      <div
        className={classnames(`${context}__plan-wrapper-bottom`, {
          [`${context}__plan-wrapper-bottom--only-cta-link`]: compact,
        })}
      >
        <div
          className={classnames(`${context}__cta-spacing`, {
            [`${context}__cta-spacing--reduced-width`]: compact,
          })}
        >
          {ctaProps && <CTALink {...ctaProps} arrow={false} wide />}
        </div>
      </div>
    </div>
  )
}
