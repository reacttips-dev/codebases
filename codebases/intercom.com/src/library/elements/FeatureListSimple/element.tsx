import React from 'react'
import { IProps as IFeatureListItemProps } from '../FeatureListItem'
import { FeatureListItem } from '../FeatureListItem/element'
import { IProps } from './index'

export class FeatureListSimple extends React.PureComponent<IProps> {
  render() {
    const { disableTooltips, items } = this.props
    return (
      <ul className="feature-list">
        {items.map((itemProps: IFeatureListItemProps, index) => (
          <li key={index}>
            <FeatureListItem
              text={itemProps.text}
              richText={itemProps.richText}
              tooltip={disableTooltips ? undefined : itemProps.tooltip}
            />
          </li>
        ))}
        <style jsx>
          {`
            .feature-list {
              display: grid;
              grid-row-gap: 20px;
              padding-bottom: 16px;
            }
          `}
        </style>
      </ul>
    )
  }
}
