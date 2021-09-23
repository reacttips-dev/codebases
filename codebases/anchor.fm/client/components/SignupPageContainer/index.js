import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withOptimizely } from '@optimizely/react-sdk';
import { SignupPage } from 'components/SignupPage';
import { submitCreateAccountForm, showRequestResetPassword } from 'client/user';
import { useCurrentUserCtx } from 'contexts/CurrentUser';

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (data, setError) => {
    const {
      location: { search },
      fetchCurrentUser,
      optimizely,
    } = ownProps;
    const { ref } = queryString.parse(search);
    // Passing isFromSignup=true to fetchCurrentUser() ensures mParticle
    // 'onboarding_completed' event is fired in callback
    return dispatch(
      submitCreateAccountForm(
        data,
        () => fetchCurrentUser(true),
        {
          doAddToEmailList: true,
          ref,
        },
        optimizely.user.id // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
      )
    );
  },
  onClickRequestResetPassword: () =>
    dispatch(showRequestResetPassword('Forgot Password')),
});

const mapStateToProps = ({ routing }) => ({
  routing,
});

// TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
const SignUpPageContainerWithRedux = withOptimizely(
  connect(mapStateToProps, mapDispatchToProps)(SignupPage)
);

export default function SignUpPageWrapper(props) {
  const { fetchCurrentUser } = useCurrentUserCtx();
  return (
    <SignUpPageContainerWithRedux
      {...props}
      fetchCurrentUser={fetchCurrentUser}
    />
  );
}
