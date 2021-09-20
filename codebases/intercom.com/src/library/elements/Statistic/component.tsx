import classnames from 'classnames'
import React from 'react'
import statisticBackground from '../../images/statistic-background.svg'
import { mq, getColorTheme } from '../../utils'
import { RichText } from '../RichText'
import { Text } from '../Text'
import { TextLink } from '../TextLink'
import { IProps } from './index'

export const Statistic = ({
  stat,
  statImage,
  backgroundColor,
  backgroundImage,
  description,
  credit,
}: IProps) => {
  const renderStatisticOrImage = () => {
    if (!statImage) {
      return (
        <>
          <Text size="xxl++">{stat}</Text>
          <Text size="lg-percentage">{'%'}</Text>
        </>
      )
    }
    return (
      <>
        <img src={statImage} alt={stat} />
        <style jsx>
          {`
            img {
              max-height: 45px;
            }
            @media (min-width: 768px) {
              img {
                max-height: 85px;
              }
            }
          `}
        </style>
      </>
    )
  }
  const themeColors = getColorTheme(backgroundColor)
  const classes = classnames({
    'has-background': backgroundImage,
    'no-background': !backgroundImage,
    statistic: true,
  })
  return (
    <div className={classes} data-testid="statistic">
      <p className="stat">{renderStatisticOrImage()}</p>
      <div className="description">
        <Text size="body">
          <RichText html={description} />
        </Text>
      </div>
      {credit && (
        <p className="credit">
          {credit.url ? (
            <TextLink url={credit.url}>
              <Text size="caption">{credit.text}</Text>
            </TextLink>
          ) : (
            <Text size="caption">{credit.text}</Text>
          )}
        </p>
      )}
      <style jsx>
        {`
          .statistic {
            position: relative;
            width: 320px;
            display: grid;
            align-content: center;
            justify-content: center;
            text-align: center;
            padding: 20px 32px;
            color: ${themeColors.textColor};
          }
          .has-background {
            background-image: url('${backgroundImage}');
            background-size: cover;
          }
          .no-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            mask-image: url('${statisticBackground}');
            mask-repeat: no-repeat;
            mask-size: cover;
            background-color: ${themeColors.backgroundColor};
          }
          .description,
          .credit {
            display: inline-block;
          }
          .stat {
            margin-bottom: 16px;
          }
          .credit {
            margin-top: 14px;
          }
          @media (${mq.desktop}) {
            .statistic {
              height: 280px;
              padding: 32px;
            }
          }
        `}
      </style>
    </div>
  )
}
