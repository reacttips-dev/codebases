import React, { useContext } from 'react'
import { BUMP_UP, CurrentUILocaleContext, fontGraphik, getColorTheme } from '../../utils'
import { IProps } from './index'

export const NewSticker = (props: IProps) => {
  const contextType = useContext(CurrentUILocaleContext)

  const renderLetter = (val: string, index: number) => {
    const { theme } = props
    // Note that `themeColor` refers to the background color or context color in which
    // the NewSticker is used, NOT the color of the letter blocks.
    const themeColors = getColorTheme(theme)

    return (
      <span key={val} className="letter" aria-hidden="true">
        {val}
        <style jsx>
          {`
            .letter {
              font-family: ${fontGraphik};
              font-size: 15px;
              font-weight: 800;
              width: 24px;
              height: 24px;
              border-radius: 2px;
              color: ${themeColors.textColor};
              background-color: ${themeColors.backgroundColor};
              line-height: 24px;
              vertical-align: bottom;
              box-sizing: border-box;
              display: inline-block;
              text-align: center;
              animation: 2s wave forwards infinite;
              position: relative;
              backface-visibility: hidden;
              margin-right: 3px;
              text-transform: uppercase;
              animation-delay: ${index * 0.1}s;
            }

            @keyframes wave {
              0% {
                transform: translateY(0px);
              }
              50% {
                transform: ${BUMP_UP.TRANSFORM};
              }
              100% {
                transform: translateY(0px);
              }
            }
          `}
        </style>
      </span>
    )
  }

  const { ui } = contextType
  const newString = ui.localize('NewSticker.newText') as string
  return <>{newString.split('').map((val, index) => renderLetter(val, index))}</>
}
