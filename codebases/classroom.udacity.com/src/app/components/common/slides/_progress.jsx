import PropTypes from 'prop-types';
import React from 'react';
import { SlidesConsumer } from './_context';
import styles from './_progress.scss';

function percentProgress(index, count) {
  return (count === 0 ? 0 : (index + 1) / count) * 100;
}

const ProgressBar = cssModule(({ value = 0 }) => {
  // copied from https://github.com/udacity/ureact-components/blob/master/src/progress-bar/index.jsx because it doesn't allow for customization
  return (
    <div styleName="progress">
      <p
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: value + '%' }}
      >
        {value}% complete
      </p>
    </div>
  );
}, styles);

ProgressBar.displayName = 'onboarding/slides/_progress/progress-bar';
ProgressBar.propTypes = {
  value: PropTypes.number,
};

const Progress = () => {
  return (
    <SlidesConsumer>
      {({ slideIndex, slideCount }) => (
        <ProgressBar value={percentProgress(slideIndex, slideCount)} />
      )}
    </SlidesConsumer>
  );
};

Progress.displayName = 'onboarding/slides/_progress';
Progress.propTypes = {};

export default Progress;
