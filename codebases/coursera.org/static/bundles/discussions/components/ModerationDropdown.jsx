import $ from 'jquery';
import URI from 'jsuri';
import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import {
  showAdminDetails,
  hideAdminDetails,
  showReplyEditor,
  highlightPost,
  unhighlightPost,
} from 'bundles/discussions/actions/DropdownActions';
import Delete from 'bundles/discussions/components/Delete';
import EditThreadModal from 'bundles/discussions/components/EditThreadModal';
import EditWithModerationModal from 'bundles/discussions/components/EditWithModerationModal';
import FlaggingModal from 'bundles/discussions/components/FlaggingModal';
import ShareModal from 'bundles/discussions/components/ShareModal';
import HighlightModal from 'bundles/discussions/components/HighlightModal';
import ProgrammingPermissionsUtils from 'bundles/programming/utils/ProgrammingPermissionsUtils';
import groupAuthorizationPromise from 'pages/open-course/common/promises/groupAuthorizationPromise';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import areHighlightedPostsEnabled from 'bundles/discussions/utils/areHighlightedPostsEnabled';
import { getLearnerDetailedViewLink } from 'bundles/discussions/utils/discussionsUrl';
import _t from 'i18n!nls/discussions';
import { isOutsourcing } from 'bundles/outsourcing/utils';
import user from 'js/lib/user';
import 'css!./__styles__/ModerationDropdown';

const escKeyCode = 27;

class ModerationDropdown extends React.Component {
  static propTypes = {
    creator: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    hasTeachingRole: PropTypes.bool,
    onDeleteSuccess: PropTypes.func,
    isProgrammingItem: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    forumLink: PropTypes.string,
    isGradedDiscussionPrompt: PropTypes.bool,
    courseSlug: PropTypes.string,
    courseId: PropTypes.string,
    userId: PropTypes.number,
    authenticated: PropTypes.bool,
    isSuperuser: PropTypes.bool,
    hasModerationRole: PropTypes.bool,
    itemId: PropTypes.string,
    question: PropTypes.object,
    currentForum: PropTypes.oneOfType([
      PropTypes.instanceOf(OnDemandCourseForumsV1),
      PropTypes.instanceOf(OnDemandMentorForumsV1),
      PropTypes.instanceOf(GroupForumsV1),
    ]),
    ariaDescribedBy: PropTypes.string,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isGradedDiscussionPrompt: false,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      expandDropdown: false,
      showDeleteModal: false,
      canModerate: false,
      showAdminDetailsToggle: false,
      showEditThreadModal: false,
      showEditWithModerationModal: false,
      showShareModal: false,
      showHighlightModal: false,
    };
  }

  componentWillMount() {
    const { authenticated, isSuperuser, currentForum, hasModerationRole } = this.props;

    const groupId = currentForum && currentForum.forumType.definition.groupId;
    if (groupId) {
      groupAuthorizationPromise(groupId, authenticated, isSuperuser).then((result) => {
        if (this._isMounted) {
          this.setState(result);
        }
      });
    } else {
      this.setState({ canModerate: hasModerationRole || isOutsourcing(user) });
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onEditClick = () => {
    const { creator, userId, post } = this.props;
    const postedByUser = creator.userId === userId;

    if (!postedByUser && post.type !== 'question') {
      this.showEditWithModerationModal();
    } else {
      this.showEdit();
    }
  };

  onFlaggingClick = () => {
    this.setState({ showFlaggingModal: true });
    this.closeDropdown();
  };

  onShareClick = () => {
    this.setState({ showShareModal: true });
    this.closeDropdown();
  };

  closeOnOutsideClick = (e) => {
    if ($(this.node).find($(e.target)).length <= 0) {
      this.closeDropdown();
    }
  };

  closeOnEscapeKey = (e) => {
    if (e.keyCode === escKeyCode) {
      this.closeDropdown();
    }
  };

  showAdminDetails = () => {
    const { executeAction } = this.context;
    const { post } = this.props;
    this.setState({ showAdminDetailsToggle: true });
    executeAction(showAdminDetails, { post });
    this.closeDropdown();
  };

  hideAdminDetails = () => {
    const { executeAction } = this.context;
    const { post } = this.props;
    this.setState({ showAdminDetailsToggle: false });
    executeAction(hideAdminDetails, { post });
    this.closeDropdown();
  };

  showUserGrades = () => {
    const { post } = this.props;
    window.open(getLearnerDetailedViewLink(post.creatorId), '_blank');
  };

  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
    this.closeDropdown();
  };

  editWithModerationModalSuccess = (reason, dontNotify) => {
    this.setState({ showEditWithModerationModal: false });
    this.showEditReply(reason, dontNotify);
  };

  closeDropdown() {
    this.setState({ expandDropdown: false });
    $('body').off('click', this.closeOnOutsideClick);
    $('body').off('keydown', this.closeOnEscapeKey);
  }

  openDropdown = () => {
    this.setState({ expandDropdown: true });
    $('body').on('click', this.closeOnOutsideClick);
    $('body').on('keydown', this.closeOnEscapeKey);
  };

  showEdit = () => {
    const { post } = this.props;
    if (post.type === 'question') {
      this.showEditQuestion();
    } else {
      this.showEditReply();
    }

    this.closeDropdown();
  };

  // Edit Question
  showEditQuestion() {
    this.setState({ showEditThreadModal: true });
  }

  // Edit Answer & Comment
  showEditReply(reason, dontNotify) {
    const { executeAction } = this.context;
    const { post } = this.props;
    executeAction(showReplyEditor, {
      reply: post,
      reason,
      dontNotify,
    });
  }

  // Edit Moderator Modal
  showEditWithModerationModal() {
    this.setState({ showEditWithModerationModal: true });
    this.closeDropdown();
  }

  showSubmissions = () => {
    const { post, courseSlug, itemId, courseId } = this.props;
    const submissionUrl = new URI(
      `/teach/${courseSlug}/grading/assignment-grading/${itemId}/submission/${post.creatorId}`
    )
      // Note: always use base branch as versionId. use courseBranchId when PARTNER-11638 is resolved
      .addQueryParam('versionId', courseId)
      .toString();

    window.open(submissionUrl, '_blank');

    this.closeDropdown();
  };

  render() {
    const {
      post,
      userId,
      forumLink,
      courseId,
      question,
      creator,
      hasTeachingRole,
      isSuperuser,
      isProgrammingItem,
      isHighlighted,
      onDeleteSuccess,
      isGradedDiscussionPrompt,
      ariaDescribedBy,
    } = this.props;

    const {
      expandDropdown,
      showDeleteModal,
      showEditThreadModal,
      showEditWithModerationModal,
      showFlaggingModal,
      showShareModal,
      showHighlightModal,
      canModerate,
      showAdminDetailsToggle,
    } = this.state;

    const { forumType } = post;
    const isQuestion = post.type === 'question';
    const postedByUser = creator.userId === userId;
    const questionPostedByUser = question && question.creatorId === userId;
    const hasProgrammingAdminPermissions = ProgrammingPermissionsUtils.hasAdminPrivileges(hasTeachingRole);
    const ariaLabel = creator.fullName
      ? _t(`Settings Menu for #{userName}'s post`, { userName: creator.fullName })
      : _t('Settings Menu');

    return (
      <div
        className="rc-Dropdown align-self-start c-dropdown-position"
        ref={(node) => {
          this.node = node;
        }}
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={expandDropdown}
          aria-label={ariaLabel}
          onClick={this.openDropdown}
        >
          <i className="cif-chevron-down c-dropdown-chevron" />
        </button>

        {expandDropdown && (
          <ul className="styleguide dropdown">
            {(postedByUser || canModerate) && (
              <li>
                <button type="button" data-js="edit" aria-describedby={ariaDescribedBy} onClick={this.onEditClick}>
                  {_t('Edit')}
                </button>
              </li>
            )}

            {(postedByUser || canModerate) && (
              <li>
                <button
                  type="button"
                  data-js="delete"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showDeleteModal}
                >
                  {_t('Delete')}
                </button>
              </li>
            )}

            {!postedByUser && (
              <li>
                <button type="button" data-js="flag" aria-describedby={ariaDescribedBy} onClick={this.onFlaggingClick}>
                  {post.flagDetails && post.flagDetails.isActive ? _t('Resolve report') : _t('Report this')}
                </button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser) && showAdminDetailsToggle && (
              <li>
                <button
                  type="button"
                  data-js="userId"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.hideAdminDetails}
                >
                  {_t('Hide User ID')}
                </button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser || isOutsourcing(user)) && !showAdminDetailsToggle && (
              <li>
                <button
                  type="button"
                  data-js="userId"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showAdminDetails}
                >
                  {_t('Show User ID')}
                </button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser || isOutsourcing(user)) && (
              <li>
                <button type="button" data-js="userId" aria-describedby={ariaDescribedBy} onClick={this.showUserGrades}>
                  {_t('View User Grades')}
                </button>
              </li>
            )}

            {isProgrammingItem && hasProgrammingAdminPermissions && (
              <li>
                <button
                  type="button"
                  data-js="viewSubmissions"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showSubmissions}
                >
                  {_t('View submissions')}
                </button>
              </li>
            )}

            {!isGradedDiscussionPrompt && (
              <li>
                <button type="button" data-js="share" aria-describedby={ariaDescribedBy} onClick={this.onShareClick}>
                  {_t('Link to Post')}
                </button>
              </li>
            )}

            {!isQuestion &&
              (canModerate || isSuperuser || questionPostedByUser) &&
              areHighlightedPostsEnabled(courseId, forumType) && (
                <li>
                  <button
                    type="button"
                    data-js="highlight"
                    aria-describedby={ariaDescribedBy}
                    onClick={() => {
                      this.setState({ showHighlightModal: true });
                      this.closeDropdown();
                    }}
                  >
                    {!isHighlighted && _t('Mark as highlighted')}
                    {isHighlighted && _t('Unmark as highlighted')}
                  </button>
                </li>
              )}
          </ul>
        )}

        {showDeleteModal && (
          <Delete
            post={post}
            showReasons={!postedByUser}
            showNotifyUser={!isGradedDiscussionPrompt}
            onDeleteSuccess={onDeleteSuccess}
            handleClose={() => this.setState({ showDeleteModal: false })}
          />
        )}

        {showEditThreadModal && (
          <EditThreadModal
            question={post}
            courseId={courseId}
            showReasons={!postedByUser}
            handleClose={() => this.setState({ showEditThreadModal: false })}
          />
        )}

        {showEditWithModerationModal && (
          <EditWithModerationModal
            handleSuccess={this.editWithModerationModalSuccess}
            handleCancel={() => this.setState({ showEditWithModerationModal: false })}
          />
        )}

        {showFlaggingModal && (
          <FlaggingModal post={post} handleClose={() => this.setState({ showFlaggingModal: false })} />
        )}

        {showShareModal && (
          <ShareModal post={post} forumLink={forumLink} handleClose={() => this.setState({ showShareModal: false })} />
        )}

        {showHighlightModal && (
          <HighlightModal
            isHighlighted={isHighlighted}
            handleCancel={() => this.setState({ showHighlightModal: false })}
            handleAccept={() => {
              const { executeAction } = this.context;
              if (isHighlighted) {
                executeAction(unhighlightPost, { post });
              } else {
                executeAction(highlightPost, { post });
              }

              this.setState({ showHighlightModal: false });
            }}
          />
        )}
      </div>
    );
  }
}

export default _.compose(
  discussionsForumsHOC({ fields: ['forumType'] }),
  connectToRouter(routerConnectToCurrentForum),
  connectToStores(
    ['CourseMembershipStore', 'CourseStore', 'ApplicationStore', 'ThreadDetailsStore'],
    ({ CourseMembershipStore, CourseStore, ApplicationStore, ThreadDetailsStore }, { currentForum, post }) => {
      const { questionId } = post;
      const itemId = currentForum && currentForum.forumType.definition.itemId;

      const itemMetadata = !!itemId && CourseStore.getMaterials().getItemMetadata(itemId);
      const maybeContentType = itemMetadata && itemMetadata.getTypeName();
      const isProgrammingItem = _(['gradedProgramming', 'ungradedProgramming']).includes(maybeContentType);

      return {
        hasTeachingRole: CourseMembershipStore.hasTeachingRole(),
        isProgrammingItem,
        itemId,
        isSuperuser: ApplicationStore.isSuperuser(),
        authenticated: ApplicationStore.isAuthenticatedUser(),
        question: ThreadDetailsStore.getQuestion(questionId),
      };
    }
  )
)(ModerationDropdown);

export const BaseComponent = ModerationDropdown;
