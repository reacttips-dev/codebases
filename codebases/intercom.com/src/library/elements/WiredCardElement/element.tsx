import React from 'react'
import { getColorTheme } from '../../utils'
import { Image } from '../Image'
import { Text } from '../Text'
import { IProps } from './index'

export const WiredCardElement = ({
  title,
  description,
  companyLogo,
  companyName,
  bgColor,
}: IProps) => {
  const themeColors = getColorTheme(bgColor)
  const isPercentage = title && /^\d+(\.\d+)?%$/.test(title)
  const includesX = title && title.includes('x')

  return (
    <>
      <div className="wired-card-wrapper">
        {title && (
          <div className="wired-card-title">
            <Text size="xxl++">{title.replace('%', '').replace('x', '')}</Text>
            {isPercentage && <Text size="lg-percentage">{'%'}</Text>}
            {includesX && <Text size="lg-percentage">{'x'}</Text>}
          </div>
        )}
        <div className="wired-card-body">
          <Text size="body">{description}</Text>
        </div>
        {companyLogo && (
          <div className="wired-card-logo">
            <Image url={companyLogo} altText={companyName} />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .wired-card-wrapper {
            display: flex;
            flex-direction: column;
            width: 20.188rem;
            min-height: 14.375rem;
            height: 14.375rem;
            padding: 2.05rem 2rem;
            color: ${themeColors.textColor};
            background-color: ${themeColors.backgroundColor};
            border-radius: 25px;
            align-items: center;
            justify-content: center;
            box-shadow: ${themeColors.backgroundColor === '#FFFFFF'
              ? '0px 1px 20px rgba(0, 0, 0, 0.08)'
              : 'none'};
          }

          .wired-card-body {
            text-align: center;
          }

          .wired-card-logo {
            margin-top: 1.1rem;
          }

          .company-logo {
            max-width: 170px;
          }
        `}
      </style>
    </>
  )
}
