import React from 'react'
import styled, { css } from 'styled-components'
import thumbUrl from './thumb.svg'

const track = css`
  border-radius: 0px;
  box-shadow: none;
  border-radius: ${({ height }) => height / 2}px;
  cursor: pointer;
`

const thumb = css`
  cursor: pointer;
  border: 0;
  background: none;
  background-image: url('/modules/${thumbUrl}');
  background-size: 30px 39px;
  background-repeat: no-repeat;
  height: 40px;
  width: 30px;
`

const Input = styled.input`
  -webkit-appearance: none;
  position: relative;
  width: 100%;
  z-index: 1;

  &:focus {
    outline: none;
  }

  &::-moz-range-track {
    ${track}
    background: ${({ background }) => background};
    height: ${({ height }) => height}px;
    width: 100%;
  }

  &::-webkit-slider-runnable-track {
    ${track}
    background: ${({ background }) => background};
    height: ${({ height }) => height}px;
    width: 100%;
  }

  &::-ms-fill-upper {
    ${track}
    background: ${({ background }) => background};
  }

  &::-ms-fill-lower {
    ${track}
    background: ${({ background }) => background};
  }

  &::-moz-range-thumb {
    ${thumb}
  }

  &::-webkit-slider-thumb {
    ${thumb}
    -webkit-appearance: none;
    margin-top: -20px;
  }

  &::-ms-thumb {
    ${thumb}
  }

  &::-ms-track {
    background: transparent;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
    height: ${({ height }) => height}px;
    width: 100%;
  }
`
Input.defaultProps = {
  background:
    'linear-gradient(90deg, #E64C3B -0.01%, #FFCA32 51.17%, #D9F2E6 99.25%)',
  height: 6
}

const Slider = ({ onChange, ...props }) => (
  <Input
    {...props}
    type="range"
    onChange={event => onChange && onChange(event.target.value)}
  />
)

Slider.defaultProps = {
  min: 0,
  max: 100
}

export default Slider
