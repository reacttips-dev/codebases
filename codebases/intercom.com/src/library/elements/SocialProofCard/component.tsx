import newTabIcon from 'marketing-site/src/images/new-tab-icon.svg'
import starempty from 'marketing-site/src/images/star-empty.svg'
import starhalf from 'marketing-site/src/images/star-half.svg'
import star from 'marketing-site/src/images/star.svg'
import { Image } from 'marketing-site/src/library/elements/Image'
import { RichText } from 'marketing-site/src/library/elements/RichText'
import { Text } from 'marketing-site/src/library/elements/Text'
import React from 'react'
import { IProps } from './index'
import styles from './styles.scss'

// If there is a link provided in Contentful, the card is wrapped
// in an anchor tag that opens a new tab with that link.
// Otherwise, it is wrapped in a div.
function getWrapperTagAndAttrs(reviewLink?: string) {
  if (reviewLink) {
    return [
      'a',
      {
        href: reviewLink,
        target: '_blank',
        rel: 'noopener noreferrer', // this should protect us from tabnabbing
      },
    ]
  }

  return ['div', {}]
}

export const SocialProofCard = (props: IProps) => {
  const { content, avatar, name, headline, starRating, starRatingText, reviewLink } = props
  const [cardTag, cardAttrs] = getWrapperTagAndAttrs(reviewLink)
  const CardTag = cardTag as keyof JSX.IntrinsicElements

  return (
    <>
      <CardTag className="social-proof" {...cardAttrs}>
        <div className="social-proof__testimonial">
          <RichText html={content} />
        </div>

        <div className="social-proof__metadata">
          <Image classNames="social-proof__metadata__avatar" {...avatar} />
          <div className="social-proof__metadata__author">
            <Text size={'caption+'}>{name}</Text>
            <span className="social-proof__metadata__author__headline">{headline}</span>
            {starRating && (
              <span className="social-proof__metadata__star-rating">
                {renderStars(starRating)} {starRatingText}
              </span>
            )}
          </div>
          <div className="social-proof__new-tab-icon">
            <img src={newTabIcon} alt="" width="14" height="14" />
          </div>
        </div>
      </CardTag>
      <style jsx>{styles}</style>
    </>
  )
}

function renderStars(starRating: number) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <span aria-label={`${starRating}-star rating`}>
      {stars.map((i) => {
        if (starRating >= i) {
          return <img src={star} alt="" height="11" width="11" key={i} />
        } else if (starRating > i - 1) {
          return <img src={starhalf} alt="" height="11" width="11" key={i} />
        } else {
          return <img src={starempty} alt="" height="11" width="11" key={i} />
        }
      })}
    </span>
  )
}
