import classnames from 'classnames'
import React from 'react'
import { SolutionCard } from '../../elements/SolutionCard'
import { Text } from '../../elements/Text'
import leftAccent from '../../images/accent-left.svg'
import rightAccent from '../../images/accent-right.svg'
import { containerMaxWidth, gridGap, mq } from '../../utils'
import { IProps } from './index'

const gapHMargin = '12px'
const gapVMarginMobile = '50px'
const gapVMargin = '28px'

export function SolutionCards({ headline, cardColor, solutionCards }: IProps) {
  return (
    <div className={'solution-cards'}>
      {headline?.trim() && (
        <div className="headline">
          <Text size="xxl+">{headline}</Text>
        </div>
      )}
      <ol className="content-area">
        {solutionCards.map((solutionCard, index) => {
          const wrapperClasses = classnames({
            'card-wrapper': true,
            'card-wrapper--even-cards-after-three':
              solutionCards.length % 2 === 0 && solutionCards.length > 3,
          })
          return (
            <li key={index} className={wrapperClasses}>
              <SolutionCard
                cursiveTitle={solutionCard.cursiveTitle}
                title={solutionCard.title}
                body={solutionCard.body}
                cta={solutionCard.cta}
                staticImage={solutionCard.staticImage}
                animatedImage={solutionCard.animatedImage}
                cardColor={cardColor}
              />
            </li>
          )
        })}
      </ol>
      <style jsx>
        {`
          .solution-cards {
            display: grid;
            grid-row-gap: ${gridGap.mobile};
            grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
            grid-template-rows: [top] auto [content] auto [bottom] auto;
            justify-items: center;
          }

          .headline {
            grid-row: top;
            grid-column: content;
            display: block;
            text-align: center;
            margin-bottom: 60px;

            padding-top: 6em;
            padding-left: 8em;
            padding-right: 8em;
            background-size: 20%, 9%;

            background-repeat: no-repeat;
            background-image: url(${leftAccent}), url(${rightAccent});
            background-position: 0 0, 100% 100%;
          }

          .content-area {
            grid-row: content;
            grid-column: content;
            max-width: ${containerMaxWidth};
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 0 -${gapHMargin} -${gapVMarginMobile};
            padding: 0;
          }

          .card-wrapper {
            flex: 1 1 100%;
            margin: 0 ${gapHMargin} ${gapVMarginMobile};
            justify-content: left;
            text-align: left;
          }

          @media (${mq.tablet}) {
            .content-area {
              margin: 0 -${gapHMargin} -${gapVMargin};
            }
            .card-wrapper {
              /* affects a 2-column layout with pleasantly oversized trailing item */
              display: flex;
              flex: 1 1 40%;
              max-width: 45%;
              margin: 0 ${gapHMargin} ${gapVMargin};
            }
          }

          @media (${mq.desktop}) {
            .card-wrapper {
              /* affects a 3-column layout with pleasantly oversized trailing items */
              flex: 1 1 30%;
              max-width: 40%;
            }

            .card-wrapper.card-wrapper--even-cards-after-three {
              flex-basis: 50%;
              max-width: 42.5%;
              margin: 0 12px 14px;
            }
          }

          @media (${mq.mobile}) {
            .headline {
              padding-top: 2em;
              padding-left: 3em;
              padding-right: 3em;
            }
          }
        `}
      </style>
    </div>
  )
}
