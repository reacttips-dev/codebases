import React from 'react'
import { Tag } from '../Tag'
import { IProps } from './index'

export class TagGroup extends React.PureComponent<IProps> {
  render() {
    const { tagData } = this.props
    return (
      <ul className="tag-group">
        {tagData.map((tag, index) => (
          <li key={index} className="tag-wrapper">
            <Tag text={index === tagData.length - 1 ? tag.text : `${tag.text},`} url={tag.url} />
          </li>
        ))}
        <style jsx>
          {`
            .tag-group {
              display: block;
              margin: 0 -3px;
            }
            .tag-wrapper {
              display: inline-block;
              margin: 0 3px;
            }
          `}
        </style>
      </ul>
    )
  }
}
