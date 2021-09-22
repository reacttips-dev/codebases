import React from 'react';

type Props = {
  announcementText: string | null;
};

// Aria live region that contains the text from the transcript that is selected. It will announce to screen readers what text they currently have selected for creating a note. We force remount the text when it changes using the key prop to avoid multiple announcements of the text when using the NVDA screen reader. Inspiration for the pattern comes from: https://github.com/nvaccess/nvda/issues/7996
export default class TranscriptSelectionAnnouncer extends React.PureComponent<Props> {
  render() {
    const { announcementText } = this.props;
    return announcementText ? (
      <div className="rc-TranscriptSelectionAnnouncer sr-only" aria-live="assertive" aria-atomic={true}>
        <span key={announcementText}>{announcementText}</span>
      </div>
    ) : null;
  }
}
