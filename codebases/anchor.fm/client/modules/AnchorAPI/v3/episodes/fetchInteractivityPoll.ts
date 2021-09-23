export async function fetchInteractivityPoll(
  episodeId: string
): Promise<InteractivityPollsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/poll`
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Response not ok');
  } catch (e) {
    console.warn('Error fetching from Interactivity API: ', e);
    throw new Error(e);
  }
}

export type PollFormData = {
  name: string;
  question: string;
  type: POLL_TYPE;
  opening_date: string | number;
  closing_date: string | number;
  options: Option[];
  published: boolean;
  entity_timestamp_ms: number;
};

export type InteractivityPoll = PollFormData & {
  id: number;
  status: POLL_STATUS;
  blocked: boolean;
  poll_metadata: {
    created: string;
    created_by: string;
    poll_id: number;
    last_edited: string;
    last_edited_by: string;
  };
};
export type InteractivityPollsResponse = {
  polls: InteractivityPoll[];
};
export enum POLL_TYPE {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}
export enum POLL_STATUS {
  LIVE = 'LIVE',
  DRAFT = 'DRAFT',
  CLOSED = 'CLOSED',
  SCHEDULED = 'SCHEDULED',
}

export enum POLL_STATUS_DISPLAY_COPY {
  LIVE = 'Published',
  DRAFT = 'Draft',
  CLOSED = 'Closed',
  SCHEDULED = 'Scheduled',
}
export type Option = {
  description: string;
  total_votes: number;
  poll_id: number;
  option_id: number;
};
