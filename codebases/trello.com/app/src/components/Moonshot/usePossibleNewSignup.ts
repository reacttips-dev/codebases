import { useEffect } from 'react';
import moment from 'moment';
import { idToDate } from '@trello/dates';
import Cookies from 'js-cookie';
import { trackGTMEvent } from '@trello/analytics';
import { getEmailDomain } from '@trello/members';
import { useMoonshotQuery } from './MoonshotQuery.generated';
import { useMoonshotPossibleNewSignupMutation } from './MoonshotPossibleNewSignupMutation.generated';

export const usePossibleNewSignup = () => {
  const { data, loading } = useMoonshotQuery();
  const [dismissPossibleSignup] = useMoonshotPossibleNewSignupMutation();
  const id = data?.member?.id ?? '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oneTimeMessagesDismissed = data?.member?.oneTimeMessagesDismissed ?? [];
  const email = data?.member?.email ?? '';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (oneTimeMessagesDismissed.includes('sent-possible-new-signup-event')) {
      return;
    }

    if (
      Cookies.get('simulateNewUser') ||
      moment().diff(moment(idToDate(id)), 'minutes') < 3
    ) {
      trackGTMEvent({
        event: 'trello.possibleNewSignup',
        ed: getEmailDomain(email),
      });
      dismissPossibleSignup({
        variables: {
          memberId: 'me',
          messageId: 'sent-possible-new-signup-event',
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addOneTimeMessagesDismissed: {
            id: 'me',
            oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
              'sent-possible-new-signup-event',
            ]),
            __typename: 'Member',
          },
        },
      });
    }
  }, [loading, id, oneTimeMessagesDismissed, email, dismissPossibleSignup]);
};
