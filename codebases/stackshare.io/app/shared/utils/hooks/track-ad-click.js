import {useState, useEffect, useContext} from 'react';
import {trackAdClick} from '../../../data/shared/mutations';
import {AnalyticsContext} from '../../enhancers/analytics-enhancer';
import {ApolloContext} from '../../enhancers/graphql-enhancer';

export const BE_AD_CLICK = 'AdClick';
export const BE_BANNER_CLICK = 'BannerClick';

function useTrackAdClick() {
  const client = useContext(ApolloContext);
  const parentPayload = useContext(AnalyticsContext);
  const [fireMutation, setFireMutation] = useState(false);
  const [eventData, setEventData] = useState({eventType: '', eventPayload: ''});

  useEffect(() => {
    if (fireMutation && client) {
      client
        .mutate({
          mutation: trackAdClick,
          variables: {...eventData}
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log('Something went wrong!', err);
        });
      setFireMutation(false);
    }
  }, [fireMutation, client]);

  const trackAdClickFunc = (eventType, eventPayload) => {
    setEventData({eventType, eventPayload: {...parentPayload, ...eventPayload}});
    setFireMutation(true);
  };

  return trackAdClickFunc;
}

export default useTrackAdClick;
