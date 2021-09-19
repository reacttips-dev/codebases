import cn from 'classnames';

import css from 'styles/components/common/countdownTimer.scss';

const CountdownTimer = ({ releaseTime, className }) => {
  if (releaseTime) {
    return (
      <div data-scroll-target className={cn(css.countdown, className)}>
        <span className={css.srOnly}>Ends in</span>
        {releaseTime.d > 0 && <p>
          <span>
            {releaseTime.d}
          </span>
          <span>Days</span>
        </p>}
        <p>
          <span>
            {releaseTime.h}
          </span>
          <span>Hours</span>
        </p>
        <p>
          <span>
            {releaseTime.m}
          </span>
          <span>Minutes</span>
        </p>
        <p>
          <span>
            {releaseTime.s}
          </span>
          <span>Seconds</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CountdownTimer;
