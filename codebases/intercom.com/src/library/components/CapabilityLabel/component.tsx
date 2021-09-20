import classnames from 'classnames'
import React from 'react'
import { Color } from '../../utils'
import { IProps } from './index'

export function CapabilityLabel(props: IProps) {
  const { active, body, onClick } = props
  return (
    <span>
      <span
        className={classnames('label', { active })}
        data-testid="capability-label"
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex={0}
      >
        {body}
      </span>
      <style jsx>
        {`
          .label {
            color: ${Color.Blue};
            cursor: pointer;
            font-weight: bold;

            &.active {
              color: ${Color.White};
              background-color: ${Color.Blue};
              transition: color 0.3s ease, background-color 0.3s ease;
              border-radius: 10px;
            }
          }
        `}
      </style>
    </span>
  )
}
