import React from 'react'
import { RichText } from '../../elements/RichText'
import { Text } from '../../elements/Text'
import { Image } from '../../elements/Image'
import { Color, containerMaxWidth, SMARTQUOTE_CLOSE, SMARTQUOTE_OPEN } from '../../utils'
import { IProps } from './index'

export function TestimonialSmall({ quote, name, nameCopy, avatar }: IProps) {
  return (
    <div className="testimonial-small">
      <div className="card">
        <div className="name-avatar">
          <Image {...avatar} />
        </div>
        <div>
          <Text size="lg">
            <blockquote className="quote" data-testid="testimonial-small-quote">
              {quote}
            </blockquote>
          </Text>
          <div className="name-section">
            <div className="name-details">
              <div className="name" data-testid="testimonial-small-name">
                <Text size="caption">{name}</Text>
              </div>
              <div className="name-copy" data-testid="testimonial-small-nameCopy">
                <Text size="caption">
                  <RichText html={nameCopy} />
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .testimonial-small {
            margin: 0 auto;
            background-color: ${Color.White};
            max-width: ${containerMaxWidth};
            position: relative;
          }
          .card {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            text-align: left;
            margin: 0 auto;
          }
          .quote {
            margin: 0 auto;
            margin-bottom: 12px;
            text-indent: -6px;
            font-size: 14px;
            line-height: 18px;
          }
          .quote::before {
            content: '${SMARTQUOTE_OPEN}';
            position: relative;
            left: -2px;
          }
          .quote::after {
            content: '${SMARTQUOTE_CLOSE}';
          }

          .name {
            font-weight: bold;
          }

          .name-section {
            display: flex;
          }

          .name-avatar {
            width: 100px;
            flex-shrink: 0;
            padding-right: 24px;
          }

          .name-details {
            display: flex;
            flex-direction: column;
            justify-content: left;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  )
}
