import { AnchorAPI } from 'modules/AnchorAPI';
import { PollFormData } from 'modules/AnchorAPI/v3/episodes/fetchInteractivityPoll';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const INTERACTIVE_POLL_KEY = 'INTERACTIVE_POLL_KEY';

export function useFetchPoll(episodeId: string) {
  const { data, status } = useQuery([INTERACTIVE_POLL_KEY, episodeId], () =>
    AnchorAPI.fetchInteractivityPoll(episodeId)
  );
  return { data, status };
}

export function useCreatePoll() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({ episodeId, poll }: { episodeId: string; poll: PollFormData }) =>
      AnchorAPI.createInteractivityPoll(episodeId, poll),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([INTERACTIVE_POLL_KEY, episodeId]);
      },
    }
  );
  return { createPoll: mutate, status };
}

export function useDeletePoll() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({ episodeId, userId }: { episodeId: string; userId: number }) =>
      AnchorAPI.deleteInteractivityPoll(episodeId, userId),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([INTERACTIVE_POLL_KEY, episodeId]);
      },
    }
  );
  return { deletePoll: mutate, status };
}

export function useUpdatePoll() {
  const queryClient = useQueryClient();
  const { mutate, status } = useMutation(
    ({
      episodeId,
      poll: updates,
    }: {
      episodeId: string;
      poll: Partial<PollFormData>;
    }) => AnchorAPI.updateInteractivityPoll(episodeId, updates),
    {
      onSuccess: (res, { episodeId }) => {
        return queryClient.invalidateQueries([INTERACTIVE_POLL_KEY, episodeId]);
      },
    }
  );
  return { updatePoll: mutate, status };
}
