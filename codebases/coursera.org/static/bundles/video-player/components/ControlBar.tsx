import React from 'react';
import classNames from 'classnames';

import VideoProgressBar from 'bundles/video-player/components/progressBar/VideoProgressBar';
import PlayToggle from 'bundles/video-player/components/PlayToggle';
import VolumeMenu from 'bundles/video-player/components/volumeMenu/VolumeMenu';
import SubtitleMenu from 'bundles/video-player/components/subtitleMenu/SubtitleMenu';
import VideoTimeDisplay from 'bundles/video-player/components/VideoTimeDisplay';
import FullscreenToggle from 'bundles/video-player/components/FullscreenToggle';
import VideoSettingsMenu from 'bundles/video-player/components/settingsMenu/VideoSettingsMenu';

import 'css!./__styles__/ControlBar';

import { VideoPopup } from 'bundles/video-player/types/VideoPlayer';
import { InVideoQuestion } from 'bundles/video-quiz/types';
import { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

type Props = {
  defaultSubtitleLanguage: string;
  visible: boolean;
  visiblePopup: VideoPopup;
  setVisiblePopup: (popup: VideoPopup) => void;
  player: any;
  setChromeVisibility: (x: boolean) => void;
  videoQuizQuestions: InVideoQuestion<QuizQuestionPrompt>[] | null;
};

class ControlBar extends React.Component<Props> {
  settingsMenuRef: HTMLElement | null | undefined;

  subtitlesMenuRef: HTMLElement | null | undefined;

  volumeMenuRef: HTMLElement | null | undefined;

  componentDidMount() {
    document.addEventListener('mousedown', this.dismissAllMenusExcept());
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.dismissAllMenusExcept());
  }

  handleDocumentClick = () => {
    const { setVisiblePopup } = this.props;
    setVisiblePopup(null);
  };

  onSubtitleMenuClick = () => {
    this.toggleMenuPopup(this.subtitleMenuPopupName);
  };

  onSettingsMenuClick = () => {
    this.toggleMenuPopup(this.settingsMenuPopupName);
  };

  setVolumeMenuPopup = () => {
    this.toggleMenuPopup(this.volumeMenuPopupName);
  };

  settingsMenuPopupName = 'settings';

  subtitleMenuPopupName = 'subtitle';

  volumeMenuPopupName = 'volume';

  toggleMenuPopup = (menuName: string) => {
    const { setVisiblePopup, visiblePopup } = this.props;
    setVisiblePopup(visiblePopup === menuName ? null : (menuName as VideoPopup));
  };

  refDoesNotContainTarget = (target: HTMLElement) => (ref: HTMLElement | null | undefined) =>
    ref ? !ref.contains(target) : true;

  dismissAllMenusExcept = () => (event: MouseEvent) => {
    const { setVisiblePopup } = this.props;
    const { target } = event;

    const doesNotContainTarget = this.refDoesNotContainTarget(target as HTMLElement);
    const hidePopups =
      doesNotContainTarget(this.settingsMenuRef) &&
      doesNotContainTarget(this.subtitlesMenuRef) &&
      doesNotContainTarget(this.volumeMenuRef);

    if (hidePopups) {
      setVisiblePopup(null);
    }
  };

  assignSubtitleMenuRef = (node: HTMLElement | null) => {
    this.subtitlesMenuRef = node;
  };

  assignSettingsMenuRef = (node: HTMLElement | null) => {
    this.settingsMenuRef = node;
  };

  assignVolumeMenuRef = (node: HTMLElement | null) => {
    this.volumeMenuRef = node;
  };

  render() {
    const {
      visible,
      player,
      visiblePopup,
      defaultSubtitleLanguage,
      setChromeVisibility,
      videoQuizQuestions,
    } = this.props;

    const isSettingsMenuPopupVisible = visiblePopup === this.settingsMenuPopupName;
    const isSubtitleMenuPopupVisible = visiblePopup === this.subtitleMenuPopupName;

    return (
      // click event handler is just to stop propagating to video chrome
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={classNames('rc-ControlBar', 'horizontal-box', 'align-items-vertical-center', { visible })}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        <VideoProgressBar player={player} videoQuizQuestions={videoQuizQuestions} />
        <PlayToggle player={player} />
        <VolumeMenu player={player} setVolumeMenuPopup={this.setVolumeMenuPopup} assignRef={this.assignVolumeMenuRef} />
        <VideoTimeDisplay player={player} />
        <SubtitleMenu
          player={player}
          assignRef={this.assignSubtitleMenuRef}
          defaultSubtitleLanguage={defaultSubtitleLanguage}
          menuPopupVisible={isSubtitleMenuPopupVisible}
          onSubtitleMenuClick={this.onSubtitleMenuClick}
        />
        <VideoSettingsMenu
          player={player}
          assignRef={this.assignSettingsMenuRef}
          menuPopupVisible={isSettingsMenuPopupVisible}
          onSettingsMenuClick={this.onSettingsMenuClick}
        />
        <FullscreenToggle player={player} setChromeVisibility={setChromeVisibility} />
      </div>
    );
  }
}

export default ControlBar;
