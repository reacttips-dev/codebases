import Actions from 'actions';
import SettingsHelper from 'helpers/settings-helper';
import { WINDOW_EVENTS } from 'constants/window-state';
import { connect } from 'react-redux';
import { selectWindowState } from 'helpers/state-helper/_services-state-helper';
import { useEffect } from 'react';

const POLLING_INTERVAL = 60 * 1000;

// pollingInterval injected for testing purposes
export const useSubscribe = (
  shouldNotSubscribe,
  actionToSubscribe,
  pollingInterval = POLLING_INTERVAL,
  userId
) => {
  useEffect(() => {
    if (shouldNotSubscribe) {
      return;
    }

    // Fetch unreads to avoid waiting for the interval delay.
    actionToSubscribe(userId);

    const pollIntervalId = setInterval(
      () => actionToSubscribe(userId),
      pollingInterval
    );

    return () => clearInterval(pollIntervalId);
  }, [shouldNotSubscribe, actionToSubscribe, userId, pollingInterval]);
};

const mapStateToProps = (state) => {
  const userId = _.get(SettingsHelper.State.getUser(state), 'id');
  return {
    userId,
    hasStudentHubAccess: SettingsHelper.State.getHasStudentHub(state),
    hasKnowledgeAccess: SettingsHelper.State.getHasKnowledgeReviews(state),
    windowState: selectWindowState(state),
  };
};

const mapDispatchToProps = {
  fetchStudentHubUnreads: Actions.fetchStudentHubUnreads,
  fetchKnowledgeUnreads: Actions.fetchKnowledgeUnreads,
};

export const NotificationSubscriptionContainer = ({
  children,
  fetchKnowledgeUnreads,
  fetchStudentHubUnreads,
  hasKnowledgeAccess,
  hasStudentHubAccess,
  userId,
  windowState,
  // pollingInterval injected for testing purposes
  pollingInterval = POLLING_INTERVAL,
}) => {
  const isActive = windowState && windowState === WINDOW_EVENTS.FOCUS;

  // We don't want users to subscribe if they don't have access or if their window is not active.
  const shouldNotSubscribeHub = !hasStudentHubAccess || !isActive;
  const shouldNotSubscribeKnowlege = !hasKnowledgeAccess || !isActive;

  // Subscribe to Student Hub unreads
  useSubscribe(
    shouldNotSubscribeHub,
    fetchStudentHubUnreads,
    pollingInterval,
    userId
  );

  // Subscribe to Knowledge unreads
  useSubscribe(
    shouldNotSubscribeKnowlege,
    fetchKnowledgeUnreads,
    pollingInterval
  );

  return <React.Fragment>{children}</React.Fragment>;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSubscriptionContainer);
