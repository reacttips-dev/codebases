import React from 'react'
import { Text } from '../../elements/Text'
import { IProps } from './index'
import classnames from 'classnames'
import { Tooltip } from '../../elements/Tooltip'
import { EnterpriseSolutionBanner } from '../EnterpriseSolutionBanner'
import FeatureModalStyles from '../FeaturesModal/styles.scss'
import { FeaturesModalItem } from '../FeaturesModalItem'

export function FeaturesModalGroup({
  featuresGroup,
  planGroupings,
  isLastContainer = false,
  showLegend = false,
}: IProps) {
  const numberOfColumns = planGroupings.length
  const numberOfPlansPerColumn = planGroupings[0].plans.length
  const singlePlanGroup = numberOfColumns === 1 && numberOfPlansPerColumn === 1

  return (
    <div
      key={featuresGroup.title}
      className={classnames({ 'features-table__grouping-container-last': isLastContainer })}
    >
      <div
        className={`features-table__grouping ${
          featuresGroup.mainGrouping
            ? 'features-table__main-grouping'
            : 'features-table__sub-grouping'
        }`}
      >
        {featuresGroup.icon && (
          <div className="features-table__grouping-icon-container">
            <img alt="" src={featuresGroup.icon} className="features-table__grouping-icon" />
          </div>
        )}
        <Text size="md+">{featuresGroup.title}</Text>
      </div>

      {featuresGroup.features &&
        (featuresGroup.banner ? (
          <div className="features-group__with-banner">
            <div>
              {featuresGroup.features!.map((feature) => (
                <div
                  key={feature.name}
                  className={classnames(
                    'features-table__row',
                    `features-table__row_${numberOfColumns}`,
                    {
                      'features-table__row_1--with-wide-first-column': singlePlanGroup,
                    },
                  )}
                >
                  <Tooltip text={feature.tooltipText} above={true}>
                    <div className="features-table__label-column">
                      <Text size="caption">{feature.name}</Text>
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
            <div className="features-group__with-banner">
              <EnterpriseSolutionBanner {...featuresGroup.banner} />
            </div>
          </div>
        ) : (
          featuresGroup.features.map((feature) => (
            <div
              key={feature.name}
              className={classnames(
                'features-table__row',
                `features-table__row_${numberOfColumns}`,
                {
                  'features-table__row_1--with-wide-first-column': singlePlanGroup,
                },
              )}
            >
              <Tooltip text={feature.tooltipText} above={true}>
                <div className="features-table__label-column">
                  <Text size="caption">{feature.name}</Text>
                </div>
              </Tooltip>
              <div
                className={classnames(`features-table__plan-group-columns_${numberOfColumns}`, {
                  'features-table__plan-group-columns_1--with-wide-first-column': singlePlanGroup,
                })}
              >
                {planGroupings.map((planGroup) => (
                  <div
                    key={planGroup.header}
                    className={classnames(`features-table__plan-group-columns_${numberOfColumns}`, {
                      'features-table__plan-group-columns_1--with-wide-first-column':
                        singlePlanGroup,
                    })}
                  >
                    <div
                      className={`features-table__plan-group_${numberOfColumns}_${numberOfPlansPerColumn}`}
                    >
                      {planGroup.plans.map((plan) => (
                        <div key={plan.name} className="features-table__column">
                          <FeaturesModalItem
                            feature={feature}
                            values={plan.featureValues || []}
                            showLegend={showLegend}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ))}
      <style jsx>{FeatureModalStyles}</style>
    </div>
  )
}
