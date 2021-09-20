import React from 'react'
import { Text } from '../Text'
import { IProps, IOpenMessenger } from './index'
import styles from './styles.scss'

export class FooterSection extends React.PureComponent<IProps> {
  openMessenger = (e: React.MouseEvent) => {
    e.preventDefault()
    window.Intercom('showNewMessage')
  }

  render() {
    const { heading, links } = this.props
    return (
      <>
        <h2 className="footer-section__header">
          <Text size="md+">{heading}</Text>
        </h2>
        <ul className="footer-section__list">
          {links.map((link, index) => {
            return (
              <li key={index} className="footer-section__list-item">
                {!!(link as IOpenMessenger).openMessenger ? (
                  <a href={link.url} className="footer__link" onClick={this.openMessenger}>
                    <Text size="body">{link.text}</Text>
                  </a>
                ) : (
                  <a href={link.url} className="footer__link">
                    <Text size="body">{link.text}</Text>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
        <style jsx>{styles}</style>
      </>
    )
  }
}
