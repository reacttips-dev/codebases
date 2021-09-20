import classnames from 'classnames'
import { IProps as IImage } from 'marketing-site/src/library/elements/Image'
import React from 'react'
import { ImageCard } from '../ImageCard'
import { IProps as ISocialProofCard } from '../SocialProofCard'
import { SocialProofCard } from '../SocialProofCard'
import { IProps } from './index'

function isSocialProofCard(card: ISocialProofCard | IImage): card is ISocialProofCard {
  return (card as ISocialProofCard).content !== undefined
}

export function CardRow({ cards, autoScroll, initialPosition }: IProps) {
  const cardContainerRowClasses = classnames('card-container__row', {
    'card-container__row__animate': autoScroll,
  })

  const scrollTo = initialPosition === 'left' ? '-100%' : '100%'

  return (
    <>
      <div className="card-container__row__container" data-testid="card-row">
        <div className={cardContainerRowClasses}>
          {cards.map((card, index) => (
            <div className="card-container__card" key={`card-${index}`}>
              {isSocialProofCard(card) ? <SocialProofCard {...card} /> : <ImageCard {...card} />}
            </div>
          ))}
        </div>

        {autoScroll && (
          <div className={cardContainerRowClasses}>
            {cards.map((card, index) => (
              <div className="card-container__card" key={`card-${index}`}>
                {isSocialProofCard(card) ? <SocialProofCard {...card} /> : <ImageCard {...card} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .card-container__row__container {
          width: 100%;
          display: flex;
          flex-flow: ${initialPosition === 'left' ? 'row' : 'row-reverse'} nowrap;
          overflow: ${autoScroll ? 'hidden' : 'scroll'};
          scrollbar-width: none;
        }

        .card-container__row {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: stretch;
          align-content: flex-start;
          position: relative;
          ${initialPosition}: 0;
        }

        .card-container__row__animate {
          animation-duration: ${cards.length * 15}s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-name: scrolling;
        }

        :global(.card-container__rows:hover .card-container__row__animate) {
          animation-play-state: paused;
        }

        @keyframes scrolling {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${scrollTo});
          }
        }

        .card-container__card {
          margin: 1em;
          width: 21em;
          height: 18.5em;
          flex: 0 0 auto;
          border-radius: 25px;
          background-color: $white;
          box-shadow: 0 1px 24px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </>
  )
}
