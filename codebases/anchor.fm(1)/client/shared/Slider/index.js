import React from 'react';
import PropType from 'prop-types';
import MaterialDesignSlider from '@material-ui/lab/Slider';
import styles from './Slider.sass';

// TODO: Replace the MaterialDesign Slider. It's too heavy and isn't the
//       easiest to customize.

const Slider = ({ onChange, minValue, maxValue, step, value, disabled }) => (
  <MaterialDesignSlider
    disabled={disabled}
    onChange={(evt, val) => {
      onChange(val);
    }}
    step={step}
    min={minValue}
    max={maxValue}
    value={value}
    classes={{
      thumb: styles.thumb,
      trackAfter: styles.trackAfter,
      trackBefore: styles.trackAfter,
      track: styles.track,
    }}
  />
);

Slider.defaultProps = {
  minValue: 1,
  maxValue: 10,
  step: 1,
  value: 5,
  onChange: () => {},
};

Slider.propTypes = {
  minValue: PropType.number,
  maxValue: PropType.number,
  step: PropType.number,
  value: PropType.number,
  onChange: PropType.func,
  disabled: PropType.bool,
};

export default Slider;
