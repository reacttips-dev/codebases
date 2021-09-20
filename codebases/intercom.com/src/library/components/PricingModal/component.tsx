import React from 'react'
import { IProps } from './index'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'
import { Color, mq } from '../../utils'
import { CTATheme } from '../../utils/constants/themes'
import { Text } from 'marketing-site/src/library/elements/Text'
import { CTALink } from '../../elements/CTALink'
import { RichText } from '../../elements/RichText/component'

export const PricingModal = (props: IProps) => {
  const { headline, modalOpen, closeModal, ctaWithText, priceMetrics = [] } = props
  const overlayStyles = {
    backgroundColor: 'rgba(160, 160, 160, .7)',
    zIndex: '300',
  }
  const contentStyles = {
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
    padding: '0 50px',
    width: '90%',
    margin: 'auto',
    height: 'max-content',
    maxHeight: '625px',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <Modal
      isOpen={!!modalOpen}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      size={ModalSize.Large}
      onRequestClose={closeModal || (() => {})}
      backgroundColor={Color.White}
      style={{
        content: contentStyles,
        overlay: overlayStyles,
      }}
    >
      <div className="headline">
        <Text size="xl">{headline}</Text>
      </div>

      <div className="content">
        {priceMetrics.length > 0 &&
          priceMetrics.map((metric, index) => (
            <div className="card" key={metric.name}>
              <div className="card-heading">
                <div className="card-badge">{index + 1}</div>
                <Text size="lg+">{metric.name}</Text>
              </div>

              <div className="card-content">
                <p className="card-description">
                  <Text size="md+">{metric.description}</Text>
                </p>

                {metric.mainText && (
                  <Text size="body">
                    <RichText html={metric.mainText} />
                  </Text>
                )}
              </div>
            </div>
          ))}
      </div>

      {ctaWithText && (
        <div className="footnote">
          <Text size="body">{ctaWithText.text}</Text>
          <span>
            <CTALink {...ctaWithText.cta} bgColor={CTATheme.LinkOnlyBlack} />
          </span>
        </div>
      )}

      <style>{`
        .ReactModal__Content::before, 
        .ReactModal__Content::after {
          flex: 0 0 20px;
          content: '';
        }
        
        .headline {
          display: flex;
          width: 100%;
          justify-content: center;
          padding: 16px 0;
          text-align: center;
        }

        .content {
          display: flex;
          gap: 16px;
          padding: 32px 0 28px;
          flex-direction: column;
        }

        .card {
          padding: 24px;
          border-radius: 6px;
          border: 2px solid ${Color.LightGray};
          flex: 1 1 0;
        }

        .card-heading {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 16px;
        }

        .card-badge {
          font-weight: bold;
          width: 32px;
          height: 32px;
          background: ${Color.Teal};
          border-radius: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Graphik;
          font-size: 16px;
        }

        .card-description {
          margin-bottom: 10px;
        }

        .card-description span {
          font-size: 20px;
        }

        .footnote {
          padding: 24px 0;
          display: flex;
          flex-wrap: wrap;
          text-align: center;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
        }

        @media (${mq.laptop}) {
          .content {
            flex-direction: row;
          }
        }


        @media (${mq.desktopXLg}) {
          .content {
            width: 80%;
            margin: 0 auto;
          }
        }

      `}</style>
    </Modal>
  )
}
