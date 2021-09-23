export async function fetchListenerQuestionReplies(
  episodeId: string,
  questionId: number
): Promise<ListenerQuestionReplies> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/question/${questionId}/responses`
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Response not ok');
  } catch (e) {
    throw new Error(e);
  }
}

export type UserInfo = {
  profileImageUri?: string;
  displayName: string;
};

export type ListenerQuestionReply = {
  id: string;
  spotifyUserId: string;
  text: string;
  isFeatured: boolean;
  repliedAt: Date;
  repliedAtEpochTime: number;
  userInfo: UserInfo;
  featuredAt?: Date;
};

export type ListenerQuestionReplies = {
  episodeId: string;
  questionId: number;
  featuredResponses: ListenerQuestionReply[];
  allResponses: ListenerQuestionReply[];
};
