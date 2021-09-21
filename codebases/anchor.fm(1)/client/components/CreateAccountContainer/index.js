import { connect } from 'react-redux';
import { withOptimizely } from '@optimizely/react-sdk';

import { SignupForm } from 'components/SignupForm';
import {
  submitCreateAccountForImportForm,
  showRequestResetPassword,
} from 'client/user';

const mapDispatchToProps = (dispatch, { submitCallback, optimizely }) => ({
  onSubmit: (data, setError) =>
    dispatch(
      submitCreateAccountForImportForm(
        data,
        submitCallback,
        setError,
        optimizely.user.id // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
      )
    ),
  loginUrl: '/switch/login',
  onClickRequestResetPassword: () =>
    dispatch(showRequestResetPassword('Forgot Password')),
});

const mapStateToProps = () => ({
  isImporting: true,
});

// TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
export default withOptimizely(
  connect(mapStateToProps, mapDispatchToProps)(SignupForm)
);
