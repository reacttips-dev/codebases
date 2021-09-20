import React from 'react'
import { IntercomLogo } from '../../elements/IntercomLogo'
import { IntercomWordmark } from '../../elements/IntercomWordmark'

export interface IProps {
  isClickable: boolean
  logoOnly: boolean
}

export function HeaderLogo({ isClickable, logoOnly }: IProps) {
  const renderLogo = () => (logoOnly ? <IntercomLogo /> : <IntercomWordmark />)

  return (
    <span data-testid="header-logo">
      {isClickable ? (
        <a href="/" aria-label="Intercom Home" className="logo-link">
          {renderLogo()}
        </a>
      ) : (
        renderLogo()
      )}
      <style jsx>
        {`
          .logo-link {
            @include focusable($inlineOffset: -8px, $blockOffset: -10px);

            display: block;

            &:focus {
              outline: 0;
            }
          }
        `}
      </style>
    </span>
  )
}
