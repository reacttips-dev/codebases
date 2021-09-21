import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

interface ITranscriptionWord {
  from: number;
  to: number;
  text: string;
}

const updateTranscription = (
  audioId: string,
  transcription: ITranscriptionWord[]
) => {
  return new Promise<{}>((resolve, reject) => {
    fetch(`/api/transcription/${audioId}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ transcription }),
    }).then(response => {
      if (response.ok) {
        resolve(response);
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${
            response.url
          }`
        );
        reject(error);
      }
    });
  });
};

export { updateTranscription };
