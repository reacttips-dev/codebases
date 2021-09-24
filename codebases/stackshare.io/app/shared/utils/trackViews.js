export const callTrackViews = ({client, trackViews, decisionIds = [], clientContext}) => {
  // Checking the window object to see if it is in ssr or not.
  // If not we will get the window object. And will run the mutation
  // So that there are no trackViews during deployment.

  if (window && !process.env.SSR && decisionIds.length > 0) {
    if (client) {
      client.mutate({
        mutation: trackViews,
        variables: {decisionIds, clientContext},
        ssr: false
      });
      return;
    }

    trackViews(decisionIds, clientContext);
  }
};
