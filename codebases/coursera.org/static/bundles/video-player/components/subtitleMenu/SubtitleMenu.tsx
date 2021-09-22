import React from 'react';
import _ from 'underscore';
import userPreferences from 'bundles/video-player/utils/userPreferences';

import SubtitleMenuButton from 'bundles/video-player/components/subtitleMenu/SubtitleMenuButton';
import SubtitleMenuPopup from 'bundles/video-player/components/subtitleMenu/SubtitleMenuPopup';

import type { Track, Tracks } from 'bundles/video-player/types/Track';
import type { VideoPlayer } from 'bundles/item-lecture/types';

import 'css!./__styles__/SubtitleMenu';

type Props = {
  defaultSubtitleLanguage: string;
  onSubtitleMenuClick: () => void;
  menuPopupVisible: boolean;
  player: VideoPlayer;
  assignRef: (node: HTMLElement | null) => void;
};

type State = {
  currentTrack: Track | null;
  subtitleMenuHeight: number;
  tracks: Tracks;
};

class SubtitleMenu extends React.Component<Props, State> {
  state: State = {
    currentTrack: null,
    subtitleMenuHeight: 0,
    tracks: [],
  };

  throttledOnResize: () => void;

  constructor(props: $TSFixMe) {
    super(props);

    this.throttledOnResize = _.throttle(this.setSubtitlePopUpHeight, 100);
  }

  componentDidMount() {
    const { player } = this.props;

    player.on('trackchange', this.onTrackChange);
    player.on('trackloaded', this.onTrackLoad);
    window.addEventListener('resize', this.throttledOnResize);

    this.setSubtitlePopUpHeight();
  }

  componentWillUnmount() {
    const { player } = this.props;
    player.off('trackchange', this.onTrackChange);
    player.off('trackloaded', this.onTrackLoad);
    window.removeEventListener('resize', this.throttledOnResize);
  }

  onTrackChange = () => {
    this.setState({ currentTrack: this.getCurrentTrack() });
  };

  onTrackLoad = () => {
    const defaultTrack = this.getDefaultTrack();
    const currentTrack = this.getCurrentTrack();

    if (!currentTrack && defaultTrack) {
      this.setTrackAsShowing(defaultTrack);
    }

    this.setState({ currentTrack, tracks: this.getTracks() });
  };

  onSubtitleLanguageChoiceClick = (track: Track) => {
    const { player } = this.props;
    const { currentTrack } = this.state;

    if (currentTrack) {
      currentTrack.mode = 'disabled';
    }

    userPreferences.set('subtitleLanguage', track ? track.language : 'none');

    this.setTrackAsShowing(track);

    this.setState({ currentTrack: track });

    player.trigger('trackchange');
    player.trigger('subtitleschange');
  };

  onSubtitleMenuClick = () => {
    const { onSubtitleMenuClick } = this.props;

    this.setSubtitlePopUpHeight();
    onSubtitleMenuClick();
  };

  onSubtitleOffClick = () => {
    const { player } = this.props;
    const { currentTrack } = this.state;

    if (currentTrack) {
      currentTrack.mode = 'disabled';
    }

    userPreferences.set('subtitleLanguage', 'none');

    this.setState({ currentTrack: null });

    player.trigger('trackchange');
    player.trigger('subtitleschange');
  };

  getTracks = () => {
    const { player } = this.props;
    const { tracks_ } = player.textTracks();
    return tracks_
      .filter((track: $TSFixMe) => track.kind === 'captions')
      .sort((a: $TSFixMe, b: $TSFixMe) => {
        const labelA = a.label.toUpperCase();
        const labelB = b.label.toUpperCase();
        const order = labelA > labelB ? 1 : 0;
        return labelA < labelB ? -1 : order;
      });
  };

  getCurrentTrack = () => {
    const { player } = this.props;

    return player.textTracks().tracks_.find((t: $TSFixMe) => t.mode === 'showing') || null;
  };

  getDefaultTrack = () => {
    const { player } = this.props;
    const { defaultSubtitleLanguage } = this.props;

    return player.textTracks().tracks_.find((track: $TSFixMe) => track.language === defaultSubtitleLanguage) || null;
  };

  setSubtitlePopUpHeight = () => {
    const { player } = this.props;
    const playerHeight = window.getComputedStyle(player.el()).height;

    this.setState({
      subtitleMenuHeight: 0.8 * parseInt(playerHeight, 10) || 200,
    });
  };

  // this updates the modes of the text tracks belonging to the player object
  // see https://docs.videojs.com/tutorial-text-tracks.html
  // Showing Tracks Programmatically for more information
  setTrackAsShowing = (track: Track) => {
    const { player } = this.props;

    // Get all text tracks for the current player.
    const { tracks_ } = player.textTracks();

    // update the original tracks_ array
    for (let i = 0; i < tracks_.length; i += 1) {
      const t = tracks_[i];

      if (t.kind === 'captions' && t.label === track.label) {
        t.mode = 'showing';
      } else {
        t.mode = 'disabled';
      }
    }
  };

  render() {
    const { assignRef, menuPopupVisible } = this.props;
    const { currentTrack, tracks, subtitleMenuHeight } = this.state;

    if (!tracks || tracks.length === 0) {
      return null;
    }

    return (
      <div ref={assignRef} className="rc-SubtitleMenu">
        <SubtitleMenuButton menuPopupVisible={menuPopupVisible} onClick={this.onSubtitleMenuClick} />

        <SubtitleMenuPopup
          visible={menuPopupVisible}
          onSubtitleLanguageChoiceClick={this.onSubtitleLanguageChoiceClick}
          onSubtitleOffClick={this.onSubtitleOffClick}
          currentTrack={currentTrack}
          tracks={tracks}
          subtitleMenuHeight={subtitleMenuHeight}
        />
      </div>
    );
  }
}

export default SubtitleMenu;
