import classNames from 'classnames/bind'
import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import { Text } from 'marketing-site/src/library/elements/Text'
import tornBottom3 from 'marketing-site/src/library/images/torn-bottom-3.svg'
import tornTop3 from 'marketing-site/src/library/images/torn-top-3.svg'
import { CTATheme, mq } from 'marketing-site/src/library/utils'
import React from 'react'
import { IProps } from './index'
import { Link } from 'marketing-site/src/components/bespoke/resources/link'

const linkStyles = {
  'Large Cards': 'learn__link-wrap-large-cards',
  'Small Cards': 'learn__link-wrap-small-cards',
  Embedded: 'learn__link-wrap-embedded',
}

const linksClassNames = classNames.bind(linkStyles)

export function LearnLinks(props: IProps) {
  if (!props.links || props.links.length === 0) return null

  return (
    <div className={linksClassNames('learn__link-wrap', props.appearance)}>
      <div className="learn__link">
        {props.headline && (
          <h2 className="learn__link-header">
            <Text size="xxl+">{props.headline}</Text>
            {props.viewAll && (
              <div className="learn__link-viewall">
                <CTALink
                  url={props.viewAll}
                  bgColor={CTATheme.LinkOnlyBlack}
                  text="View all"
                  arrow={true}
                />
              </div>
            )}
          </h2>
        )}
        <div className="learn__link-grid">
          {props.links.map(
            (link, index) =>
              link && (
                <div key={link.title}>
                  <Link {...link} index={index} appearance={props.appearance} />
                </div>
              ),
          )}
        </div>

        {props.ctaUrl && (
          <div className="learn__link-more-link">
            <CTALink
              bgColor={CTATheme.BlackFill}
              text="Explore more"
              url={props.ctaUrl}
              newWindow={false}
            ></CTALink>
          </div>
        )}
      </div>
      <style jsx>
        {`
          .learn__link-wrap {
            display: grid;
            grid-template-columns: ${props.asFullGrid
              ? '[content] 1fr'
              : '[left-gutter] 1fr [content] 12fr [right-gutter] 1fr'};
            padding: ${props.headline ? '80px' : 0} 0;
            background: ${props.background};
            position: relative;

            &-small-cards {
              padding: 0;
              margin: 61px 0 95px 0;
            }
          }

          .learn__link-wrap-small-cards:before,
          .learn__link-wrap-small-cards:after {
            content: '';
            position: absolute;
            background-color: ${props.background};
            height: 18px;
            left: 0;
            right: 0;
            bottom: -18px;
            mask-size: 100%;
            mask-repeat: repeat no-repeat;
            width: 100vw;
            z-index: -1;
          }

          .learn__link-wrap-small-cards:before {
            height: 11px;
            top: -11px;
            bottom: auto;
            mask-image: url(${tornTop3});
            mask-position: 50% 0%;
          }

          .learn__link-wrap-small-cards:after {
            mask-image: url(${tornBottom3});
            mask-position: 50% 100%;
            height: 15px;
            top: 100%;
          }

          .learn__link-header {
            display: flex;
            justify-content: space-between;

            @include media-query(mobile) {
              align-items: flex-end;
            }
          }

          :global(.learn__link-header a > span) {
            @include media-query(mobile) {
              font-weight: 100;
            }
          }

          .learn__link {
            display: grid;
            grid-column: content;
            max-width: $container-max-width;
            width: 100%;
            margin: 0 auto;
          }

          .learn__link-grid {
            display: grid;
            grid-template-columns: 1fr;
            grid-gap: 50px;
            margin: 50px 0;
          }

          .learn__link-more-link {
            text-align: center;
          }

          .learn__link-wrap-embedded {
            padding: 0 !important;
          }

          .learn__link-viewall {
            min-width: 90px;
            margin-top: auto;
            flex-direction: column;
            display: inline-flex;
          }

          @media (${mq.tablet}) {
            .learn__link-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (${mq.desktop}) {
            .learn__link-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}
      </style>
    </div>
  )
}
