import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { duckOperations } from './duck';
import { SupportersCancelScreen } from './SupportersCancelScreen';

const { getBaseUrl } = require('./../../../helpers/serverRenderingUtils');

// Utils ----------------------------------------------

const setupStoreForInitialRender = (dispatch, vanitySlug) =>
  dispatch(duckOperations.setupStoreForInitialRender(vanitySlug));

// Wrap stateless component with a lifecycles ---------

class SupportersCancelScreenWithLifeCycle extends React.Component {
  componentDidMount() {
    const { onComponentDidMount } = this.props;
    onComponentDidMount();
  }

  render = () => <SupportersCancelScreen {...this.props} />;
}

// Redux ------------------------------------------------

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickCancel: (stationId, cancelCode, _csrf) => {
    dispatch(duckOperations.cancelFetch(stationId, cancelCode, _csrf));
  },
  onComponentDidMount: () => {
    const { vanitySlug } = ownProps.match.params;
    setupStoreForInitialRender(dispatch, vanitySlug);
  },
});
const mapStateToProps = (
  {
    supportersCancelScreen: {
      stationId,
      isCancelComplete,
      isCancellationProcessing,
      podcastMetadata: { podcastName },
      isPageLoading,
    },
  },
  ownProps
) => ({
  isPageLoading,
  podcastName,
  podcastUrl: `${getBaseUrl()}/${ownProps.match.params.vanitySlug}`,
  podcastStationId: stationId,
  cancelCode: queryString.parse(ownProps.location.search).cc,
  isCancelComplete,
  isCancellationProcessing,
});

const ConnectedSupportersCancelScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SupportersCancelScreenWithLifeCycle);

export const SupportersCancelScreenContainer = ConnectedSupportersCancelScreen;
