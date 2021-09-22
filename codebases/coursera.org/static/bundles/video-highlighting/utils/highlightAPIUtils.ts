import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

import { getDraftFromHighlight, getBlobFromDataURI } from 'bundles/video-highlighting/utils/highlightUtils';

import { Highlight, HighlightResponse } from 'bundles/video-highlighting/types';

export const userNotesAPI = API('/api/userNotes.v1', { type: 'rest' });

const uploadSnapshot = (noteId: string, snapshotDataUrl: string): Q.Promise<string> => {
  /* eslint-disable-next-line new-cap */
  return Q.Promise((resolve) => {
    const uri = new URI().addQueryParam('action', 'getScreenShotUploadUrl').addQueryParam('id', noteId);

    userNotesAPI.post(uri.toString()).then((uploadUrl) => {
      const blob = getBlobFromDataURI(snapshotDataUrl);
      const api = API(uploadUrl, { type: 'rest' });

      api.put('', { contentType: 'image/png', data: blob, processData: false }).then(() => {
        const noteIdWithoutUserId = noteId.split('~')[1];
        resolve(`https://s3.amazonaws.com/coursera-video-thumbnail-notes/web/${noteIdWithoutUserId}`);
      });
    });
  });
};

export const reshapeHighlightForClient = ({
  id,
  createdAt,
  updatedAt,
  userText: noteText,
  details: {
    definition: {
      noteEndTs,
      noteStartTs,
      captureTs,
      snapshotUrl,
      transcriptTextStartIndex,
      transcriptTextEndIndex,
      transcriptText,
      itemId,
      itemName,
      languageCode,
    },
  },
}: HighlightResponse): Highlight => ({
  id,
  itemId,
  itemName,
  clientId: id,
  createdAt,
  updatedAt,
  languageCode,
  noteText,
  noteEndTs: noteEndTs && noteEndTs / 1000,
  noteStartTs: noteStartTs && noteStartTs / 1000,
  captureTs: captureTs && captureTs / 1000,
  snapshotUrl,
  transcriptTextStartIndex,
  transcriptTextEndIndex,
  transcriptText,
  pendingCreate: false,
  pendingUpdate: false,
});

export const updateHighlight = ({
  itemId,
  courseId,
  languageCode,
  id,
  highlight,
}: {
  itemId: string;
  courseId: string;
  languageCode: string;
  id: string;
  highlight: Highlight;
}): Q.Promise<void> => {
  const uri = new URI(id);
  const data = getDraftFromHighlight({ itemId, courseId, highlight, languageCode });

  return Q(userNotesAPI.put(uri.toString(), { data }));
};

export const createHighlight = ({
  itemId,
  courseId,
  languageCode,
  highlight,
}: {
  itemId: string;
  courseId: string;
  languageCode: string;
  highlight: Highlight;
}): Q.Promise<{ id: string; snapshotUrl: string }> => {
  const draft = getDraftFromHighlight({ itemId, courseId, highlight, languageCode });

  if (highlight.snapshotDataUrl) {
    /* eslint-disable-next-line new-cap */
    return Q.Promise((resolve, reject) => {
      userNotesAPI.post('', { data: draft }).then((response) => {
        const highlightResponse = response.elements?.[0] ?? {};
        const { id } = highlightResponse;

        if (!highlight?.snapshotDataUrl) {
          reject();
          return;
        }

        uploadSnapshot(id, highlight.snapshotDataUrl).then((snapshotUrl) => {
          updateHighlight({ itemId, courseId, languageCode, id, highlight: { ...highlight, snapshotUrl } }).then(() => {
            resolve({ id, snapshotUrl });
          });
        });
      });
    });
  }

  return Q(userNotesAPI.post('', { data: draft })).then((response) => response.elements[0]);
};

export const deleteHighlight = ({ id }: { id: string }): Q.Promise<void> => {
  const uri = new URI(id);
  return Q(userNotesAPI.delete(uri.toString()));
};

export const compareHighlightsByStartTimestamp = (a: Highlight, b: Highlight) => {
  if (a.noteStartTs < b.noteStartTs) {
    return -1;
  }
  if (a.noteStartTs > b.noteStartTs) {
    return 1;
  }
  return 0;
};

export const getHighlights = ({
  itemId,
  courseId,
  languageCode,
}: {
  itemId: string;
  courseId: string;
  languageCode: string;
}): Q.Promise<Array<Highlight>> => {
  const uri = new URI()
    .addQueryParam('itemId', itemId)
    .addQueryParam('courseId', courseId)
    .addQueryParam('languageCode', languageCode)
    .addQueryParam('q', 'courseItemLanguageCode')
    .addQueryParam('fields', 'id, userText, createdAt, updatedAt, details');

  return Q(userNotesAPI.get(uri.toString())).then((response) =>
    response.elements.map(reshapeHighlightForClient).sort(compareHighlightsByStartTimestamp)
  );
};

export const getCourseHighlights = ({ courseId }: { courseId: string }): Q.Promise<Array<Highlight>> => {
  const uri = new URI()
    .addQueryParam('courseId', courseId)
    .addQueryParam('q', 'course')
    .addQueryParam('fields', 'id, userText, createdAt, updatedAt, details');

  return Q(userNotesAPI.get(uri.toString())).then((response) => response?.elements?.map(reshapeHighlightForClient));
};
