import React from 'react'
import { Text } from '../../elements/Text'
import { mq } from '../../utils'
import { HeaderNavigationMenuItem } from './headerNavigationMenuItem'
import { IHeaderNavigationMenuItem, IHeaderNavigationMenuSection } from './index'
import classNames from 'classnames'

function renderItemColumn(items: IHeaderNavigationMenuItem[], title: string) {
  return (
    <div
      className={classNames('items-container', title.toLowerCase())}
      data-testid="header-navigation-menu-section"
    >
      {items.map((item) => (
        <HeaderNavigationMenuItem key={item.title} {...item} />
      ))}
      <style jsx>{`
        .industries {
          &.items-container {
            display: grid;
            grid-template-columns: 40% 60%;
          }

          @media (${mq.largePhone}) {
            &.items-container {
              display: block;
            }
          }

          @media (${mq.desktop}) {
            &.items-container {
              display: block;
            }
          }
        }
      `}</style>
    </div>
  )
}

export function HeaderNavigationMenuSection({
  title,
  items,
  itemsSecondColumn,
}: IHeaderNavigationMenuSection) {
  return (
    <div className="section" role="menu" aria-label={title}>
      <div className="title">
        <Text size="lg-eyebrow">{title}</Text>
      </div>
      <div className="items">
        {renderItemColumn(items, title)}
        {itemsSecondColumn && (
          <>
            <div className="column-divider"></div>
            {renderItemColumn(itemsSecondColumn, title)}
          </>
        )}
      </div>
      <style jsx>{`
        .section {
          padding: 0 var(--header-navigation-compact-px, 7%);
        }

        .title {
          text-transform: uppercase;
        }

        @media (${mq.desktop}) {
          .section {
            padding: var(--menu-sections-py, 0) 0;
            min-width: 141px;
          }
        }

        @media (${mq.desktopLg}) {
          .section {
            padding: var(--menu-sections-py, 0) 0 0;
          }

          .title {
            margin-bottom: 20px;
          }

          .items {
            display: flex;
            max-width: 640px;
          }

          .column-divider {
            width: 60px;
          }
        }
      `}</style>
    </div>
  )
}
