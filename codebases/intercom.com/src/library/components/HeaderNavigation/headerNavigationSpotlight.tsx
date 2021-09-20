import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import { Image } from 'marketing-site/src/library/elements/Image'
import { Text } from 'marketing-site/src/library/elements/Text'
import { CTATheme, mq } from 'marketing-site/src/library/utils'
import React from 'react'
import { getUrlWithPageviewParam, IHeaderNavigationSpotlight } from './index'

export function HeaderNavigationSpotlight({
  title,
  description,
  media,
  url,
  linkText,
}: IHeaderNavigationSpotlight) {
  return (
    <div
      className="spotlight"
      role="menu"
      aria-label={title}
      data-testid="header-navigation-spotlight"
    >
      <div className="title">
        <Text size="lg-eyebrow">{title}</Text>
      </div>
      <div className="content">
        <div className="media">
          <Image {...media}></Image>
        </div>
        <div className="text">
          <div className="description">
            <Text size="body">{description}</Text>
          </div>
          <div className="link">
            <CTALink
              text={linkText}
              textSize="body+"
              url={getUrlWithPageviewParam(url)}
              bgColor={CTATheme.LinkOnlyBlack}
            />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .spotlight {
            padding: 0 var(--header-navigation-compact-px, 7%);
            background-color: $light-gray;
          }

          .title {
            text-transform: uppercase;
          }

          .content {
            display: flex;
            margin-top: 20px;
          }

          .media {
            min-width: 115px;
            min-height: 115px;
          }

          .text {
            display: flex;
            flex-direction: column;
            margin-left: 34px;
          }

          .link {
            margin-top: 14px;
          }

          @media (${mq.tablet}) {
            .content {
              margin-top: 30px;
            }

            .text {
              margin-left: 20px;
            }
          }

          @media (${mq.desktop}) {
            .spotlight {
              padding: 30px;
              padding-top: var(--menu-sections-py, 0);
            }

            .content {
              display: block;
              margin-top: 15px;
            }

            .media {
              min-width: unset;
              min-height: unset;
              width: 100px;
              height: 100px;
            }

            .text {
              margin-top: 30px;
              margin-left: unset;
            }

            .link {
              margin-top: 20px;
            }
          }

          @media (${mq.desktopLg}) {
            .spotlight {
              --padding-right: calc((100vw - #{$container-max-width}) / 2);
              width: calc(400px + var(--padding-right));
              padding: var(--menu-sections-py, 0) 0 35px 34px;
              padding-right: var(--padding-right);
              margin-left: 50px;
            }

            .content {
              display: flex;
              margin-top: 25px;
            }

            .media {
              min-width: 175px;
              min-height: 175px;
            }

            .text {
              margin-top: unset;
              margin-left: 30px;
            }

            .link {
              margin-top: auto;
            }
          }

          @media (${mq.desktopXLg}) {
            .spotlight {
              background-color: $white;
            }
          }
        `}
      </style>
    </div>
  )
}
