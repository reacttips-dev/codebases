import {useState, useContext, useEffect} from 'react';
import {ApolloContext} from '../../enhancers/graphql-enhancer';

export const usePolling = ({
  query,
  variables,
  shouldPoll = true,
  pollingTime,
  checkIfNeedToRefetch,
  functionToBeExecutedAfterPolling
}) => {
  const client = useContext(ApolloContext);
  const [pollingCalled, setPollingCalled] = useState(false);
  const [pollingData, setPollingData] = useState(false);

  useEffect(() => {
    const PollingFunction = () => {
      if (!pollingCalled) {
        setPollingCalled(true);
        client
          .query({query: query, variables: variables, fetchPolicy: 'network-only'})
          .then(resp => {
            const {data, loading} = resp;
            setPollingData(resp);
            const neededRefetch = checkIfNeedToRefetch(data);
            if (!loading) {
              if (neededRefetch) {
                setTimeout(() => {
                  PollingFunction();
                }, pollingTime);
              } else {
                if (functionToBeExecutedAfterPolling) functionToBeExecutedAfterPolling();
              }
            }
          });
      }
    };

    if (shouldPoll) {
      PollingFunction();
    }
  });

  return pollingData;
};
