import classnames from 'classnames'
import {
  VBP_MAY2021_EXPERIMENT_NAME,
  VBP_MAY2021_VARIATIONS,
} from 'marketing-site/lib/optimizelyExperiments'
import { useAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import { useRouter } from 'next/router'
import React from 'react'
import { Text } from '../../elements/Text'
import { Color, ColorName as themeNames, getColorTheme, containerMaxWidth, mq } from '../../utils'
import { PricingAddOnCard } from '../PricingAddOnCard'
import { IProps } from './index'

export function PricingAddOns({ title, description, addOns, bgColor = Color.White }: IProps) {
  const themeColors = getColorTheme(bgColor)

  const pricingAddonsClassnames = classnames('pricing-addons', {
    [`pricing-addons--${themeNames[bgColor]}`]: bgColor,
  })

  const assignments = useAssignedVariations()
  const isInVbp =
    VBP_MAY2021_VARIATIONS[assignments[VBP_MAY2021_EXPERIMENT_NAME]?.variationKey] === 'VBP 1.2' ||
    VBP_MAY2021_VARIATIONS[assignments[VBP_MAY2021_EXPERIMENT_NAME]?.variationKey] === 'VBP 2.0'
  const router = useRouter()
  const mostBusinessesTabActive = !router.asPath.includes('tab=1')
  const skipRendering = isInVbp && mostBusinessesTabActive

  return skipRendering ? null : (
    <div className={pricingAddonsClassnames}>
      <div className="pricing-addons__wrapper">
        <div className="pricing-addons__header">
          <div>
            <Text size="body+">{title}</Text>
          </div>
          {description && (
            <div>
              <Text size="body">{description}</Text>
            </div>
          )}
        </div>
        <div className="pricing-addons__cards">
          {addOns.map((addOn, i) => {
            return <PricingAddOnCard {...addOn} key={i} />
          })}
        </div>
      </div>

      <style jsx>{`
        .pricing-addons {
          background-color: ${themeColors.backgroundColor};
        }

        .pricing-addons__header {
          background-color: ${themeColors.backgroundColor};
          color: ${themeColors.textColor};
        }

        .pricing-addons__wrapper {
          max-width: ${containerMaxWidth};
        }

        @media (${mq.tablet}) {
          .pricing-addons__header {
            background-color: none;
          }
        }
      `}</style>

      <style jsx>{`
        .pricing-addons__wrapper {
          margin: 0 auto;
          padding-bottom: 60px;
        }

        .pricing-addons__header {
          text-align: center;
          padding: 30px 20px 24px;
        }

        .pricing-addons__cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
