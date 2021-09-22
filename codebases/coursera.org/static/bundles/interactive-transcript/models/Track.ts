import type { LanguageCode } from 'bundles/interactive-transcript/types';

class Track {
  cues: Array<$TSFixMe>;

  languageCode: LanguageCode;

  constructor(languageCode: LanguageCode, label: $TSFixMe, url: $TSFixMe) {
    this.languageCode = languageCode;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Track'.
    this.label = label;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Track'.
    this.url = url;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sourceContent' does not exist on type 'T... Remove this comment to see the full error message
    this.sourceContent = null;
    this.cues = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoaded' does not exist on type 'Track'... Remove this comment to see the full error message
    this.isLoaded = false;
  }

  getTextTranscript() {
    return this.cues.map((cue) => cue.text).join(' ');
  }
}

export default Track;
