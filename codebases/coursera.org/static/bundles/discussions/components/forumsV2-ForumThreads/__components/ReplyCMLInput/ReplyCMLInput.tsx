import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

import PropTypes from 'prop-types';

import React from 'react';
import classNames from 'classnames';
import ForumsCmlEditor from 'bundles/discussions/components/ForumsCmlEditor';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';
import { DTD_NAME, savingStates } from 'bundles/discussions/constants';
import { TrackedButton } from 'bundles/common/components/withSingleTracked';
import generateReplyData from 'bundles/discussions/utils/generateReplyData';
import type OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import type OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import type GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import type { CmlContent } from 'bundles/cml/types/Content';
import type { ForumPostWithCreator } from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/__types__';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/ReplyCMLInput';

type Props = {
  parentPost: ForumPostWithCreator;
  savingState: string;
  shouldFocusReplyEditor: boolean;
  placeholder: string;
  ariaLabel: string;
  ariaDescribedBy: string;
  currentForum: OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;
  forumType: string;
  courseId: string;
  contextId: string;
  question: Record<string, any>; // TODO: make it more specific
  handleSubmit: (prop: Record<string, any>) => {}; // TODO: make it more specific
  defaultValue?: string;
};

type disabledPlugin = { id: number; run: any };

type State = {
  cml: CmlContent;
  hasErrors: boolean;
  submitEnabled: boolean;
  disabledPlugins: Array<disabledPlugin>;
  editorKey: number;
  isFollowing: boolean;
  saved: boolean;
};

class ReplyCMLInput extends React.Component<Props, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    placeholder: _t('Add details for others to answer your question'),
    savingState: savingStates.UNCHANGED,
    defaultValue: '',
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.getDefaultState();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.savingState !== this.props.savingState) {
      if (nextProps.savingState === savingStates.SAVED) {
        const prevState = this.state;
        this.setState(() =>
          Object.assign(this.getDefaultState(), {
            editorKey: prevState.editorKey + 1,
          })
        );
      }
    }

    if (nextProps.question && nextProps.question.isFollowing !== this.state.isFollowing) {
      this.setState({ isFollowing: nextProps.question.isFollowing });
    }
  }

  getDefaultState() {
    // Always show the toolbar unless this is a comment.
    const disabledPlugins = [] as Array<disabledPlugin>;
    const { question } = this.props;
    return {
      cml: CMLUtils.create(this.props.defaultValue, DTD_NAME),
      hasErrors: false,
      submitEnabled: false,
      disabledPlugins,
      editorKey: 1,
      isFollowing: question && question.isFollowing,
      saved: false,
    };
  }

  handleInputChange = (cml) => {
    const hasErrors = !DiscussionsCMLUtils.validateLength(cml);
    const submitEnabled = true;

    this.setState({ cml, hasErrors, submitEnabled });
  };

  handleSubmit = () => {
    const { cml, isFollowing } = this.state;
    const { parentPost, contextId, currentForum, question } = this.props;

    const forumType = (currentForum && currentForum.forumType.typeName) || this.props.forumType;
    const options = generateReplyData(parentPost, contextId, cml, forumType, isFollowing);

    this.props.handleSubmit({
      options,
      question,
      parentPost,
      forumType,
      isFollowing,
    });

    this.setState({ submitEnabled: false, saved: true });
  };

  handleFollow = (isFollowing) => {
    this.setState({ isFollowing });
  };

  render() {
    const { parentPost, courseId, placeholder, ariaLabel, ariaDescribedBy, savingState } = this.props;
    const { cml, editorKey, submitEnabled, hasErrors } = this.state;

    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(cml);

    const submitError = (
      <div className="c-error-text c-form-error-message">
        {_t('Something went wrong. Please reload the page and try again.')}
      </div>
    );

    const classes = classNames('rc-ForumsV2__ReplyCML', 'flex-1');
    const questionIdParts = stringKeyToTuple(parentPost.forumQuestionId || '');
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
          />
        </div>

        {!this.state.saved && !!contentLengthWarning && (
          <div className="horizontal-box align-items-right" style={{ marginBottom: 20 }}>
            {contentLengthWarning}
          </div>
        )}

        {savingState === savingStates.ERROR && (
          <div className="horizontal-box align-items-right" style={{ marginBottom: 20 }}>
            {submitError}
          </div>
        )}

        {!this.state.saved && (
          <div className="horizontal-box align-items-right align-items-vertical-center">
            <TrackedButton
              trackingName="thread_reply"
              size="sm"
              type="primary"
              onClick={this.handleSubmit}
              disabled={!submitEnabled || hasErrors}
            >
              {_t('Reply')}
            </TrackedButton>
          </div>
        )}
      </div>
    );
  }
}

export default ReplyCMLInput;
