// Render-prop component to access multiple changed responses by array of ids. It does not
// update cache, it takes updated responses added by `ChangedResponse` component.
// Useful to fetch all existing changed responses to submit.
// Warning: it might have responses not for all fields for submission. You need to merge them
// with existing responses before updating.
// <ChangedResponse ids={[1, 2, 3]}>
//   {responses => (
//     <RenderResponsesOrSmth responses={responses} />
//   )}
// </ChangedResponse>
// The second parameter of children render-props is the original response from the query, you
// can use it to access loading parameter or original data.

import React from 'react';

import { Query } from 'react-apollo';

import LocalStateConsumer from '../LocalStateConsumer';
import { ResponseWithId, asChangedResponse } from './ResponseWithId';
import { changedResponsesQuery } from './queries';
import {
  ChangedResponsesQueryRenderProps,
  ChangedResponsesQueryResponse,
  ChangedResponsesQueryVariables,
  ChangedResponse as ChangedResponseType,
} from './types';

import formChangedResponseId from './utils/formChangedResponseId';

type RenderProps = [Array<ChangedResponseType> | null | undefined, ChangedResponsesQueryRenderProps];

type Props = {
  ids: Array<string>;
  localScopeId?: string;

  // We optionally pass in responses with corresponding ids to augment the responses found in the
  // cache. This is for instances where some form parts aren't rendered under `ChangedResponse`.
  responses?: ResponseWithId[];

  children: (...args: RenderProps) => React.ReactNode;
};

const ChangedResponses: React.SFC<Props> = ({ ids, localScopeId, responses = [], children }) => {
  const changedResponseIds = ids.map((id) => formChangedResponseId(id, localScopeId));
  const responseMap = responses.reduce((map, response) => ({ ...map, [response.id]: response }), {});

  return (
    <LocalStateConsumer>
      <Query<ChangedResponsesQueryResponse, ChangedResponsesQueryVariables>
        query={changedResponsesQuery}
        variables={{ ids: changedResponseIds }}
        // Due to a bug in apollo client, sometimes, the query does not update the 'loading' value.
        // Most frequently when the data doesn't change. This makes the SubmissionControls prop to not render.
        // This prop on the query forces to notify the component of any network change, which eventually updates
        // the 'loading' value of the query. https://github.com/apollographql/react-apollo/issues/321
        notifyOnNetworkStatusChange={true}
      >
        {(result) => {
          const { data, loading } = result;

          if (loading) {
            return children(undefined, result);
          }

          const cachedResponses = (data?.ChangedResponse?.multiGet.responses || []).filter(
            (changedResponse) => changedResponse.response
          );
          const cachedResponseMap = cachedResponses.reduce(
            (map, response) => ({ ...map, [response.id]: response }),
            {}
          );

          const returnedResponses = ids.reduce((acc, id) => {
            const changedResponseId = formChangedResponseId(id, localScopeId);

            // Find matching response from cache
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const cachedResponse = cachedResponseMap[changedResponseId] && {
              // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              ...cachedResponseMap[changedResponseId],
              id,
            };

            // Find matching response from `responses` prop
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const responseFromProp = responseMap[id] && asChangedResponse(responseMap[id]);

            // Take cached response first, but otherwise take response from prop
            const matchingResponse = cachedResponse || responseFromProp;

            // Append matching response only if it exists
            return matchingResponse ? acc.concat(matchingResponse) : acc;
          }, [] as ChangedResponseType[]);

          return children(returnedResponses, result);
        }}
      </Query>
    </LocalStateConsumer>
  );
};

export default ChangedResponses;
