import React from 'react';
import classNames from 'classnames';

import IVQMarker from 'bundles/video-player/components/progressBar/IVQMarker';
import ProgressBarTimeBadge from 'bundles/video-player/components/progressBar/ProgressBarTimeBadge';

import { duration as formatDuration } from 'js/utils/DateTimeUtils';

import type { InVideoQuestion } from 'bundles/video-quiz/types';

import 'css!./__styles__/VideoProgressBar';

import _t from 'i18n!nls/video-player';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

type Props = {
  player: any;
  videoQuizQuestions: InVideoQuestion<QuizQuestionPrompt>[] | null;
};

type ActionStateName = 'none' | 'hovering' | 'scrubbing';

type ActionStateOptions = {
  hoverFractionOffsetFromStart?: number | null;
  scrubbingFractionOffsetFromStart?: number | null;
  wasVideoPausedWhenScrubbingStarted?: boolean | null;
};

type NoState = {
  actionStateType: 'none';
};

type HoveringState = {
  actionStateType: 'hovering';
  hoverFractionOffsetFromStart?: number;
};

type ScrubbingState = {
  actionStateType: 'scrubbing';
  scrubbingFractionOffsetFromStart?: number;
  wasVideoPausedWhenScrubbingStarted?: boolean;
};

type ActionState = NoState | HoveringState | ScrubbingState;

type State = {
  currentTime: number | null;
  duration: number | null;
  actionState: ActionState;
};

class VideoProgressBar extends React.Component<Props, State> {
  baseElement: HTMLElement | null | undefined;

  state: State = {
    actionState: {
      actionStateType: 'none',
    },
    currentTime: null,
    duration: null,
  };

  componentDidMount() {
    const { player } = this.props;

    this.setState({
      currentTime: player.currentTime(),
      duration: player.duration(),
    });

    player.on('timeupdate', this.onTimeChange);
    player.on('durationchange', this.onDurationChange);

    document.addEventListener('mouseup', this.onDocumentMouseUp);
  }

  componentWillUnmount() {
    const { player } = this.props;

    player.off('timeupdate', this.onTimeChange);
    player.off('durationchange', this.onDurationChange);

    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // slightly annoying exception to map approach below
    // stops page scroll from happening by default on space
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      return;
    }

    const keyHandlerMap = {
      // skip forward a little
      Up: () => {
        this.skip(5);
      },
      ArrowUp: () => {
        this.skip(5);
      },
      Right: () => {
        this.skip(5);
      },
      ArrowRight: () => {
        this.skip(5);
      },
      // skip backward a little
      Down: () => {
        this.skip(-5);
      },
      ArrowDown: () => {
        this.skip(-5);
      },
      Left: () => {
        this.skip(-5);
      },
      ArrowLeft: () => {
        this.skip(-5);
      },
    };
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (keyHandlerMap[event.key]) {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      keyHandlerMap[event.key]();
    }
  };

  onTimeChange = () => {
    const { player } = this.props;
    this.setState({
      currentTime: player.currentTime(),
    });
  };

  onDurationChange = () => {
    const { player } = this.props;
    this.setState({
      duration: player.duration(),
    });
  };

  // needed to prevent focus outline on click
  // NOTE: lint rule is trying to force the handler to be above the instance field "baseElement", not nice
  // eslint-disable-next-line react/sort-comp
  onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    this.beginScrubbing(event);
  };

  onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const {
      actionState: { actionStateType, ...remainingData },
    }: any = this.state;

    let type = actionStateType;

    const offset = this.getProgressBarFractionOffsetFromEvent(event);
    const additionalData: ActionStateOptions = remainingData;

    if (type === 'scrubbing') {
      additionalData.scrubbingFractionOffsetFromStart = offset;
    } else {
      type = 'hovering';
      additionalData.hoverFractionOffsetFromStart = offset;
    }

    this.setActionState(type, additionalData);
  };

  onMouseLeave = () => {
    const { duration, actionState } = this.state;

    if (actionState.actionStateType === 'scrubbing') {
      const { player } = this.props;
      const { scrubbingFractionOffsetFromStart } = actionState;
      if (duration && scrubbingFractionOffsetFromStart) {
        const currentTime = duration * scrubbingFractionOffsetFromStart;
        player.currentTime(currentTime);

        this.setState({
          currentTime,
        });
      }
    } else {
      this.setActionState('none');
    }
  };

  onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const {
      actionState: { actionStateType, ...remainingData },
    } = this.state;

    const offset = this.getProgressBarFractionOffsetFromEvent(event);

    if (actionStateType === 'hovering') {
      this.setActionState(actionStateType, { ...remainingData, hoverFractionOffsetFromStart: offset });
    } else if (actionStateType === 'scrubbing') {
      this.setActionState(actionStateType, { ...remainingData, scrubbingFractionOffsetFromStart: offset });
    }
  };

  onDocumentMouseUp = () => {
    const {
      actionState: { actionStateType },
    } = this.state;
    if (actionStateType === 'scrubbing') {
      this.endScrubbing();
    }
  };

  onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const { player } = this.props;
    const { duration } = this.state;

    let { currentTime } = this.state;

    // this operation will not be valid if player and duration are not initialized
    if (!!player && duration !== null && duration !== undefined) {
      const barFractionOffset = this.getProgressBarFractionOffsetFromEvent(event);

      if (barFractionOffset !== null && barFractionOffset !== undefined) {
        currentTime = barFractionOffset * duration;
      }
    }

    player.currentTime(currentTime);

    this.endScrubbing();
    this.setState({
      currentTime,
    });
  };

  getProgressBarFractionOffsetFromEvent = (event: React.MouseEvent<HTMLDivElement>): number | null => {
    // need base element to exist for this to be valid
    // should not be non-fatal even if null returned...
    if (this.baseElement) {
      const barCoordinates = this.baseElement.getBoundingClientRect();
      const barX = barCoordinates.left;
      const barWidth = barCoordinates.width;
      const eventX = event.clientX;
      const barFractionOffset = (eventX - barX) / barWidth;
      return barFractionOffset;
    }

    return null;
  };

  setActionState(name: ActionStateName, additionalData: ActionStateOptions = {}) {
    const { actionState: currentActionState } = this.state;

    const actionState: any = {
      ...currentActionState,
      ...additionalData,
      actionStateType: name,
    };

    this.setState({ actionState });
  }

  // TODO: should be a part of player state management
  skip = (timeToSkip: number) => {
    const { player } = this.props;
    const { currentTime, duration } = this.state;
    // make sure we have initialized state for this operation
    if (currentTime !== null && currentTime !== undefined && duration !== null && duration !== undefined) {
      const newTime = Math.max(0, Math.min(currentTime + timeToSkip, duration));
      player.currentTime(newTime);
    }
  };

  beginScrubbing = (event: React.MouseEvent<HTMLDivElement>) => {
    const { player } = this.props;

    this.setActionState('scrubbing', {
      scrubbingFractionOffsetFromStart: this.getProgressBarFractionOffsetFromEvent(event),
      wasVideoPausedWhenScrubbingStarted: player.paused(),
    });

    player.pause();
  };

  endScrubbing = () => {
    const { player } = this.props;
    const { actionState }: any = this.state;
    const { wasVideoPausedWhenScrubbingStarted, scrubbingFractionOffsetFromStart }: ScrubbingState = actionState;

    player.trigger('scrubbed');

    if (!wasVideoPausedWhenScrubbingStarted && !player.ended()) {
      player.play();
    }

    this.setActionState('hovering', {
      hoverFractionOffsetFromStart: scrubbingFractionOffsetFromStart,
    });
  };

  fractionToWholeNumber(fraction: number) {
    return fraction * 100;
  }

  formatFraction(fraction: number) {
    return `${(Math.floor(fraction * 10000) / 100).toFixed(2)}%`;
  }

  assignRef = (el: HTMLDivElement | null) => {
    this.baseElement = el;
  };

  render() {
    const { videoQuizQuestions } = this.props;
    const {
      actionState: { actionStateType, ...actionStateOptions },
      duration,
      currentTime,
    } = this.state;

    // don't render if state hasn't initialized properly
    if (duration === null || duration === undefined || currentTime === null || currentTime === undefined) {
      return null;
    }

    const { hoverFractionOffsetFromStart, scrubbingFractionOffsetFromStart }: any = actionStateOptions;

    const progressFractionOffset = currentTime / duration;
    const progressPercentOffset = this.formatFraction(progressFractionOffset);
    const questions = videoQuizQuestions;

    let scrubbingOffset = progressPercentOffset;
    let ariaValueNow = this.fractionToWholeNumber(progressFractionOffset);

    const timeBadgeOffset =
      actionStateType === 'hovering' ? hoverFractionOffsetFromStart : scrubbingFractionOffsetFromStart;

    if (actionStateType === 'scrubbing') {
      if (scrubbingFractionOffsetFromStart !== null && scrubbingFractionOffsetFromStart !== undefined) {
        scrubbingOffset = this.formatFraction(scrubbingFractionOffsetFromStart);
        ariaValueNow = this.fractionToWholeNumber(scrubbingFractionOffsetFromStart);
      }
    }
    const hovering = actionStateType === 'hovering' || actionStateType === 'scrubbing';
    const ariaValueText = formatDuration(progressFractionOffset * duration * 1000, 'mmm:sss');

    return (
      <div
        tabIndex={0}
        role="progressbar"
        aria-label={_t('Video Progress')}
        aria-valuemin={0}
        aria-valuemax={100}
        dir="ltr" // the video progress slider should always be left to right, even in 'rtl' experience
        aria-valuenow={ariaValueNow}
        aria-valuetext={ariaValueText}
        className={classNames('rc-VideoProgressBar', 'horizontal-box', 'align-items-absolute-center')}
        ref={this.assignRef}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        <div className={classNames('base-track', { hovering })}>
          {questions &&
            questions.map((question) => (
              <IVQMarker key={`ivq-${question.id}`} question={question} videoDuration={duration} />
            ))}
          <div className={classNames('progress-track', { hovering })} style={{ width: scrubbingOffset }} />
        </div>
        <div className={classNames('hitbox', { hovering })} />
        <div className={classNames('progress-handle', { hovering })} style={{ left: scrubbingOffset }} />
        {hovering && timeBadgeOffset && (
          <ProgressBarTimeBadge time={timeBadgeOffset * duration} videoDuration={duration} />
        )}
      </div>
    );
  }
}

export default VideoProgressBar;
