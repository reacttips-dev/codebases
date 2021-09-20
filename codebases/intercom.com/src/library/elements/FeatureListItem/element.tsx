import React from 'react'
import img from '../../images/checkmark.svg'
import * as Utils from 'marketing-site/src/library/utils'
import { Tooltip } from '../Tooltip/element'
import { IProps } from './index'
import { RichText } from '../RichText'

export class FeatureListItem extends React.PureComponent<IProps> {
  render() {
    const { richText, tooltip } = this.props
    return (
      <div className="feature-item">
        <span className="checkmark-wrapper">
          <span className="checkmark" />
        </span>
        <span className="name-wrapper">
          {tooltip ? (
            <Tooltip text={tooltip}>
              <span className="text">
                <RichText html={richText} />
              </span>
            </Tooltip>
          ) : (
            <span className="text">
              <RichText html={richText} />
            </span>
          )}
        </span>
        <style jsx>
          {`
            .feature-item {
              display: grid;
              grid-template-columns: [left] 24px [right] auto;
            }

            .checkmark-wrapper {
              grid-column: left;
            }

            .checkmark {
              display: inline-block;
              background: url(${img}) no-repeat;
              height: 12px;
              width: 12px;
            }

            .name-wrapper {
              grid-column: right;
              justify-items: start;
            }

            .text {
              display: inline-block;
              font-size: 16px;
              line-height: 1.4;
              font-family: ${Utils.fontGraphik};
              letter-spacing: 0.02em;
            }
          `}
        </style>
      </div>
    )
  }
}
