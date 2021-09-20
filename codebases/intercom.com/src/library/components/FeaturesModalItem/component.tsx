import React from 'react'
import { RichText } from '../../elements/RichText/component'
import { Text } from '../../elements/Text'
import { IProps } from './index'
import { Icon, renderIconSVG } from '../../utils'
import { Tooltip } from '../../elements/Tooltip'
import ProductIcon from 'marketing-site/src/images/product-icon.svg'
import ResolutionBotIcon from 'marketing-site/src/images/resolution-bot-icon.svg'
import ProactiveSupportIcon from 'marketing-site/src/images/proactive-support-icon.svg'
import { ADD_ON_OPTIONS } from '../FeaturesModal'

export function FeaturesModalItem({ feature, values, showLegend = false }: IProps) {
  const featureInPlan = values.find(({ featureKey }) => featureKey.name === feature.name)

  if (!featureInPlan) {
    return null
  }

  if (featureInPlan.mainText) {
    return (
      <Text size="caption">
        <RichText html={featureInPlan.mainText} />
      </Text>
    )
  }

  if (showLegend && featureInPlan.featureKey.availableInAddOn) {
    const addOnTooltipProps = {
      'Proactive Support': {
        text: 'Proactive Support',
        eyebrow: 'Available with add-on',
        icon: ProactiveSupportIcon,
      },
      'Resolution bot': {
        text: 'Resolution bot',
        eyebrow: 'Available with add-on',
        icon: ResolutionBotIcon,
      },
      'Product tours': {
        text: 'Product tours',
        eyebrow: 'Available with add-on',
        icon: ProductIcon,
      },
    }

    const tooltipProps =
      addOnTooltipProps[featureInPlan.featureKey.addOnOption || ADD_ON_OPTIONS.ProcativeSupport]

    return (
      <Tooltip {...tooltipProps} above>
        {renderIconSVG(Icon.Plus)}
      </Tooltip>
    )
  }

  if (showLegend) {
    return renderIconSVG(Icon.FeatureCheckmark)
  }

  return renderIconSVG(Icon.Checkmark)
}
