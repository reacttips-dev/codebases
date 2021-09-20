import React from 'react'
import { EditorialStory } from '../../elements/EditorialStory'
import { Text } from '../../elements/Text'
import { containerMaxWidth, fontGraphik, mq } from '../../utils'
import { Color } from '../../utils/constants/colors'
import { IProps } from './index'
import classnames from 'classnames/bind'

const styles = {
  asFullGrid: 'editorial-story-grid-container--full-grid',
  asBiggerCard: 'editorial-story-grid-container--semi-full-grid',
}

const mixClassNames = classnames.bind(styles)
export const EditorialStoryGrid = ({
  cards,
  heading,
  sidebarHeading,
  asFullGrid,
  asBiggerCard,
}: IProps) => {
  const classNamesAdapters = { asFullGrid, asBiggerCard }
  return (
    <div className={mixClassNames('editorial-story-grid-container', classNamesAdapters)}>
      {heading && (
        <h2 className="editorial-story-grid-heading">
          <Text size={'xxl+'}>{heading}</Text>
        </h2>
      )}
      <ul className="editorial-story-grid">
        {cards.map((cardProps, index) => (
          <li key={index} className="card">
            {index === 1 && sidebarHeading && (
              <div className="more-heading" aria-hidden="true">
                {sidebarHeading}
              </div>
            )}
            <EditorialStory {...cardProps} big={index === 0} asBiggerCard={asBiggerCard} />
          </li>
        ))}
      </ul>
      <style jsx>
        {`
          .editorial-story-grid-heading {
            padding: 60px 60px 20px;
            text-align: center;
          }
          .editorial-story-grid {
            display: grid;
            grid-template-columns: 1fr [content] 12fr 1fr;
            grid-template-rows: 1fr;
            justify-items: center;
            align-items: start;
          }

          .editorial-story-grid-container--full-grid .editorial-story-grid {
            grid-template-columns: [content] 1fr;
          }

          .card {
            grid-column: content;
            padding: 20px 0;
            width: 100%;
          }
          .card:first-child {
            padding: 24px 0 22px 0;
          }
          .more-heading {
            /* custom fixed-size type treatment */
            font-size: 26px;
            font-family: ${fontGraphik};
            font-weight: bold;
            padding-bottom: 36px;
          }

          @media (${mq.tablet}) {
            .editorial-story-grid-heading {
              padding: 50px 60px;
              text-align: center;
            }
            .editorial-story-grid {
              grid-template-columns: 2fr [content] 10fr 2fr;
            }

            .editorial-story-grid-container--semi-full-grid .editorial-story-grid {
              grid-template-columns: 1fr [content] 12fr 1fr;
            }

            .editorial-story-grid-container--full-grid .editorial-story-grid {
              grid-template-columns: [content];
            }

            .card {
              padding: 36px 0;
            }
            .card:nth-child(3),
            .card:last-child {
              border-top: 1px solid ${Color.Black};
            }
          }

          @media (${mq.desktop}) {
            .editorial-story-grid-container {
              display: block;
              margin: 60px auto;
              max-width: ${containerMaxWidth};
            }

            .editorial-story-grid-container--semi-full-grid {
              max-width: 1502px;
            }

            .editorial-story-grid,
            .editorial-story-grid-container--semi-full-grid .editorial-story-grid {
              grid-template-columns: 1fr [left] 5fr 1fr [right] 6fr 1fr;
              grid-template-rows: auto 1fr; /* contract row 1; expand row 2 */
              justify-content: center;
            }

            .editorial-story-grid-container--full-grid .editorial-story-grid {
              grid-template-columns: [left] 5fr 1fr [right] 6fr;
            }

            .card:first-child {
              grid-column: left;
              grid-row: 1 / span ${cards.length - 1};
              padding-top: 0;
            }
            .card:nth-child(2) {
              padding-top: 0;
              grid-column: right;
              grid-row: 1;
            }
            .card:nth-child(3) {
              grid-column: right;
              grid-row: 2;
            }
            .card:nth-child(4) {
              grid-column: right;
              grid-row: 3;
            }
          }

          @media (${mq.desktopLg}) {
            .editorial-story-grid {
              grid-template-columns: 1fr [left] 5fr 1fr [right] 6fr 1fr;
            }

            .editorial-story-grid-container--full-grid .editorial-story-grid {
              grid-template-columns: [left] 5fr 1fr [right] 6fr;
            }
          }
        `}
      </style>
    </div>
  )
}
