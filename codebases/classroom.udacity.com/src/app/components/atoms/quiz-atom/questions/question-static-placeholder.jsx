import { Button, Loading } from '@udacity/veritas-components';

import Buttons from './_buttons';
import { IconWarning } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './question-static-placeholder.scss';

const PLACEHOLDER_STATES = {
  READY: 'READY',
  LOADING: 'LOADING',
  DOWNLOADED: 'DOWNLOADED',
  FAILED: 'FAILED',
};

class QuestionStaticPlaceholder extends React.Component {
  static propTypes = {
    atomName: PropTypes.string.isRequired,
    onDownload: PropTypes.func,
    onViewAnswer: PropTypes.func,
  };

  static defaultProps = {
    onDownload: null,
    onViewAnswer: null,
  };

  state = {
    isLoading: false,
    errorMessage: null,
    status: PLACEHOLDER_STATES.READY,
  };

  handleDownload = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      // delay loading state by 1 second
      Promise.delay(500).then(() => {
        this.setState((prevState) => ({
          status: prevState.isLoading
            ? PLACEHOLDER_STATES.LOADING
            : prevState.status,
        }));
      });

      await this.props.onDownload();
      this.setState({
        isLoading: false,
        status: PLACEHOLDER_STATES.DOWNLOADED,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        status: PLACEHOLDER_STATES.FAILED,
        errorMessage: error.userMessage
          ? error.userMessage
          : __(
              'Something seems to have gone wrong on our end. Please give it a second and try again!'
            ),
      });
    }
  };

  renderCard() {
    const { atomName, onDownload } = this.props;
    const { status, errorMessage, isLoading } = this.state;
    switch (status) {
      case PLACEHOLDER_STATES.READY:
      case PLACEHOLDER_STATES.DOWNLOADED:
        return (
          <div styleName="card">
            <div styleName="text">
              <h2 styleName="title">
                <IconWarning size="md" title={__('Unavailable')} color="red" />
                {__('This <%= atomName %> is no longer available', {
                  atomName,
                })}
              </h2>
              <p styleName="summary">
                {onDownload
                  ? __(
                      'This <%= atomName %> is unavailable because the Nanodegree program has come to an end, however your code and all the files can still be downloaded.',
                      { atomName }
                    )
                  : __(
                      'This <%= atomName %> is unavailable because the Nanodegree program term has come to an end.',
                      { atomName }
                    )}
              </p>
            </div>
            {onDownload && (
              <div styleName="cta">
                <Button
                  label={__('Download')}
                  onClick={isLoading ? _.noop : this.handleDownload}
                  variant="primary"
                />
              </div>
            )}
          </div>
        );
      case PLACEHOLDER_STATES.LOADING:
        return (
          <div styleName="card">
            <div styleName="loading">
              <div styleName="spinner">
                <Loading />
              </div>
              <p styleName="summary">{__('Preparing your files...')}</p>
            </div>
          </div>
        );
      case PLACEHOLDER_STATES.FAILED:
        return (
          <div styleName="card">
            <div styleName="text">
              <h2 styleName="title-failed">
                <IconWarning size="md" title={__('Oops!')} color="red" />
              </h2>
              <p styleName="summary">{errorMessage}</p>
            </div>
            {onDownload && (
              <div styleName="cta">
                <Button
                  label={__('Retry Download')}
                  onClick={isLoading ? _.noop : this.handleDownload}
                  variant="primary"
                />
              </div>
            )}
          </div>
        );
      default:
        break;
    }
  }

  render() {
    const { onViewAnswer } = this.props;
    return (
      <div>
        {this.renderCard()}
        {onViewAnswer && <Buttons onViewAnswer={onViewAnswer} />}
      </div>
    );
  }
}

export default cssModule(QuestionStaticPlaceholder, styles);
