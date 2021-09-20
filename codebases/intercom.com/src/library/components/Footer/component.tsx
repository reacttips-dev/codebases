import React from 'react'
import { FooterHeadingLink } from '../../elements/FooterHeadingLink'
import { FooterSection, IProps as IFooterSection } from '../../elements/FooterSection'
import { FooterBlogLinks } from '../../elements/FooterBlogLinks'
import { Text } from '../../elements/Text'
import { IProps, PrimaryLink } from './index'
import { VisuallyHidden } from '../../elements/VisuallyHidden'
import styles from './styles.scss'

// Type guards
function isFooterSection(data: PrimaryLink): data is IFooterSection {
  return !!(data as IFooterSection).links
}

export class Footer extends React.PureComponent<IProps> {
  render() {
    const { primaryLinks, secondaryLinks, renderExtraContent } = this.props
    return (
      <footer>
        <VisuallyHidden>
          <h1 id="sitemap">Sitemap</h1>
        </VisuallyHidden>
        <nav className="content-wrapper" aria-labelledby="sitemap">
          <ul className="primary-links">
            {primaryLinks.map((section, index) => {
              return (
                <li key={index} className="primary-links__list-item">
                  {isFooterSection(section) ? (
                    <FooterSection heading={section.heading} links={section.links} />
                  ) : (
                    <FooterHeadingLink text={section.text} url={section.url} />
                  )}
                </li>
              )
            })}
          </ul>
          <div className="blog-content">
            <FooterBlogLinks />
          </div>
          {renderExtraContent && <span className="extra-content">{renderExtraContent()}</span>}
          <ul className="secondary-links">
            {secondaryLinks &&
              secondaryLinks.map((link, index) => {
                return (
                  <li key={index} className="secondary-links__list-item">
                    <a href={link.url} className="secondary-links__link">
                      <Text size="caption">{link.text}</Text>
                    </a>
                  </li>
                )
              })}
          </ul>
        </nav>
        <style jsx>{styles}</style>
      </footer>
    )
  }
}
