/* @jsx jsx */
import { jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Button, withTheme } from '@coursera/cds-core';
import { MoreHorizontalFilledIcon } from '@coursera/cds-icons';
import $ from 'jquery';
import URI from 'jsuri';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { compose } from 'recompose';
import path from 'js/lib/path';
import {
  showAdminDetails,
  hideAdminDetails,
  showReplyEditor,
  highlightPost,
  unhighlightPost,
} from 'bundles/discussions/actions/DropdownActions';
import Delete from 'bundles/discussions/components/Delete';
import EditThreadModal from 'bundles/discussions/components/forumsV2-ForumThreads/__components/ModerationDropdown/EditThreadModal';
import EditWithModerationModal from 'bundles/discussions/components/EditWithModerationModal';
import FlaggingModal from 'bundles/discussions/components/FlaggingModal';
import ShareModal from 'bundles/discussions/components/ShareModal';
import HighlightModal from 'bundles/discussions/components/HighlightModal';
import ProgrammingPermissionsUtils from 'bundles/programming/utils/ProgrammingPermissionsUtils';
import groupAuthorizationPromise from 'pages/open-course/common/promises/groupAuthorizationPromise';
import type OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import type OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import type GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import areHighlightedPostsEnabled from 'bundles/discussions/utils/areHighlightedPostsEnabled';
import { getLearnerDetailedViewLink } from 'bundles/discussions/utils/discussionsUrl';
import type { Contributor } from 'bundles/discussions/lib/types';
import { getDiscussionsPersonalizationVariant } from 'bundles/course-v2/featureFlags';
import _t from 'i18n!nls/discussions';
import { isOutsourcing } from 'bundles/outsourcing/utils';
import user from 'js/lib/user';
import { rootPath } from 'pages/open-course/common/constants';
import type { ForumPostWithCreator } from '../../__providers__/ForumPostDataProvider/__types__';

const escKeyCode = 27;

type PropsFromCaller = {
  creator: Contributor;
  post: ForumPostWithCreator;
  onDeleteSuccess: () => {};
  isHighlighted: boolean;
  forumLink: string;
  isGradedDiscussionPrompt: boolean;
  courseSlug: string;
  courseId: string;
  userId: number;
  hasModerationRole: boolean;
  currentForum: OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;
  ariaDescribedBy: string;
  theme: Theme;
  showingAdminDetails: boolean;
};

type PropsFromStore = {
  hasTeachingRole: boolean;
  isProgrammingItem: boolean;
  itemId?: string;
  isSuperuser: boolean;
  authenticated: boolean;
  question: ForumPostWithCreator;
};

type PropsToComponent = PropsFromCaller & PropsFromStore;

type State = {
  expandDropdown: boolean;
  showDeleteModal: boolean;
  canModerate: boolean;
  showEditThreadModal: boolean;
  showEditWithModerationModal: boolean;
  showShareModal: boolean;
  showHighlightModal: boolean;
  showFlaggingModal: boolean;
};

class ModerationDropdown extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isGradedDiscussionPrompt: false,
  };

  _isMounted = false;

  node;

  styles = {
    dropdownStyle: {},
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      expandDropdown: false,
      showDeleteModal: false,
      canModerate: false,
      showEditThreadModal: false,
      showEditWithModerationModal: false,
      showShareModal: false,
      showHighlightModal: false,
      showFlaggingModal: false,
    };

    this.styles.dropdownStyle = {
      position: 'absolute',
      border: `1px solid ${this.props.theme.palette.gray[500]}`,
      borderRadius: '4px',
      maxWidth: '200px',
      backgroundColor: this.props.theme.palette.white,
      listStyle: 'none',
      padding: 0,
      zIndex: 1,
      '& button': {
        width: '100%',
        justifyContent: 'left',
      },
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
    executeAction(showAdminDetails, { post });
    this.closeDropdown();
  };

  hideAdminDetails = () => {
    const { executeAction } = this.context;
    const { post } = this.props;
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
  showEditReply(reason?, dontNotify?) {
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
      showingAdminDetails,
      courseSlug,
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
    } = this.state;

    const { forumType } = post;
    const isQuestion = post.type === 'question';
    const postedByUser = creator.userId === userId;
    const questionPostedByUser = question && question.creatorId === userId;
    const hasProgrammingAdminPermissions = ProgrammingPermissionsUtils.hasAdminPrivileges(hasTeachingRole);
    const ariaLabel = creator.fullName
      ? _t(`Settings Menu for #{userName}'s post`, { userName: creator.fullName })
      : _t('Settings Menu');

    const controlVariant = getDiscussionsPersonalizationVariant();

    const forumAllThreadsSearchLinkCheck = forumLink.includes('discussions/all') && controlVariant !== 'control';
    const forumLinkPath = window.location.pathname;
    const rootForumId = forumLinkPath.split('/')[5];
    const rootForumLink = path.join(rootPath ?? [], `${courseSlug}/discussions/forums/${rootForumId}`);
    const forumLinkToUse = forumAllThreadsSearchLinkCheck ? rootForumLink : forumLink;

    return (
      <div
        className="rc-forumsV2_ModerationDropdown"
        css={{ display: 'inline-block' }}
        ref={(node) => {
          this.node = node;
        }}
      >
        <Button
          variant="ghost"
          type="button"
          size="small"
          aria-haspopup="true"
          aria-expanded={expandDropdown}
          aria-label={ariaLabel}
          onClick={this.openDropdown}
          icon={<MoreHorizontalFilledIcon size="small" />}
          iconPosition="before"
        >
          {_t('More')}
        </Button>
        {expandDropdown && (
          <ul css={this.styles.dropdownStyle}>
            {(postedByUser || canModerate) && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="edit"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.onEditClick}
                >
                  {_t('Edit')}
                </Button>
              </li>
            )}

            {(postedByUser || canModerate) && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="delete"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showDeleteModal}
                >
                  {_t('Delete')}
                </Button>
              </li>
            )}

            {!postedByUser && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="flag"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.onFlaggingClick}
                >
                  {post.flagDetails && post.flagDetails.isActive ? _t('Resolve report') : _t('Report this')}
                </Button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser) && showingAdminDetails && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="userId"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.hideAdminDetails}
                >
                  {_t('Hide User ID')}
                </Button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser || isOutsourcing(user)) && !showingAdminDetails && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="userId"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showAdminDetails}
                >
                  {_t('Show User ID')}
                </Button>
              </li>
            )}

            {(hasTeachingRole || isSuperuser || isOutsourcing(user)) && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="userId"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showUserGrades}
                >
                  {_t('View User Grades')}
                </Button>
              </li>
            )}

            {isProgrammingItem && hasProgrammingAdminPermissions && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="viewSubmissions"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.showSubmissions}
                >
                  {_t('View submissions')}
                </Button>
              </li>
            )}

            {!isGradedDiscussionPrompt && (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  data-js="share"
                  aria-describedby={ariaDescribedBy}
                  onClick={this.onShareClick}
                >
                  {_t('Link to Post')}
                </Button>
              </li>
            )}

            {!isQuestion &&
              (canModerate || isSuperuser || questionPostedByUser) &&
              areHighlightedPostsEnabled(courseId, forumType) && (
                <li>
                  <Button
                    variant="ghost"
                    type="button"
                    data-js="highlight"
                    aria-describedby={ariaDescribedBy}
                    onClick={() => {
                      this.setState({ showHighlightModal: true });
                      this.closeDropdown();
                    }}
                  >
                    {!isHighlighted ? _t('Mark as highlighted') : _t('Unmark as highlighted')}
                  </Button>
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
            // @ts-ignore
            handleSuccess={this.editWithModerationModalSuccess}
            handleCancel={() => this.setState({ showEditWithModerationModal: false })}
          />
        )}

        {showFlaggingModal && (
          <FlaggingModal post={post} handleClose={() => this.setState({ showFlaggingModal: false })} />
        )}

        {showShareModal && (
          <ShareModal
            post={post}
            forumLink={forumLinkToUse}
            handleClose={() => this.setState({ showShareModal: false })}
          />
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

export default compose<$TSFixMe, $TSFixMe>(
  discussionsForumsHOC({ fields: ['forumType'] }),
  connectToRouter(routerConnectToCurrentForum),
  connectToStores<PropsToComponent, PropsFromCaller>(
    ['CourseMembershipStore', 'CourseStore', 'ApplicationStore', 'ThreadDetailsStore'],
    ({ CourseMembershipStore, CourseStore, ApplicationStore, ThreadDetailsStore }, { currentForum, post }) => {
      const { questionId } = post;
      const itemId = currentForum && currentForum.forumType.definition.itemId;

      const itemMetadata = !!itemId && CourseStore.getMaterials().getItemMetadata(itemId);
      const maybeContentType = itemMetadata && itemMetadata.getTypeName();
      const isProgrammingItem = _.includes(['gradedProgramming', 'ungradedProgramming'], maybeContentType);

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
)(withTheme(ModerationDropdown));

export const BaseComponent = ModerationDropdown;
