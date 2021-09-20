import React from 'react'
import { RichText } from '../../elements/RichText'
import { Text } from '../../elements/Text'
import { Image } from '../../elements/Image'
import {
  Color,
  containerMaxWidth,
  gridGap,
  mq,
  SMARTQUOTE_CLOSE,
  SMARTQUOTE_OPEN,
} from '../../utils'
import { IProps } from './index'

export class TestimonialTextOnly extends React.PureComponent<IProps> {
  render() {
    const {
      headline,
      quote,
      result,
      resultCopy,
      resultLink,
      resultLogo,
      hasQuotationMark,
      avatar,
    } = this.props
    return (
      <div className="testimonial-text-only">
        <div className="card">
          {headline && (
            <div className="headline">
              <Text size="xxl+">{headline}</Text>
            </div>
          )}
          <Text size="lg">
            <blockquote className="quote">{quote}</blockquote>
          </Text>
          {(!!avatar || !!result.trim()) && (
            <div className="result-section">
              {avatar && (
                <div className="result-avatar">
                  <Image {...avatar} />
                </div>
              )}
              <div className="result-details">
                <div className="result">
                  <Text size="caption">{result}</Text>
                </div>
                <div className="result-copy">
                  <Text size="caption">
                    <RichText html={resultCopy} />
                  </Text>
                </div>
                {resultLink && (
                  <div className="result-link">
                    <Text size="caption">
                      <RichText html={resultLink} />
                    </Text>
                  </div>
                )}
                {resultLogo && <img src={resultLogo} alt="" className="result-logo" />}
              </div>
            </div>
          )}
        </div>
        <style jsx>
          {`
            .testimonial-text-only {
              display: grid;
              grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
              grid-column-gap: ${gridGap.mobile};
              margin: 0 auto;
              background-color: ${Color.White};
              max-width: ${containerMaxWidth};
              position: relative;
            }
            .card {
              grid-column: content;
              text-align: center;
              margin: 0 auto;
            }
            .headline {
              margin-bottom: 16px;
            }
            .quote {
              margin: 0 auto;
              margin-bottom: ${result.trim() ? '24px' : 0};
              text-indent: ${hasQuotationMark ? '-6px' : 0};
            }
            .quote::before {
              content: '${hasQuotationMark ? SMARTQUOTE_OPEN : ''}';
              position: relative;
              left: -2px;
            }
            .quote::after {
              content: '${hasQuotationMark ? SMARTQUOTE_CLOSE : ''}';
            }
            .result-section {
              display: flex;
            }
            .result-avatar {
              margin-right: 1em;
              max-width: 60px;
            }
            .result-details {
              display: flex;
              flex-direction: column;
              margin: 0 auto;
            }
            .result-copy {
              margin-bottom: 16px;
            }
            .result-copy p {
              margin-top: 0 !important;
            }
            .result-logo {
              max-height: 30px;
              max-width: 150px;
              margin: 0 auto;
            }

            @media (${mq.tablet}) {
              .testimonial-text-only {
                grid-column-gap: ${gridGap.desktop};
                grid-template-columns: [left-gutter] 4fr [content] 7fr [right-gutter] 3fr;
              }
              .card {
                text-align: left;
              }
              .quote {
                text-indent: ${hasQuotationMark ? '-11px' : 0};
              }
              .headline {
                margin-bottom: 36px;
              }
              .result-details {
                justify-content: left;
                margin: unset;
              }
              .result {
                margin-bottom: 16px;
              }
              .result-logo {
                margin: unset;
              }
            }
          `}
        </style>
      </div>
    )
  }
}
