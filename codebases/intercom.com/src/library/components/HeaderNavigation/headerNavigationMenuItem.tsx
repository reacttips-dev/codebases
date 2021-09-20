import React from 'react'
import { Text } from '../../elements/Text'
import { mq } from 'marketing-site/src/library/utils'
import { HeaderNavigationLinkBadge } from './headerNavigationLinkBadge'
import { Icon } from './icon'
import { getUrlWithPageviewParam, IHeaderNavigationMenuItem } from './index'
import classnames from 'classnames'

export function HeaderNavigationMenuItem({
  title,
  subtitle,
  url,
  badge,
  icon,
}: IHeaderNavigationMenuItem) {
  return (
    <div
      className={classnames('item-container', { 'no-subtitle': !subtitle })}
      data-testid="header-navigation-menu-item"
    >
      <a href={getUrlWithPageviewParam(url)} role="menuitem">
        {icon !== undefined && (
          <div className="icon-wrapper">
            <Icon icon={icon} />
          </div>
        )}
        <div className="content">
          <div className="title">
            <div className="title-text">
              <Text size="body">{title}</Text>
            </div>
            {badge && <HeaderNavigationLinkBadge {...badge} />}
          </div>
          {subtitle && (
            <div>
              <Text size="caption">{subtitle}</Text>
            </div>
          )}
        </div>
      </a>
      <style jsx>
        {`
          .item-container {
            display: flex;
            flex: 0 1 auto;
            width: 100%;
            margin-top: 30px;

            a {
              @include focusable();
              display: flex;

              color: $black;

              &:hover {
                text-decoration: none;
                .title .title-text {
                  text-decoration: underline;
                }
              }

              &:focus {
                outline: 0;
              }
            }
          }

          .icon-wrapper {
            margin-right: 20px;
            padding-top: 4px;
          }

          .content {
            display: flex;
            flex-direction: column;
          }

          .title {
            display: flex;
            margin-bottom: 4px;
          }

          @media (${mq.desktop}) {
            .item-container {
              margin-top: 20px;
            }
          }

          @media (${mq.desktopLg}) {
            .item-container {
              margin-top: 0;
              margin-bottom: 25px;

              &.no-subtitle {
                margin-bottom: 18px;
              }
            }
          }
        `}
      </style>
    </div>
  )
}
