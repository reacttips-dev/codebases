import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getOpenInAppUrl } from '../../../helpers/serverRenderingUtils';
import CallJoin from '../CallJoin';

const mapStateToProps = ({ user }, { location: { pathname, search } }) => {
  const inviteCode = pathname.substring(pathname.lastIndexOf('/') + 1);
  return {
    openInAppUrl: getOpenInAppUrl(`${pathname}${search}`),
    user,
    inviteCode,
  };
};

const mapDispatchToProps = dispatch => ({
  onPressDoneRecordingConfirmation: isUserLoggedIn => {
    if (isUserLoggedIn) {
      dispatch(push('/dashboard'));
    } else {
      dispatch(push('/signup?redirectedFrom=rwf'));
    }
  },
});

function CallJoinContainer({
  openInAppUrl,
  user,
  inviteCode,
  onPressDoneRecordingConfirmation,
}) {
  return (
    <CallJoin
      openInAppUrl={openInAppUrl}
      user={user && user.user ? user.user : null}
      inviteCode={inviteCode}
      onPressDoneRecordingConfirmation={onPressDoneRecordingConfirmation}
    />
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallJoinContainer);
