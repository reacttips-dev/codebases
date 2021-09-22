const propertyComparator = (propName: $TSFixMe) => {
  return (a: $TSFixMe, b: $TSFixMe) => {
    if (a[propName] < b[propName]) return -1;
    if (a[propName] > b[propName]) return 1;
    return 0;
  };
};

class TrackList {
  /**
   * @param {array} tracks An array of Track objects.
   */
  constructor(tracks: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tracks' does not exist on type 'TrackLis... Remove this comment to see the full error message
    this.tracks = tracks.slice();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tracks' does not exist on type 'TrackLis... Remove this comment to see the full error message
    this.tracks.sort(propertyComparator('label'));
  }

  toArray() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tracks' does not exist on type 'TrackLis... Remove this comment to see the full error message
    return this.tracks;
  }

  getFromLanguageCode(languageCode: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tracks' does not exist on type 'TrackLis... Remove this comment to see the full error message
    return this.tracks.find((track) => track.languageCode === languageCode);
  }
}

export default TrackList;
