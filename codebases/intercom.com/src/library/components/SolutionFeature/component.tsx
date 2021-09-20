import React from 'react'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import checkmark from '../../images/checkmark.svg'

export class SolutionFeature extends React.PureComponent<IProps> {
  render() {
    const { title, inEssential, inPro, inPremium } = this.props
    return (
      <>
        <div
          className="solution-feature-tier-container"
          data-testid="solution-feature-tier-container"
        >
          <div className="solution-feature-name">
            <Text size="body">{title}</Text>
          </div>
          <div className="solution-feature-tiers-container">
            <div className="solution-feature-tier">
              {inEssential && <span className="checkmarks-icon" />}
            </div>
            <div className="solution-feature-tier">
              {inPro && <span className="checkmarks-icon" />}
            </div>
            <div className="solution-feature-tier">
              {inPremium && <span className="checkmarks-icon" />}
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .solution-feature-name {
              flex-basis: 42%;
              padding-left: 35px;
            }
            .solution-feature-tier-container {
              height: 48px;
              display: flex;
              align-items: center;
            }
            .solution-feature-tiers-container {
              display: flex;
              flex: 1 1 0;
              justify-content: space-evenly;
            }
            .checkmarks-icon {
              background: url(${checkmark}) no-repeat;
              display: inline-block;
              height: 12px;
              width: 12px;
              margin-right: 4px;
            }
            .solution-feature-tier {
              flex-basis: 33%;
            }
          `}
        </style>
      </>
    )
  }
}
