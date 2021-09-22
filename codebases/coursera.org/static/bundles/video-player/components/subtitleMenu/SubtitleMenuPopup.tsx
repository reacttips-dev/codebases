import React from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/videojs';

import { Track, Tracks } from 'bundles/video-player/types/Track';

import 'css!./__styles__/SubtitleMenuPopup';

type Props = {
  visible: boolean;
  subtitleMenuHeight: number;
  currentTrack: Track | null;
  tracks: Tracks;
  onSubtitleLanguageChoiceClick: (track: Track) => void;
  onSubtitleOffClick: () => void;
};

const SubtitleMenuPopup = ({
  visible,
  onSubtitleLanguageChoiceClick,
  onSubtitleOffClick,
  currentTrack,
  tracks,
  subtitleMenuHeight,
}: Props) => {
  const label = _t('Subtitles');

  return (
    <div
      className={classNames('rc-SubtitleMenuPopup', 'vertical-box', 'align-items-vertical-center', { visible })}
      style={{ maxHeight: `${subtitleMenuHeight}px` }}
    >
      <div className="subtitle-menu-title">{label}</div>
      <div className="subtitle-menu-separator" />
      <ul
        className="nostyle subtitle-language-list"
        id="subtitle-menu"
        aria-labelledby="subtitle-menu-button"
        role="menu"
      >
        <li
          className={classNames({
            active: !currentTrack,
          })}
          role="none"
        >
          <button role="menuitem" type="button" onClick={onSubtitleOffClick}>
            <em className={classNames('cif-lg', 'cif-fw', 'c-subtitles-menu-item-selected-icon')} />
            <span className="subtitle-label">{_t('Subtitles Off')}</span>
          </button>
        </li>

        {tracks.map((track) => (
          <li
            key={track.language}
            className={classNames({
              active: currentTrack && currentTrack.label === track.label,
            })}
            role="none"
          >
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                onSubtitleLanguageChoiceClick(track);
              }}
            >
              <em className={classNames('cif-lg', 'cif-fw', 'c-subtitles-menu-item-selected-icon')} />
              <span className="subtitle-label">{track.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubtitleMenuPopup;
