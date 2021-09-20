import { Button, Modal, TextArea } from '@udacity/veritas-components';
import AnalyticsService from 'services/analytics-service';
import LessonHelper from 'helpers/lesson-helper';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import TextHelper from 'helpers/text-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_next-dialog.scss';

var mapStateToProps = (state) => ({
  userId: SettingsHelper.State.getUser(state).id,
});

const MAX_LENGTH = 512;
const ratingOptions = [1, 2, 3];

@cssModule(styles, { allowMultiple: true })
export class NextDialog extends React.Component {
  static displayName = 'concepts/_next-dialog';

  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    title: PropTypes.string.isRequired,
    button: PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      openInNew: PropTypes.bool,
    }),
    bodyTitle: PropTypes.string,
    currentContent: PropTypes.object,
    customPrompt: PropTypes.string,
    hideTextInput: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object,
    root: PropTypes.object,
  };

  static defaultProps = {
    isOpen: false,
    onRequestClose: _.noop,
    bodyTitle: null,
    summary: null,
    currentContent: {},
    customPrompt: '',
  };

  state = {
    rating: null,
    suggestions: '',
    hoverRating: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      this.trackEventAnalytics('Displayed', { cta_type: 'modal' });
    }
  }

  trackEventAnalytics = (action, data) => {
    const {
      root,
      root: { key, version, locale },
    } = this.context;
    const { currentContent, userId } = this.props;
    const currentContentType = SemanticTypes.isNanodegree(root)
      ? 'Nanodegree'
      : 'Course';
    const keyName = currentContentType.toLowerCase() + '_key';

    const baseAnalytics = {
      user_id: userId,
      lesson_key: currentContent.key,
      content_version: version,
      locale,
      feedback_version: '1.0',
      scale: 3,
      lesson_type: LessonHelper.getLessonType(currentContent),
    };

    baseAnalytics[keyName] = key;

    AnalyticsService.track(
      `${currentContentType} Lesson Feedback ${action}`,
      _.extend({}, baseAnalytics, data)
    );
  };

  handleButtonClick = (evt) => {
    const { button, onRequestClose } = this.props;

    const { rating, suggestions } = this.state;
    evt.preventDefault();

    this.trackEventAnalytics('Submitted', {
      rating,
      suggestions: suggestions || null,
    });

    if (button.openInNew) {
      window.open(button.url, '_new');
      onRequestClose();
    } else {
      this.context.router.push(button.url);
    }
  };

  handleRatingClick = (rating) => {
    this.setState({
      rating,
      hoverRating: null,
    });
  };

  handleSuggestionsChange = (e) => {
    const suggestions = _.truncate(e.target.value, { length: MAX_LENGTH });

    this.setState({
      suggestions,
    });
  };

  handleRatingHover = (rating) => {
    this.setState({
      hoverRating: rating,
    });
  };

  _getReactionStyle = (reaction) => {
    const { hoverRating, rating } = this.state;

    if (hoverRating && hoverRating === reaction) {
      return `reaction-${reaction}-hover`;
    } else if (rating && rating !== reaction) {
      return `reaction-${reaction}-small`;
    } else if (rating === reaction || !rating) {
      return `reaction-${reaction}-active`;
    } else {
      return `reaction-${reaction}`;
    }
  };

  handleReactionMouseOut = () => {
    this.setState({
      hoverRating: null,
    });
  };

  _createReactionComponent = (reactionNumber) => {
    return (
      <a
        href="#"
        key={reactionNumber}
        styleName={this._getReactionStyle(reactionNumber)}
        onClick={() => this.handleRatingClick(reactionNumber)}
        onMouseEnter={() => this.handleRatingHover(reactionNumber)}
        onMouseOut={this.handleReactionMouseOut}
        onFocus={() => this.handleRatingHover(reactionNumber)}
        onBlur={this.handleReactionMouseOut}
      >
        {reactionNumber}
      </a>
    );
  };

  _renderFeedbackDialog = () => {
    const {
      title,
      bodyTitle,
      bodyText,
      button: { label },
      customPrompt,
    } = this.props;
    const { rating, suggestions } = this.state;

    const feedbackDialog = (
      <div>
        <div styleName="header">
          <h2 styleName="title-intro">{__('You just completed')}</h2>
          <h2 styleName="title">{title}</h2>
        </div>
        <div styleName="body" className={TextHelper.directionClass(bodyText)}>
          <StaticContentPlaceholder placeholder={null}>
            <div>
              <h1 styleName="body-header">
                {customPrompt || __('How was it?')}
              </h1>
              <div styleName="reactions">
                {_.map(ratingOptions, (rating) =>
                  this._createReactionComponent(rating)
                )}
              </div>
              {rating ? (
                <div styleName="text-input">
                  <TextArea
                    id="suggested-improvements"
                    label={__('Suggested Improvements')}
                    hiddenLabel
                    onChange={this.handleSuggestionsChange}
                    value={suggestions}
                    placeholder={__('(Optional) Suggest improvements...')}
                  />
                  <div styleName="characters-remaining">
                    {suggestions.length > 500
                      ? `Characters remaining: ${
                          MAX_LENGTH - suggestions.length
                        }`
                      : null}
                  </div>
                </div>
              ) : null}
              <hr />
            </div>
          </StaticContentPlaceholder>
          <div styleName="feedback-next-up">
            <div styleName="next-lesson-info">
              <div styleName="next-up">{__('Next up')}</div>
              <h2 styleName="body-title">{bodyTitle}</h2>
            </div>
            <Button
              variant="primary"
              onClick={this.handleButtonClick}
              label={rating ? __('Send and continue') : label}
            />
          </div>
        </div>
      </div>
    );

    return feedbackDialog;
  };

  render() {
    const { isOpen, onRequestClose } = this.props;

    return (
      <Modal
        open={isOpen}
        onClose={onRequestClose}
        label={__('Lab Complete')}
        closeLabel={__('Close Modal')}
      >
        {this._renderFeedbackDialog()}
      </Modal>
    );
  }
}

export default connect(mapStateToProps, null)(NextDialog);
