import { ReplyAction } from 'client/modules/AnchorAPI/v3/episodes/modifyListenerQuestionReply';
import { AnchorAPI } from 'modules/AnchorAPI';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const INTERACTIVE_QUESTION_KEY = 'INTERACTIVE_QUESTION_KEY';

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    async ({ episodeId, text }: { episodeId: string; text: string }) => {
      try {
        await AnchorAPI.createListenerQuestion(episodeId, text);
        return queryClient.invalidateQueries([
          INTERACTIVE_QUESTION_KEY,
          episodeId,
        ]);
      } catch (e) {
        throw new Error((e as Error).message);
      }
    },
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([
          INTERACTIVE_QUESTION_KEY,
          episodeId,
        ]);
      },
    }
  );
  return { createQuestion: mutate, status };
}

export function useFetchQuestionAndResponses(episodeId: string) {
  const { data, status } = useQuery([INTERACTIVE_QUESTION_KEY, episodeId], () =>
    fetchListenerQuestionAndResponses(episodeId)
  );
  return { data, status };
}

async function fetchListenerQuestionAndResponses(episodeId: string) {
  const listenerQuestionResult = await AnchorAPI.fetchListenerQuestion(
    episodeId
  );
  if (!listenerQuestionResult) {
    return {};
  }
  const { questionId } = listenerQuestionResult;
  const {
    allResponses,
    featuredResponses,
  } = await AnchorAPI.fetchListenerQuestionReplies(episodeId, questionId);
  return {
    question: listenerQuestionResult,
    featuredResponses,
    allResponses,
  };
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({ episodeId, questionId }: { episodeId: string; questionId: number }) =>
      AnchorAPI.deleteListenerQuestion(episodeId, questionId),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([
          INTERACTIVE_QUESTION_KEY,
          episodeId,
        ]);
      },
    }
  );
  return { deleteQuestion: mutate, status };
}

export function useModifyQuestionReply() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({
      episodeId,
      questionId,
      replyId,
      spotifyUserId,
      action,
    }: {
      episodeId: string;
      questionId: number;
      replyId: string;
      spotifyUserId: string;
      action: ReplyAction;
    }) =>
      AnchorAPI.modifyListenerQuestionReply(
        episodeId,
        questionId,
        replyId,
        spotifyUserId,
        action
      ),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([
          INTERACTIVE_QUESTION_KEY,
          episodeId,
        ]);
      },
    }
  );
  return { modifyQuestionReply: mutate, status };
}

/**
 * Currently used only for blocking users in context of
 * episode interactivity (Q&A), so passing the episodeId
 * re-fetches the question / coupled to Q&A
 */
export function useBlockSpotifyUserFromQuestion() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({ spotifyUserId }: { episodeId: string; spotifyUserId: string }) =>
      AnchorAPI.blockSpotifyUser(spotifyUserId),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([
          INTERACTIVE_QUESTION_KEY,
          episodeId,
        ]);
      },
    }
  );
  return { blockSpotifyUserFromQuestion: mutate, status };
}
