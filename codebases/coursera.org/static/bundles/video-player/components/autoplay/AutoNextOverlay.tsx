import React from 'react';
import classNames from 'classnames';

import type { InjectedRouter } from 'js/lib/connectToRouter';
import connectToRouter from 'js/lib/connectToRouter';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

import { color } from '@coursera/coursera-ui';

import ItemIcon from 'bundles/item/components/ItemIcon';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import type { VideoPlayer } from 'bundles/item-lecture/types';

import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/video-player';

// eslint-disable-next-line
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import 'css!./__styles__/AutoNextOverlay';

type InputProps = {
  nextItem?: ItemMetadata;
  player: VideoPlayer;
  isAutoNextEnabled: boolean;
  defaultCountdown?: number;
  onCancel: () => void;
};

type Props = InputProps & {
  router: InjectedRouter;
};

type State = {
  countdownTime: number;
  showTimer: boolean;
};

class AutoNextOverlay extends React.Component<Props, State> {
  intervalId: number | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      countdownTime: props.defaultCountdown || 10,
      showTimer: false,
    };
    this.intervalId = null;
  }

  componentDidMount() {
    const { isAutoNextEnabled } = this.props;

    if (isAutoNextEnabled) {
      this.intervalId = window.setInterval(this.countdown.bind(this), 1000);
      this.setState({ showTimer: true });
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  countdown() {
    const { countdownTime } = this.state;

    if (countdownTime === 1) {
      const { nextItem } = this.props;
      this.handleNextTransition();
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      this.props.router.push(nextItem.getLink());
    } else {
      this.setState({ countdownTime: countdownTime - 1 });
    }
  }

  cancelTransition = (event?: React.MouseEvent<HTMLElement>) => {
    const { onCancel: cancelAutoPlay } = this.props;

    if (event) {
      event.stopPropagation();
    }

    this.stopTimer();

    cancelAutoPlay();
  };

  handleNextTransition = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const { nextItem, player } = this.props;

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    const type = nextItem.getContent().typeName;

    this.stopTimer();

    // stay in fullscreen mode if the next item is a video lecture
    if (player.isFullscreen() && type !== 'lecture') {
      player.exitFullscreen();
    }
  };

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  preventClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
  }

  render() {
    const { isAutoNextEnabled, nextItem } = this.props;
    const { countdownTime, showTimer } = this.state;

    if (!nextItem) {
      return null;
    }

    const name = nextItem.getName();
    const timeCommitment = nextItem.getTimeCommitment();
    const type = nextItem.getContent().typeName;

    const displayDuration = humanizeLearningTime(timeCommitment);

    return (
      // This onclick does not need to be exposed to screen readers, it exists to disable default behavior in a parent.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={classNames('rc-AutoNextOverlay', 'horizontal-box', 'align-items-absolute-center')}
        onClick={this.preventClick}
      >
        <div className="overlay-display horizontal-box">
          <div className="next-item-button vertical-box">
            <TrackedLink2
              onClick={this.handleNextTransition}
              href={nextItem.getLink()}
              trackingName="video_next_item_overlay"
            >
              <ItemIcon
                size={96}
                type={type}
                style={{
                  fill: color.white,
                }}
              />
            </TrackedLink2>
          </div>
          <div className="next-item-display vertical-box">
            <div className="item-info vertical-box">
              <span className="up-next">{_t('Up Next')}</span>
              <TrackedLink2
                href={nextItem.getLink()}
                onClick={this.handleNextTransition}
                trackingName="video_next_item_overlay"
                className="next-item-name"
                style={{
                  color: color.white,
                }}
              >
                {name}
              </TrackedLink2>
              <span className="next-item-duration">{displayDuration}</span>
              {showTimer && (
                <FormattedHTMLMessage
                  message={_t(
                    `Starts in <span class="timer">{countdownTime}</span> {countdownTime, plural, one {second} other {seconds}}`
                  )}
                  countdownTime={countdownTime}
                />
              )}
            </div>

            <div className="horizontal-box align-items-vertical-center" style={{ marginLeft: '-33' }}>
              {nextItem && (
                <TrackedLink2
                  href={nextItem.getLink()}
                  onClick={this.handleNextTransition}
                  trackingName="video_next_item_overlay"
                  className="next-item-cta-button"
                  id="start-button"
                  style={{
                    color: color.white,
                  }}
                >
                  {_t('Start')}
                </TrackedLink2>
              )}

              {nextItem && isAutoNextEnabled && (
                <TrackedLink2
                  href="#"
                  onClick={this.cancelTransition}
                  trackingName="video_next_item_overlay_cancel"
                  className="next-item-cta-button"
                  id="cancel-button"
                  style={{ marginLeft: '1rem', color: color.white }}
                >
                  {_t('Cancel')}
                </TrackedLink2>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connectToRouter<Props, InputProps>((router) => ({ router }))(AutoNextOverlay);
