import React from 'react';
import _t from 'i18n!nls/course-item-resource-panel';
import PropTypes from 'prop-types';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import { TrackedButton } from 'bundles/common/components/withSingleTracked';
import { ShimmerSentence } from 'bundles/course-item-resource-panel/__components/ShimmerLib';
import type { ForumItemProps, ForumsProps } from './__types__';
import ForumPanelItem, { ShimmerState as ForumPanelItemShimmerState } from './__components/ForumsPanelItem';
import 'css!./__styles__/index';
import { assignmentForumURI } from '../../../helpers';
import Modal from '../../../__components/Modal';
import SectionDivider from '../../../__components/SectionDivider';
import ButtonViewAllDiscussions from '../../../__components/ButtonViewAllDiscussions';
import ResourcePanelForumThread from '../../../ResourcePanelForumThread';
import { CourseForumsByItemId } from '../../../__providers__/ForumIdFromItemIdDataProvider';

type ForumsPanelState = {
  open: boolean;
  activeForum: ForumItemProps;
};

export function ShimmerState() {
  return (
    <div className="rc-ForumsPanelItem">
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li className="rc-forumItemListElement" key="forumItem-1">
          <button type="button" className="rc-forumItemListElement_button">
            <ForumPanelItemShimmerState />
          </button>
        </li>
        <li className="rc-forumItemListElement" key="forumItem-2">
          <button type="button" className="rc-forumItemListElement_button">
            <ForumPanelItemShimmerState />
          </button>
        </li>
        <li className="rc-forumItemListElement" key="forumItem-3">
          <button type="button" className="rc-forumItemListElement_button">
            <ForumPanelItemShimmerState />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default class ForumsPanel extends React.Component<ForumsProps, ForumsPanelState> {
  state = {
    open: false,
    activeForum: {
      forumId: '',
      title: '',
      forumPostId: '',
    } as ForumItemProps,
  };

  static contextTypes = {
    itemId: PropTypes.string,
    courseId: PropTypes.string,
    courseSlug: PropTypes.string,
  };

  constructor(props: ForumsProps) {
    super(props);
    this.forumItems.bind(this);
  }

  setOpen = (openState: boolean) => {
    this.setState({ open: openState });
  };

  setActiveForum = (forumItem: ForumItemProps) => {
    this.setState({ activeForum: forumItem });
  };

  handleClickOpen = (item: ForumItemProps) => {
    this.setOpen(true);
    this.setActiveForum(item);
  };

  handleClose = () => {
    this.setOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInputKeyDown = (event: any, item: ForumItemProps) => {
    if (event.keyCode === 13) {
      this.handleClickOpen(item);
    }
  };

  forumItems = () => {
    let response = [] as JSX.Element[];

    if (this.props && this.props.forumItems && Array.isArray(this.props.forumItems)) {
      if (this.props.forumItems.length === 0) {
        response = [<li>{_t('Have a question? Go to discussion forums to find answers or talk with your peers.')}</li>];
      } else {
        response = this.props.forumItems.map((item: ForumItemProps) => (
          // eslint-disable-next-line react/no-array-index-key,jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
          <li
            className="rc-forumItemListElement"
            key={`forumItem-${item.forumPostId}`}
            onClick={() => this.handleClickOpen(item)}
            onKeyDown={(event) => this.handleInputKeyDown(event, item)}
          >
            <span className="rc-forumItemListElement_button">
              <TrackedButton
                trackingName="resource_panel_forum_posts_tab_body_item"
                trackingData={{ forumPostId: item.forumPostId }}
                size="zero"
                type="noStyle"
              >
                <ForumPanelItem {...item} />
              </TrackedButton>
            </span>
          </li>
        ));
      }
    }
    return response;
  };

  getForumPostId = () => {
    if (this.state.activeForum?.forumPostId) {
      return this.state.activeForum?.forumPostId;
    }
    return '';
  };

  render() {
    const forumQuestionId = this.getForumPostId();

    return (
      <span>
        {this.state.open && forumQuestionId && (
          <Modal
            handleClose={this.handleClose}
            modalName="resourcePanelModal"
            trackingName="resource_panel_forum_posts_tab_body_item_modal"
            data={{ forumPostId: forumQuestionId }}
          >
            <ResourcePanelForumThread
              userId={this.context.userId}
              courseId={this.context.courseId}
              forumQuestionId={forumQuestionId}
            />
          </Modal>
        )}
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 0 }}>{this.forumItems()}</ul>
        <div style={{ padding: '0px 16px' }}>
          <div style={{ margin: '0 0 24px 0' }}>
            <SectionDivider />
          </div>
          <CourseForumsByItemId id={this.context.courseId} itemId={this.context.itemId}>
            {({ loading, error, data }) => {
              if (loading) {
                return <ShimmerSentence width="90%" />;
              }

              if (error) {
                return null;
              }

              if (data && Array.isArray(data) && data.length > 0) {
                const [first] = data; // first is confirmed by the above condition

                return (
                  <TrackedA
                    href={assignmentForumURI({ courseSlug: this.context.courseSlug, forumId: first.id })}
                    target="_blank"
                    trackingName="resource_panel_view_all_discussions_button"
                  >
                    <ButtonViewAllDiscussions />
                  </TrackedA>
                );
              }
              return null;
            }}
          </CourseForumsByItemId>
        </div>
      </span>
    );
  }
}
