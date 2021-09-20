import React from 'react'
import { Color } from '../../utils'
import { IProps } from './index'
import { VisuallyHidden } from '../../elements/VisuallyHidden'

export function Select({ placeholder, options, id, onChange }: IProps) {
  const selectedOption = options.find((option) => option.isSelected)

  return (
    <div className="select">
      <VisuallyHidden>
        <label className="select-label" htmlFor={id}>
          {placeholder}
        </label>
      </VisuallyHidden>
      <div className="placeholder" aria-hidden="true">
        {selectedOption ? selectedOption.name : placeholder}
      </div>
      {/* eslint-disable-next-line */}
      <select className="native-select" onChange={onChange} id={id}>
        {placeholder && (
          <option disabled selected value="">
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value} selected={option.isSelected}>
            {option.name}
          </option>
        ))}
      </select>
      <style jsx>
        {`
          .select {
            position: relative;
          }

          .select:focus-within {
            box-shadow: 0 0 8px ${Color.Teal};
          }

          .native-select {
            position: absolute;
            appearance: none;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
            opacity: 0;
          }

          .placeholder {
            background: ${Color.White};
            border: 2px solid ${Color.Black};
            border-radius: 6px;
            padding: 17px 81px 17px 24px;
          }

          .placeholder:before,
          .placeholder:after {
            content: '';
            position: absolute;
            right: 20px;
            width: 0;
            height: 0;
            border-style: solid;
            top: 50%;
          }

          .placeholder:before {
            border-width: 0 6px 6px 6px;
            border-color: transparent transparent #000000 transparent;
            margin-top: -8px;
          }

          .placeholder:after {
            border-width: 6px 6px 0 6px;
            border-color: #000000 transparent transparent transparent;
            margin-top: 4px;
          }
        `}
      </style>
    </div>
  )
}
