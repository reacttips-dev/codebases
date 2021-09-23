export async function modifyListenerQuestionReply(
  episodeId: string,
  questionId: number,
  replyId: string,
  spotifyUserId: string,
  action: ReplyAction
): Promise<Response> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/question/${questionId}/responses/${replyId}/${action}`,
      {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ spotifyUserId }),
      }
    );
    if (response.ok) {
      return response;
    }
    throw new Error('response not OK');
  } catch (e) {
    throw new Error(e.message);
  }
}

export enum ReplyAction {
  FEATURE = 'feature',
  UNFEATURE = 'unfeature',
}
