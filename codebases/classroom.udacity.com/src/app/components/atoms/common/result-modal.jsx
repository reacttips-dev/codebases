import { Button, Modal } from '@udacity/veritas-components';
import { __, i18n } from 'services/localization-service';

import ClassroomPropTypes from 'components/prop-types';
import Markdown from '@udacity/ureact-markdown';
import NodeHelper from 'helpers/node-helper';
import Player from '@udacity/ureact-player';
import PropTypes from 'prop-types';
import VideoHelper from 'helpers/video-helper';
import styles from './result-modal.scss';

@cssModule(styles, { allowMultiple: true })
export class ResultModal extends React.Component {
  static displayName = 'atoms/common/result-modal';

  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onContinueOnSuccessfulResult: PropTypes.func,
    feedback: PropTypes.string,
    video_feedback: ClassroomPropTypes.video,
    comment: PropTypes.string,
    passed: PropTypes.bool.isRequired,
    hasAnswer: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isOpen: false,
    onRequestClose: _.noop,
    onContinueOnSuccessfulResult: _.noop,
  };

  static contextTypes = {
    root: PropTypes.object.isRequired,
  };

  handleContinueOnSuccessfulResult = () => {
    this.props.onRequestClose();
    this.props.onContinueOnSuccessfulResult();
  };

  render() {
    const {
      isOpen,
      onRequestClose,
      feedback,
      video_feedback,
      comment,
      passed,
      hasAnswer,
    } = this.props;
    const instructorImageUrl = NodeHelper.getInstructorImageUrl(
      this.context.root
    );
    const isAlternativePlayer = VideoHelper.isAlternativePlayer(
      this.context.root
    );
    let title, resultClass;
    let canContinue = false;
    let buttonText;

    if (passed === true) {
      title = __('Thanks for completing that!');
      resultClass = 'passed';
      canContinue = true;
    } else if (passed === false) {
      title = __('Try Again');
      resultClass = 'failed';
    } else {
      resultClass = 'thanks';
      canContinue = true;
    }

    if (canContinue && !hasAnswer) {
      buttonText = __('Close');
    } else if (canContinue && hasAnswer) {
      buttonText = __('Continue');
    } else {
      buttonText = __('Try Again');
    }
    return (
      <Modal
        open={isOpen}
        onClose={onRequestClose}
        label={__('Lab Complete')}
        closeLabel={__('Close Modal')}
      >
        <div styleName={`header ${resultClass}`}>
          {instructorImageUrl ? (
            <div
              styleName="avatar"
              style={{ backgroundImage: `url(${instructorImageUrl})` }}
            />
          ) : (
            <div
              styleName={
                canContinue ? 'passed-illustration' : 'failed-illustration'
              }
            />
          )}
          <h1 aria-live="assertive">{title}</h1>
        </div>

        <div styleName="body">
          {video_feedback ? (
            <div styleName="video">
              <Player
                countryCode={i18n.getCountryCode()}
                youtubeId={video_feedback.youtube_id}
                chinaCdnId={video_feedback.china_cdn_id}
                topherId={video_feedback.topher_id}
                transcodings={video_feedback.transcodings}
                isAlternativePlayer={isAlternativePlayer}
              />
            </div>
          ) : feedback ? (
            <Markdown text={feedback ? feedback : ''} />
          ) : null}

          <div styleName="comment">
            <Markdown text={comment ? comment : ''} />
          </div>

          <div styleName="button">
            <Button
              variant="primary"
              onClick={
                canContinue
                  ? this.handleContinueOnSuccessfulResult
                  : onRequestClose
              }
              label={buttonText}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default ResultModal;
