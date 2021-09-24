import {onboardingChecklist} from '../feed/queries';
import {decisionFragment} from '../feed/fragments';
import {defaultDataIdFromObject} from 'apollo-cache-inmemory';

export const handleToggleBookmark = mutate => ({
  onBookmarkToggle: (id, type, bookmark) =>
    mutate({
      variables: {id, type, bookmark},
      optimisticResponse: {
        __typename: 'Mutation',
        toggleBookmark: {
          id: id,
          __typename: type,
          bookmarked: bookmark
        }
      }
    })
});

export const handleToggleUpvote = mutate => ({
  onUpvoteToggle: (id, type, upvote, currentCount) =>
    mutate({
      variables: {id, type, upvote},
      optimisticResponse: {
        __typename: 'Mutation',
        toggleUpvote: {
          id: id,
          __typename: type,
          upvoted: upvote,
          upvotesCount: currentCount + (upvote ? 1 : -1)
        }
      },
      refetchQueries: [{query: onboardingChecklist}]
    })
});

export const handleDestroyStackDecision = mutate => ({
  onDelete: id =>
    mutate({
      variables: {id},
      update: (store, {data: {destroyStackDecision}}) => {
        const decisionId = defaultDataIdFromObject(destroyStackDecision);
        const decision = store.readFragment({id: decisionId, fragment: decisionFragment});
        decision.deleted = true;
        store.writeFragment({id: decisionId, fragment: decisionFragment, data: decision});
      }
    })
});
