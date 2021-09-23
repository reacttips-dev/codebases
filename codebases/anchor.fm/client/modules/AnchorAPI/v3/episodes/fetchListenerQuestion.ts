export async function fetchListenerQuestion(
  episodeId: string
): Promise<ListenerQuestion | null> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/question`
    );
    // "404" for Q&A questions
    if (response.status === 204) {
      return null;
    }
    if (response.ok) {
      return response.json();
    }
    throw new Error('Response not ok');
  } catch (e) {
    throw new Error(e);
  }
}

export type ListenerQuestion = {
  episodeId: number;
  questionId: number;
  text: string;
  created: Date;
  replyCount: number;
  hasNewReplies: boolean;
  openingDate?: string | null;
  closingDate?: string | null;
  creationEpochTime: number;
  stationId: number;
  isDeleted?: boolean;
  modified?: null | boolean;
};
