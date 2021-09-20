import { Color } from 'marketing-site/src/library/utils/constants/colors'
import React from 'react'
import { fontGraphik } from '../../utils'
import { IHeaderNavigationLinkBadge } from './index'

export function HeaderNavigationLinkBadge({
  text,
  textColor = Color.Blue,
  color = Color.LightBlue,
}: IHeaderNavigationLinkBadge) {
  return (
    <>
      <span className="badge" data-testid="header-navigation-link-badge">
        {text}
      </span>
      <style jsx>{`
        .badge {
          font-family: ${fontGraphik};
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          line-height: 1.3;
          background-color: ${color};
          color: ${textColor};
          text-transform: uppercase;
          border-radius: 14px;
          padding: 3px 6px;
          align-self: center;
          margin-left: 7px;
        }
      `}</style>
    </>
  )
}
