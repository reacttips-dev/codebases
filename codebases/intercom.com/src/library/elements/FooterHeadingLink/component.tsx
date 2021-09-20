import React from 'react'
import { Text } from '../Text'
import { IProps } from './index'

export class FooterHeadingLink extends React.PureComponent<IProps> {
  render() {
    const { text, url } = this.props
    return (
      <>
        <a href={url} className="footer__link">
          <h2>
            <Text size="md+">{text}</Text>
          </h2>
        </a>
      </>
    )
  }
}
