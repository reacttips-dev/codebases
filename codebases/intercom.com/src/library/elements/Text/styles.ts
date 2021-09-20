import css from 'styled-jsx/css'
import { fontHoney, fontGraphik, mq, fontSmileScript } from '../../utils'
import { SizeOptions } from './index'

const lineHeight = 1
const lineHeightMD = 1.2
const lineHeightLG = 1.4
const letterSpacing = 0.02

export default function getStyles(size: SizeOptions): string {
  switch (size) {
    case 'heading+':
      return css`
        span,
        div {
          font-size: 40px;
          font-weight: bold;
          font-family: ${fontHoney};
          line-height: ${lineHeight};
        }
        @media (${mq.tablet}) {
          span,
          div {
            font-size: 60px;
            font-weight: 800;
          }
        }
        @media (${mq.desktopLg}) {
          span,
          div {
            font-size: 78px;
          }
        }
      `

    case 'heading':
      return css`
        span,
        div {
          font-size: 40px;
          font-weight: bold;
          font-family: ${fontHoney};
          line-height: ${lineHeight};
        }
        @media (${mq.laptop}) {
          span,
          div {
            font-size: 60px;
            font-weight: 800;
          }
        }
        @media (${mq.desktopLg}) {
          span,
          div {
            font-size: 60px;
          }
        }
      `
    case 'xxl':
      return css`
        span,
        div {
          font-size: 28px;
          font-family: ${fontHoney};
          font-weight: bold;
          line-height: ${lineHeightMD};
        }
        @media (${mq.tablet}) {
          span,
          div {
            font-size: 36px;
            line-height: ${lineHeightMD};
          }
        }
        @media (${mq.desktopLg}) {
          span,
          div {
            font-size: 52px;
            font-weight: 800;
          }
        }
      `
    case 'xxl+':
      return css`
        span,
        div {
          font-size: 36px;
          font-family: ${fontHoney};
          font-weight: bold;
          line-height: ${lineHeight};
        }
        @media (${mq.tablet}) {
          span,
          div {
            font-size: 44px;
            line-height: 108%;
            letter-spacing: 0.25px;
          }
        }
        @media (${mq.laptop}) {
          span,
          div {
            font-size: 48px;
            font-weight: 800;
          }
        }
      `
    case 'xl+':
      return css`
        span,
        div {
          font-size: 26px;
          font-family: ${fontGraphik};
          font-weight: bold;
          line-height: ${lineHeightMD};
        }
        @media (${mq.tablet}) {
          span,
          div {
            font-size: 36px;
            font-weight: bold;
          }
        }
      `
    case 'xl':
      return css`
        span,
        div {
          font-size: 30px;
          font-family: ${fontHoney};
          font-weight: bold;
          line-height: ${lineHeightLG};
        }
        @media (${mq.laptop}) {
          span,
          div {
            font-size: 30px;
            font-family: ${fontGraphik};
            font-weight: normal;
            line-height: ${lineHeightMD};
          }
        }
        @media (${mq.desktop}) {
          span,
          div {
            font-size: 36px;
          }
        }
      `
    case 'lg+':
      return css`
        span,
        div {
          font-size: 26px;
          font-family: ${fontGraphik};
          font-weight: bold;
          line-height: ${lineHeightMD};
        }
      `
    case 'lg':
      return css`
        span,
        div {
          font-size: 16px;
          font-family: ${fontGraphik};
          line-height: ${lineHeightLG};
        }
        @media (${mq.tablet}) {
          span,
          div {
            line-height: ${lineHeightLG};
            letter-spacing: unset;
            font-size: 22px;
            font-weight: normal;
          }
        }
        @media (min-width: 1080px) {
          span,
          div {
            font-size: 26px;
          }
        }
      `
    case 'md+':
      return css`
        span,
        div {
          font-size: 15px;
          font-family: ${fontGraphik};
          font-weight: bold;
          line-height: ${lineHeightLG};
        }
      `
    case 'md':
      return css`
        span,
        div {
          font-size: 15px;
          font-family: ${fontGraphik};
          line-height: ${lineHeightMD};
        }
        @media (${mq.tablet}) {
          span,
          div {
            line-height: ${lineHeightMD};
            letter-spacing: unset;
            font-size: 18px;
          }
        }
        @media (min-width: 1080px) {
          span,
          div {
            font-size: 22px;
          }
        }
      `
    case 'caption+':
      return css`
        span,
        div {
          font-size: 13px;
          font-family: ${fontGraphik};
          font-weight: bold;
          letter-spacing: ${letterSpacing}em;
          line-height: ${lineHeightLG};
        }
      `
    case 'caption':
      return css`
        span,
        div {
          font-size: 13px;
          font-family: ${fontGraphik};
          letter-spacing: ${letterSpacing}em;
          line-height: ${lineHeightLG};
        }
      `
    case 'body+':
      return css`
        span,
        div {
          font-size: 16px;
          font-family: ${fontGraphik};
          font-weight: bold;
          letter-spacing: ${letterSpacing}em;
          line-height: ${lineHeightLG};
        }
      `
    case 'body':
      return css`
        span,
        div {
          font-size: 16px;
          font-family: ${fontGraphik};
          letter-spacing: ${letterSpacing}em;
          line-height: ${lineHeightLG};
        }
      `
    case 'lg-eyebrow':
      return css`
        span,
        div {
          font-size: 15px;
          font-family: 'Intercom Brand';
          letter-spacing: 0.6px;
          line-height: 19px;
          text-transform: uppercase;
        }
      `
    case 'xxl++':
      return css`
        span,
        div {
          font-size: 86px;
          font-family: ${fontHoney};
          font-weight: 800;
          line-height: 80px;
        }
      `
    case 'lg-percentage':
      return css`
        span,
        div {
          font-family: ${fontSmileScript};
          font-size: 56px;
          line-height: 80px;
        }
      `
    default:
      return css`
        span,
        div {
          font-size: 16px;
          font-family: ${fontGraphik};
          letter-spacing: ${letterSpacing}em;
          line-height: ${lineHeightLG};
        }
      `
  }
}
