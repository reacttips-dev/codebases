import React from 'react'
import { Text } from '../Text'
import { TextLink } from '../TextLink'
import { IProps } from './index'

export class Tag extends React.PureComponent<IProps> {
  render() {
    const { text, url } = this.props
    return (
      <TextLink url={url} newWindow={false}>
        <Text size="caption">{text}</Text>
      </TextLink>
    )
  }
}
