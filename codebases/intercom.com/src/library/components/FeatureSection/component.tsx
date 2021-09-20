import React from 'react'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import { SolutionFeature } from '../SolutionFeature'
import * as Utils from 'marketing-site/src/library/utils'

export class FeatureSection extends React.PureComponent<IProps> {
  render() {
    const { title, solutionFeatures } = this.props
    return (
      <>
        <div className="solution-feature-section-title">
          <Text size="md+">{title}</Text>
        </div>
        <ul>
          {solutionFeatures.map((solutionFeatureProps, index) => (
            <li key={index}>
              <SolutionFeature {...solutionFeatureProps} />
            </li>
          ))}
        </ul>
        <style jsx>
          {`
            .solution-feature-section-title {
              border-top: 1px dotted ${Utils.Color.Black};
              padding-left: 35px;
              height: 48px;
              display: flex;
              align-items: center;
            }
            li:nth-child(odd) {
              background-color: ${Utils.Color.LightGray};
            }
          `}
        </style>
      </>
    )
  }
}
