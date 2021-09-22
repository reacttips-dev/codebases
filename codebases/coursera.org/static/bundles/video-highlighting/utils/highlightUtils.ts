import uuid from 'bundles/common/utils/uuid';

import createSnapshot from 'bundles/video-highlighting/utils/createSnapshot';
import { getAdjacentCues } from 'bundles/interactive-transcript/utils/TranscriptUtils';

import { VideoPlayer } from 'bundles/item-lecture/types';
import Track from 'bundles/interactive-transcript/models/Track';
import { LanguageCode } from 'bundles/interactive-transcript/types';
import { Highlight, HighlightResponse, HighlightDraft, TranscriptSelection } from 'bundles/video-highlighting/types';

// see https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
export const getBlobFromDataURI = (dataURI: string): Blob => {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

export const generateHighlightFromTranscriptSelection = (
  transcriptSelection: TranscriptSelection,
  selectedTrack: Track
): Highlight => {
  const { transcriptTextStartIndex, transcriptTextEndIndex } = transcriptSelection;

  const cues = selectedTrack.cues.filter(
    (cue) => cue.index >= transcriptTextStartIndex.cueIndex && cue.index <= transcriptTextEndIndex.cueIndex
  );

  const transcriptText = cues.reduce((acc, cue) => {
    const { index: cueIndex, text: cueText } = cue;

    const { cueIndex: startCueIndex, textIndex: startTextIndex } = transcriptTextStartIndex;
    const { cueIndex: endCueIndex, textIndex: endTextIndex } = transcriptTextEndIndex;

    if (cueIndex === startCueIndex) {
      if (cueIndex === endCueIndex) {
        return `${acc}${cueText.substring(startTextIndex, endTextIndex + 1)}`;
      }

      return `${acc}${cueText.substring(startTextIndex)}`;
    } else if (cueIndex === endCueIndex) {
      return `${acc} ${cueText.substring(0, endTextIndex + 1)}`;
    }

    return `${acc} ${cueText}`;
  }, '');

  const id = uuid();
  const clientId = id;

  const firstCue = cues[0];
  const lastCue = cues[cues.length - 1];

  const noteEndTs = lastCue.endTime;
  const captureTs = firstCue.startTime;
  const noteStartTs = firstCue.startTime;

  const noteText = '';

  const pendingCreate = true;
  const pendingUpdate = false;

  const { languageCode } = selectedTrack;

  return {
    id,
    clientId,
    captureTs,
    noteStartTs,
    noteEndTs,
    transcriptText,
    noteText,
    languageCode,
    transcriptTextStartIndex,
    transcriptTextEndIndex,
    pendingCreate,
    pendingUpdate,
  };
};

export const generateHighlightFromCaptureButton = (selectedTrack: Track, videoPlayer: VideoPlayer): Highlight => {
  const id = uuid();
  const clientId = id;

  const noteText = '';

  const { languageCode } = selectedTrack;

  const captureTs = videoPlayer.currentTime();
  const cues = getAdjacentCues(selectedTrack.cues, captureTs, languageCode);

  const firstCue = cues[0];
  const lastCue = cues[cues.length - 1];

  const transcriptText = cues.reduce((acc, cue) => {
    if (cue.index === firstCue.index) {
      return `${acc}${cue.text}`;
    }

    return `${acc} ${cue.text}`;
  }, '');

  const transcriptTextStartIndex = {
    textIndex: 0,
    cueIndex: firstCue.index,
  };

  const transcriptTextEndIndex = {
    textIndex: lastCue.text.length - 1,
    cueIndex: lastCue.index,
  };

  const noteEndTs = lastCue.endTime;
  const noteStartTs = firstCue.startTime;

  const pendingCreate = true;
  const pendingUpdate = false;

  const snapshotDataUrl = createSnapshot(videoPlayer);

  return {
    id,
    clientId,
    captureTs,
    noteStartTs,
    noteEndTs,
    transcriptText,
    noteText,
    languageCode,
    transcriptTextStartIndex,
    transcriptTextEndIndex,
    snapshotDataUrl,
    pendingCreate,
    pendingUpdate,
  };
};

export const getDraftFromHighlight = ({
  itemId,
  courseId,
  highlight,
  languageCode,
}: {
  itemId?: string;
  courseId: string;
  highlight: Highlight;
  languageCode: LanguageCode;
}): HighlightDraft => {
  const {
    noteStartTs,
    noteEndTs,
    captureTs,
    snapshotUrl,
    transcriptText,
    noteText: userNote,
    transcriptTextEndIndex,
    transcriptTextStartIndex,
  } = highlight;

  return {
    details: {
      typeName: 'video',
      definition: {
        itemId,
        courseId,
        snapshotUrl: snapshotUrl || '',
        transcriptTextStartIndex,
        transcriptTextEndIndex,
        languageCode,
        transcriptText,

        noteEndTs: noteEndTs && noteEndTs * 1000,
        captureTs: captureTs && captureTs * 1000,
        noteStartTs: noteStartTs && noteStartTs * 1000,
      },
    },
    userNote,
  };
};
