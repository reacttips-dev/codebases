import classnames from 'classnames'
import React from 'react'
import { Color, TIMING } from '../../utils'
import { Text } from '../Text/component'
import { IProps } from './index'

export class Tooltip extends React.PureComponent<IProps> {
  render() {
    const { above, children, text, eyebrow, icon } = this.props

    if (!text) {
      return children
    }

    return (
      <button className="tooltip" type="button" aria-describedby={`tooltip-${text}`}>
        {children}
        <span
          className={above ? 'top' : 'bottom'}
          role="tooltip"
          id={`tooltip-${text}`}
          aria-label={text}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}

          <span className={classnames('content', { 'with-icon': icon })}>
            {icon && <img className="icon" src={icon} alt={text} />}
            <Text size={eyebrow ? 'lg-eyebrow' : 'caption'}>{text}</Text>
          </span>
          <span className="arrow" />
        </span>
        <style jsx>
          {`
            .tooltip {
              position: relative;
              display: inline-block; /* center on children width */
            }

            .tooltip:focus {
              outline: none;
              border-bottom: 1px dotted;
            }

            .tooltip .bottom,
            .tooltip .top {
              position: absolute;
              min-width: 240px;
              padding: 12px 24px;
              color: ${Color.Black};
              left: 50%;
              background-color: ${Color.White};
              border-radius: 4px;
              box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
              transition: all ${TIMING.FAST}ms;
              opacity: 0;
              visibility: hidden;
              backface-visibility: hidden; // Used to avoid text jitter
              z-index: 99999999;
            }

            .tooltip .bottom {
              top: 110%;
              transform: translate(-50%, 0);
            }

            .tooltip .top {
              top: -10%;
              transform: translate(-50%, -100%);
            }

            .tooltip:focus .bottom,
            .tooltip:focus .top,
            .tooltip:hover .bottom,
            .tooltip:hover .top {
              opacity: 1;
              visibility: visible;
            }

            .tooltip .bottom .arrow,
            .tooltip .top .arrow {
              position: absolute;
              left: 50%;
              margin-left: -12px;
              width: 24px;
              height: 12px;
              overflow: hidden;
            }

            .tooltip .bottom .arrow {
              bottom: 100%;
            }

            .tooltip .top .arrow {
              top: 100%;
            }

            .tooltip .bottom .arrow::after,
            .tooltip .top .arrow::after {
              content: '';
              position: absolute;
              width: 12px;
              height: 12px;
              left: 50%;
              transform: translate(-50%, 50%) rotate(45deg);
              background-color: ${Color.White};
              box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
            }

            .tooltip .bottom .arrow::after {
              transform: translate(-50%, 50%) rotate(45deg);
            }

            .tooltip .top .arrow::after {
              transform: translate(-50%, -50%) rotate(45deg);
            }

            .tooltip .eyebrow {
              color: #737376;
              text-transform: uppercase;
              font-size: 11px;
              display: block;
              margin-bottom: 12px;
            }

            .tooltip .icon {
              margin-right: 12px;
            }

            .tooltip .content {
              display: flex;
              align-items: center;
            }

            .tooltip .content.with-icon {
              white-space: nowrap;
            }
          `}
        </style>
      </button>
    )
  }
}
