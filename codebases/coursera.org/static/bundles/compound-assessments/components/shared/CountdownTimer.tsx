// Shows timer countdown like ⏱ 00:10:20
// Changes color depending on time left and timeLimit to warn user.

import initBem from 'js/lib/bem';
import React from 'react';
import QuizTimerUtils from 'bundles/quiz-common/utils/QuizTimerUtils';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TimeDuration from 'bundles/phoenix/components/TimeDuration';
import { color } from '@coursera/coursera-ui';
import { SvgStopwatch } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/compound-assessments';
import { countDownTime } from 'js/lib/formatter';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';
import LocalExpiresAt from 'bundles/compound-assessments/components/local-timer/LocalExpiresAt';

import 'css!./__styles__/CountdownTimer';

const bem = initBem('CountdownTimer');

type Size = 'small' | 'medium';

type Props = {
  expiresAt?: number;
  timeLimit?: number; // Initial time limit, need to warn user about expiring timer
  displayRemaining?: boolean;
  size?: Size;
};

type State = {
  timeLeft: number;
  announceTime: boolean;
};

const SIZE = {
  small: {
    iconSize: 20,
  },
  medium: {
    iconSize: 24,
  },
};

export class CountdownTimer extends React.PureComponent<Props, State> {
  timerInterval: number | undefined;

  timeWarn: number | undefined;

  state = {
    timeLeft: 0,
    announceTime: true,
  };

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate(prevProps: Props) {
    const { expiresAt } = this.props;
    if (prevProps.expiresAt !== expiresAt) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.clearTimerInterval();
  }

  startTimer() {
    const { expiresAt, timeLimit } = this.props;
    if (typeof expiresAt === 'number' && expiresAt > Date.now()) {
      this.clearTimerInterval();
      this.timerInterval = window.setInterval(this.updateTimer, 100);
      this.timeWarn = QuizTimerUtils.calcTimeWarn(timeLimit);
      this.updateTimer();
    }
  }

  clearTimerInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  updateTimer = () => {
    const { expiresAt } = this.props;
    if (typeof expiresAt !== 'number') {
      return;
    }
    const timeLeft = Math.max(expiresAt - Date.now(), 0);
    if (timeLeft === 0) {
      this.clearTimerInterval();
    }

    this.setState({
      timeLeft,
      announceTime: countDownTime(timeLeft).endsWith('00'),
    });
  };

  render() {
    const { displayRemaining = false, expiresAt, size = 'small' } = this.props;
    const { timeWarn } = this;
    const { timeLeft, announceTime } = this.state;

    if (typeof timeLeft !== 'number' || typeof expiresAt !== 'number') {
      return null;
    }

    return (
      <div className={bem(undefined, { [size]: true })}>
        <span className={bem('stopwatch-icon')}>
          {/*
            // @ts-expect-error TSMIGRATION */}
          <SvgStopwatch size={SIZE[size].iconSize} color={timeLeft <= timeWarn ? color.error : color.success} />
        </span>
        {/*
          // @ts-expect-error TSMIGRATION */}
        <span className={bem('remaining-text', { warning: timeLeft <= timeWarn })} aria-hidden="true">
          <FormattedMessage
            message={_t('{time} {remaining, select, true {remaining} false {}}')}
            time={countDownTime(timeLeft)}
            remaining={displayRemaining}
          />
        </span>
        <span className="screenreader-only">
          {_t('Time remaining')}: <TimeDuration duration={timeLeft} showPrecise={true} showSeconds={true} />
        </span>
        <A11yScreenReaderOnly tagName="span" role="timer" aria-live="assertive" aria-atomic="true">
          {announceTime && (
            <span>
              {_t('Time remaining')}: <TimeDuration duration={timeLeft} showPrecise={true} showSeconds={true} />
            </span>
          )}
        </A11yScreenReaderOnly>
      </div>
    );
  }
}

export const CountdownTimerContainer = (
  props: {
    remainingTimeInMs?: number;
    timerId: string;
  } & Props
) => {
  const { timerId, remainingTimeInMs } = props;
  return (
    <LocalExpiresAt id={timerId} remainingTimeInMs={remainingTimeInMs}>
      {({ expiresAt }) => {
        if (typeof expiresAt !== 'number') {
          return null;
        }
        return (
          <CountdownTimer
            {...{
              ...props,
              expiresAt,
            }}
          />
        );
      }}
    </LocalExpiresAt>
  );
};

export default CountdownTimerContainer;
