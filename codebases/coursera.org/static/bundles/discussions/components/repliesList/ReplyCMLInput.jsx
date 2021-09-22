import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

/* eslint-disable react/no-find-dom-node, react/no-string-refs, react/sort-comp */

import PropTypes from 'prop-types';

import React from 'react';
import classNames from 'classnames';

import ReplyFollow from 'bundles/discussions/components/repliesList/ReplyFollow';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';
import { DTD_NAME, savingStates } from 'bundles/discussions/constants';
import TrackedButton from 'bundles/page/components/TrackedButton';
import _uniqueId from 'lodash/uniqueId';
import generateReplyData from 'bundles/discussions/utils/generateReplyData';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import ForumsCmlEditor from 'bundles/discussions/components/ForumsCmlEditor';

import _t from 'i18n!nls/discussions';
import 'css!./__styles__/ReplyCMLInput';

class ReplyCMLInput extends React.Component {
  static propTypes = {
    parentPost: PropTypes.object.isRequired,
    savingState: PropTypes.string.isRequired,
    shouldFocusCounter: PropTypes.number,
    placeholder: PropTypes.string,
    ariaLabel: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
    currentForum: PropTypes.oneOfType([
      PropTypes.instanceOf(OnDemandCourseForumsV1),
      PropTypes.instanceOf(OnDemandMentorForumsV1),
      PropTypes.instanceOf(GroupForumsV1),
    ]),
    forumType: PropTypes.string,
    courseId: PropTypes.string,
    contextId: PropTypes.string,
    question: PropTypes.object,
    hideFollow: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    get placeholder() {
      return _t('Reply');
    },
    savingState: savingStates.UNCHANGED,
  };

  constructor(props, context) {
    super(props, context);
    this.replyButtonId = _uniqueId('thread_reply_button_');
    this.state = this.getDefaultState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.savingState !== this.props.savingState) {
      if (nextProps.savingState === savingStates.SAVED) {
        this.setState(
          Object.assign(this.getDefaultState(), {
            editorKey: this.state.editorKey + 1,
          })
        );
      } else if (nextProps.savingState === savingStates.ERROR) {
        // do nothing
      }
    }

    if (this.props.shouldFocusCounter < nextProps.shouldFocusCounter) {
      this.setFocus();
    }

    if (nextProps.question && nextProps.question.isFollowing !== this.state.isFollowing) {
      this.setState({ isFollowing: nextProps.question.isFollowing });
    }
  }

  getDefaultState() {
    // Always show the toolbar unless this is a comment.
    const disabledPlugins = [];
    const { question, parentPost } = this.props;

    return {
      cml: CMLUtils.create('', DTD_NAME),
      hasErrors: false,
      submitEnabled: false,
      disabledPlugins,
      focus: false,
      editorKey: 1,
      isFollowing: question && question.isFollowing,
      firstFocus: false,
    };
  }

  setFocus = () => {
    this.setState({ isFocused: true });

    if (typeof window !== 'undefined') {
      // manually set focus on the reply editor at the bottom of the page.
      // this is very temporary until we use forumsV2 which moves the reply container
      // right below the button and we don't need this focus
      document.querySelector('.reply-container .rc-ReplyCML .editor-container div[data-slate-editor="true"]').focus();
    }
  };

  removeFocus = () => {
    this.setState({ isFocused: false });
  };

  // this additional state variable is required to initially hide the Reply Follow component
  // and only after first focus, determine if it should be shown or not.
  handleFirstFocus = () => {
    this.setState({ firstFocus: true });
  };

  handleInputChange = (cml) => {
    const hasErrors = !DiscussionsCMLUtils.validateLength(cml);
    const submitEnabled = true;

    this.setState({ cml, hasErrors, submitEnabled });
  };

  handleSubmit = () => {
    const { cml, isFollowing, hasErrors } = this.state;
    const { parentPost, contextId, currentForum, question } = this.props;

    if (hasErrors) {
      this.setFocus();
      return;
    }

    const forumType = (currentForum && currentForum.forumType.typeName) || this.props.forumType;
    const options = generateReplyData(parentPost, contextId, cml, forumType, isFollowing);

    this.props.handleSubmit({
      options,
      question,
      parentPost,
      forumType,
      isFollowing,
    });

    this.setState({ submitEnabled: false });
  };

  handleFollow = (isFollowing) => {
    this.setState({ isFollowing });
  };

  render() {
    const {
      parentPost,
      question,
      courseId,
      placeholder,
      ariaLabel,
      ariaDescribedBy,
      savingState,
      hideFollow,
    } = this.props;
    const { cml, firstFocus, isFollowing, editorKey, submitEnabled, hasErrors } = this.state;
    const replyButtonId = this.replyButtonId;

    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(cml);

    const submitError = (
      <div className="c-error-text c-form-error-message">
        {_t('Something went wrong. Please reload the page and try again.')}
      </div>
    );

    const classes = classNames('rc-ReplyCML', 'flex-1');
    const questionIdParts = stringKeyToTuple(parentPost.questionId || '');
    const questionId = questionIdParts[questionIdParts.length - 1];
    const imageUploadOptions = DiscussionsCMLUtils.getImageUploadOptions(courseId, questionId);

    return (
      <div className={classes}>
        <div className="editor-container">
          <ForumsCmlEditor
            cml={cml}
            key={editorKey}
            placeholder={placeholder}
            imageUploadOptions={imageUploadOptions}
            ariaLabel={ariaLabel || _t('Post Reply')}
            ariaDescribedBy={ariaDescribedBy}
            onChange={this.handleInputChange}
            onFocus={this.handleFirstFocus}
            onBlur={this.removeFocus}
            focusOnLoad={false}
          />
        </div>

        {!!contentLengthWarning && (
          <div className="horizontal-box align-items-right" style={{ marginBottom: 20 }}>
            {contentLengthWarning}
          </div>
        )}

        {savingState === savingStates.ERROR && (
          <div className="horizontal-box align-items-right" style={{ marginBottom: 20 }}>
            {submitError}
          </div>
        )}

        <div className="horizontal-box align-items-right align-items-vertical-center">
          <div className="flex-1">
            {firstFocus && !hideFollow && question && (
              <ReplyFollow checked={isFollowing} onChange={this.handleFollow} />
            )}
          </div>

          <TrackedButton
            id={replyButtonId}
            ref="submit"
            className="secondary"
            onClick={this.handleSubmit}
            trackingName="thread_reply"
            disabled={!submitEnabled || hasErrors}
          >
            {_t('Reply')}
          </TrackedButton>
        </div>
      </div>
    );
  }
}

export default ReplyCMLInput;
