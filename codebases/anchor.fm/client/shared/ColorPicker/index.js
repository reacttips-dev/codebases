import React from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ hex, onSelectColor }) => (
  <ChromePicker
    color={hex}
    onChangeComplete={color => {
      onSelectColor(color.hex);
    }}
    disableAlpha
  />
);

export default ColorPicker;
