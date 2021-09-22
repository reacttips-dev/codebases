/** @jsx jsx */
// Shows timer countdown like ⏱ 00:10:20
// Changes color depending on time left and timeLimit to warn user.

import React from 'react';
import { css, jsx } from '@emotion/react';
import QuizTimerUtils from 'bundles/quiz-common/utils/QuizTimerUtils';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TimeDuration from 'bundles/phoenix/components/TimeDuration';
import { Theme, Typography } from '@coursera/cds-core';
import { StopwatchIcon } from '@coursera/cds-icons';
import _t from 'i18n!nls/compound-assessments';
import { countDownTime } from 'js/lib/formatter';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';
import LocalExpiresAt from 'bundles/compound-assessments/components/local-timer/LocalExpiresAt';

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

const styles = {
  containerStyle: css({
    display: 'flex',
    alignItems: 'center',
  }),
};

export class CountdownTimer extends React.PureComponent<Props, State> {
  timerInterval: number | undefined;

  timeWarn = 0;

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
      <div css={styles.containerStyle}>
        <div
          css={css({
            display: 'flex',
          })}
        >
          <StopwatchIcon size={size} color={timeLeft <= timeWarn ? 'error' : 'success'} />
        </div>

        <div
          aria-hidden="true"
          css={(theme: Theme) =>
            css({
              marginLeft: theme.spacing(4),
            })
          }
        >
          <Typography variant="body2" component="span" color={timeLeft <= timeWarn ? 'error' : 'success'}>
            <FormattedMessage
              message={_t('{time} {remaining, select, true {remaining} false {}}')}
              time={countDownTime(timeLeft)}
              remaining={displayRemaining}
            />
          </Typography>
        </div>
        <div className="screenreader-only">
          {_t('Time remaining')}: <TimeDuration duration={timeLeft} showPrecise={true} showSeconds={true} />
        </div>
        <A11yScreenReaderOnly tagName="span" role="timer" aria-live="assertive" aria-atomic="true">
          {announceTime && (
            <div>
              {_t('Time remaining')}: <TimeDuration duration={timeLeft} showPrecise={true} showSeconds={true} />
            </div>
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
