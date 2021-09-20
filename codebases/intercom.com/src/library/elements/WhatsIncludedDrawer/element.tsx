import React from 'react'
import { TIMING, mq, getColorTheme, Color } from '../../utils'
import { Chevron } from '../Chevron'
import { RichText } from '../RichText'
import { Text } from '../Text'
import { IProps } from './index'

export const WhatsIncludedDrawer = (props: IProps) => {
  const { icon, lightIcon, title, description, tagline, theme, isOpen, bgColor } = props
  const containerStyle = {
    height: isOpen ? 'auto' : 0,
  }
  const openTheme = getColorTheme(theme)
  const defaultTheme = getColorTheme(bgColor || Color.White)

  const focusTheme = openTheme

  const getCorrectIcon = (isFocus = false) => {
    if (!lightIcon) {
      return icon
    }
    const backgroundTheme = isOpen ? openTheme : isFocus ? focusTheme : defaultTheme
    if (backgroundTheme.textColor === Color.White) {
      return lightIcon
    }
    return icon
  }

  return (
    <div className="drawer">
      {/* Drawer Icon, Title, and Chevron */}
      <div className="drawer-lead">
        {/* Icon */}
        <img src={getCorrectIcon()} alt="" className="icon icon--default" />
        <img src={getCorrectIcon(true)} alt="" className="icon icon--focus" />
        {/* Title */}
        <span className="title headline-truncated">
          <Text size="md+">
            <span className="title__text">{title}</span>
          </Text>
        </span>
        {/* Chevron */}
        <span className={`chevron${isOpen ? ' -active' : ''}`}>
          <Chevron />
        </span>
      </div>

      {/* Tagline */}
      {tagline && (
        <p className="tagline">
          <Text size="body">{tagline}</Text>
        </p>
      )}

      {/* Drawer Content */}
      <div className="drawer-content" style={containerStyle} role="region">
        <div className="drawer-body-text">
          <Text size="body">
            <RichText html={description} />
          </Text>
        </div>
      </div>

      <style jsx>
        {`
          .drawer {
            padding: ${isOpen ? '24px' : '8px 24px'};
            display: inline-block;
            width: 100%;
            background-color: ${isOpen ? openTheme.backgroundColor : 'transparent'};
            color: ${isOpen ? openTheme.textColor : defaultTheme.textColor};
            border-radius: 6px;
            transition: padding ${TIMING.FAST}ms, background-color ${TIMING.STANDARD}ms;
            cursor: pointer;
          }

          .drawer:hover,
          .drawer:focus {
            background-color: ${isOpen ? openTheme.backgroundColor : focusTheme.backgroundColor};
            color: ${isOpen ? openTheme.textColor : focusTheme.textColor};
            outline: none;

            .icon {
              &--focus {
                display: initial;
              }

              &--default {
                display: none;
              }
            }

            .title__text {
              border-bottom: ${`1px solid ${focusTheme.textColor}`};
            }
          }

          .drawer-lead {
            text-decoration: none;
            display: inline-block;
            margin-bottom: 4px;
            cursor: pointer;
          }

          .icon {
            width: 32px;
            margin-right: 16px;
            vertical-align: middle;

            &--focus {
              display: none;
            }
          }

          .title {
            padding: 0;
            word-break: break-word;
            vertical-align: middle;
            .title__text {
              border-bottom: ${isOpen ? 'none' : `1px solid ${defaultTheme.textColor}`};
            }
          }

          .chevron {
            display: inline-block;
            margin: 0 0 1px 6px;
            transition: transform ${TIMING.FAST}ms;
          }

          .chevron.-active {
            transform: rotate(-180deg);
          }

          .tagline {
            margin: 2px 0 2px 48px;
            word-break: break-word;
          }

          .drawer-content {
            overflow: hidden;
            height: 0;
            transition: height ${TIMING.FAST}ms;
            margin-left: 48px;
          }

          .drawer-body-text {
            padding: 6px 0;
            word-break: break-word;
          }

          @media (${mq.largePhone}) {
            .headline-truncated {
              display: inline-block;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              width: 11.25rem;
            }
          }

          @media (${mq.tablet}) {
            .chevron {
              margin: 0 0 1px 16px;
            }
          }

          :global(.drawer .rich-text a) {
            border-bottom: 1px solid;
          }

          :global(.drawer .rich-text a:hover) {
            text-decoration: none;
          }
        `}
      </style>
    </div>
  )
}

WhatsIncludedDrawer.defaultProps = {
  isOpen: false,
}
