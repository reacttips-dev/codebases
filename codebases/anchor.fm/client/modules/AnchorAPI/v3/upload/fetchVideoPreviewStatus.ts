export type FetchVideoPreviewStatusResponse = {
  webAudioId?: string;
  url?: string;
  requestUuid: string;
  state: 'Success' | 'Failure' | 'Requested' | 'Transcoding';
  failureDescription?: string;
  failureReason?: string;
} | null;

export type FetchVideoProcessingStatusParams = {
  requestUuid: string;
};

export async function fetchVideoPreviewStatus({
  requestUuid,
}: FetchVideoProcessingStatusParams): Promise<FetchVideoPreviewStatusResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/upload/${requestUuid}/preview?returnWebIds=true`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }

    if (response.status === 404) {
      return null;
    }

    throw new Error('Could not fetch episode video.');
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function pollVideoPreviewStatus({
  onSuccess,
  onError,
  requestUuid,
}: {
  onSuccess: (response: FetchVideoPreviewStatusResponse) => void;
  onError: () => void;
  requestUuid: string;
}) {
  const maxFetches = 100;
  let fetchNumber = 0;
  let isFetching = false;

  const poll = () => {
    setTimeout(() => {
      if (!isFetching) {
        isFetching = true;
        fetchNumber = fetchNumber + 1;
        fetchVideoPreviewStatus({ requestUuid })
          .then(res => {
            if (res && res.state) {
              switch (res.state) {
                case 'Success':
                  if (onSuccess) onSuccess(res);
                  break;
                case 'Failure':
                  if (onError) onError();
                  break;
                case 'Transcoding':
                case 'Requested':
                  if (fetchNumber > maxFetches) {
                    if (onError) onError();
                    break;
                  }
                  poll();
                  break;
              }
            }
          })
          .catch(() => onError())
          .finally(() => {
            isFetching = false;
          });
      }
    }, 5000); // poll every 5 seconds
  };

  poll();
}
