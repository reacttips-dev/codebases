import React from 'react';

import StorageUtils from 'bundles/interactive-transcript/utils/StorageUtils';

import type Track from 'bundles/interactive-transcript/models/Track';
import type TrackList from 'bundles/interactive-transcript/models/TrackList';
import Retracked from 'js/lib/retracked';

import _t from 'i18n!nls/interactive-transcript';

import { TrackingNamespace } from '../../utils/eventing';
import 'css!./__styles__/TrackChooser';

type Props = {
  tracks: TrackList;
  selectedTrack: Track;
  onTrackSelect: (track: Track) => void;
  courseId?: string;
  itemId?: string;
};

class TrackChooser extends React.Component<Props> {
  selectNode: HTMLSelectElement | null | undefined;

  handleSelect = (e: React.FormEvent<HTMLSelectElement>) => {
    const languageCode = (e.target as HTMLSelectElement).value;
    const { courseId, itemId, selectedTrack } = this.props;
    const previousLanguage = selectedTrack.languageCode;
    const initialTrackingData = {
      itemId,
      courseId,
      previousLanguage,
    };

    // the first select option is not a language so we set the new language tracked to undefined
    if (languageCode === '-1') {
      const deselectedTrackingData = {
        ...initialTrackingData,
        newLanguage: undefined,
      };

      Retracked.trackComponent(TrackingNamespace, deselectedTrackingData, 'track_chooser', 'deselected');
    } else {
      const selectedTrackingData = {
        ...initialTrackingData,
        newLanguage: languageCode,
      };

      Retracked.trackComponent(TrackingNamespace, selectedTrackingData, 'track_chooser', 'selected');
    }

    const { onTrackSelect, tracks } = this.props;
    const track = tracks.getFromLanguageCode(languageCode);

    StorageUtils.set('language-code', languageCode);
    onTrackSelect(track);
  };

  render() {
    const { tracks, selectedTrack } = this.props;

    // TODO: make a CDS dropdown instead of standard select dropdown
    return (
      <div className="rc-TrackChooser vertical-box">
        <label htmlFor="select-language">
          <select
            aria-label="Select Language"
            name="language_track"
            id="select-language"
            defaultValue={selectedTrack.languageCode}
            onChange={this.handleSelect}
            ref={(ref) => {
              this.selectNode = ref;
            }}
          >
            {/* TODO: revisit the need for the default option (consider removing) */}
            <option value={-1}>{_t('Select a language')}</option>

            {tracks.toArray().map(({ label, languageCode }: $TSFixMe) => (
              <option key={`track-${languageCode}`} value={languageCode} aria-label={`${_t('Language')}, ${label}`}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
}

export default TrackChooser;
