import { Button } from '@udacity/veritas-components';
import GoogleApiService from 'services/google-api-service';
import LessonPreviewContainer from './lesson-preview-container';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styles from './lesson-preview.scss';

const DISCOVERY_DOCS = [
  `https://docs.googleapis.com/$discovery/rest?version=v1&key=${CONFIG.lessonPreviewGoogleApiKey}`,
];
const SCOPES = 'https://www.googleapis.com/auth/documents.readonly';
const AUTH_OPTIONS = {
  apiKey: CONFIG.lessonPreviewGoogleApiKey,
  clientId: CONFIG.lessonPreviewGoogleClientId,
  discoveryDocs: DISCOVERY_DOCS,
  scope: SCOPES,
};

const mapStateToProps = (state) => {
  const { inLessonPreviewMode } = state.lessonPreview;

  return {
    inLessonPreviewMode,
  };
};

class LessonPreview extends React.Component {
  static propTypes = {
    inLessonPreviewMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      user: {},
      errorMsg: '',
    };
  }

  componentDidMount() {
    GoogleApiService.initClient(AUTH_OPTIONS)
      .then(() => {
        this.setAuthInitialized();
        GoogleApiService.subscribeSignInChanges(this.updateSignInStatus);
        if (this.isSignedIn()) {
          this.updateSignInStatus(true);
        }
      })
      .catch((error) => {
        this.setError(error.message);
      });
  }

  isSignedIn = () => {
    return GoogleApiService.isSignedIn();
  };

  setError = (errorMsg) => {
    this.setState({
      errorMsg,
    });
  };

  setAuthInitialized = () => {
    this.setState({
      initialized: true,
      errorMsg: '',
    });
  };

  updateSignInStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.updateUser();
    }
  };

  updateUser = () => {
    this.setState({
      user: {
        email: GoogleApiService.getCurrentUserEmail(),
      },
    });
  };

  renderSignIn = () => {
    return (
      <div className={styles.page}>
        <Button
          label="Sign In to Google"
          variant="primary"
          onClick={GoogleApiService.signIn}
        />
      </div>
    );
  };

  render() {
    if (this.state.errorMsg) {
      return (
        <div className={styles.page}>
          <p>{this.state.errorMsg}</p>
        </div>
      );
    }

    if (!this.state.initialized) {
      return (
        <div className={styles.page}>
          <p>Checking sign in status&hellip;</p>
        </div>
      );
    }

    if (!this.isSignedIn()) {
      return this.renderSignIn();
    } else {
      return (
        <div className={styles.page}>
          <h1 className={styles.title}>Preview a Udacity Lesson</h1>
          <div className={styles.previewContainer}>
            <LessonPreviewContainer
              inLessonPreviewMode={this.props.inLessonPreviewMode}
            />
          </div>
          <div>
            <p>
              You are signed in as {this.state.user.email}. If the lesson file
              is under a different Google account, please{' '}
              <a href="#" onClick={GoogleApiService.signOut}>
                sign out
              </a>{' '}
              and sign back in.
            </p>
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(cssModule(LessonPreview, styles));
