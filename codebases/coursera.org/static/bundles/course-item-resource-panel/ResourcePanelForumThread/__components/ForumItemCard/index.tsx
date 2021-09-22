import React from 'react';
import CML from 'bundles/cml/components/CML';
import { CmlContent } from 'bundles/cml/types/Content';
import moment from 'moment';
import classNames from 'classnames';
import _t from 'i18n!nls/course-item-resource-panel';
import { SvgClose } from '@coursera/coursera-ui/svg';
import { TrackedSvgButton } from 'bundles/common/components/withSingleTracked';
import { AuthorProfile } from '../../__providers__/ForumPostDataProvider/__types__';
import ReplyButton from '../ReplyButton';
import ProfileAvatar from '../ProfileAvatar';
import 'css!./__styles__/ForumItemCard';
import LikeButtonWithData from '../../LikeButtonWithData';
import { shimmerColor, ShimmerParagraph, ShimmerSentence } from '../../../__components/ShimmerLib';

type State = {
  showEditor: boolean;
};

type Props = {
  title?: string;
  creator?: AuthorProfile;
  tags?: JSX.Element;
  cmlContent: CmlContent;
  isUpvoted: boolean;
  upvoteCount: number;
  replyCount?: number;
  createdAt?: number;
  forumQuestionId: string;
  courseId?: string;
  deepLink?: string;
};

class ForumItemCard extends React.Component<Props, State> {
  state = {
    showEditor: false,
  };

  get reply(): HTMLElement {
    return this._reply;
  }

  set reply(value: HTMLElement) {
    this._reply = value;
  }

  private _reply!: HTMLElement;

  toggleReply = (showEditor: boolean) => this.setState({ showEditor: !showEditor });

  render() {
    const { title, cmlContent, creator } = this.props;

    const showEditor = this.state.showEditor;

    return (
      <div className="ForumItemCard">
        {title && <h2 className="ForumItemCard__title">{title}</h2>}
        <div className="ForumItemCard__content">
          <span className="ForumItemCard__content__profile">
            {creator && <ContributorNameWithIcon fullName={creator.fullName} photoUrl={creator.photoUrl} />}
          </span>
          <span className="ForumItemCard__content__tags">{this.props.tags}</span>
          <span className="ForumItemCard__content__PostAge">
            {this.props.createdAt && <PostAge createdAt={this.props.createdAt} />}
          </span>
        </div>

        <div className="ForumItemCard__content__CML">
          <CML cml={cmlContent} />
        </div>

        <div className="ForumItemCard__content__responseControls">
          <span className="ForumItemCard__content__responseControls__controlContainer">
            <LikeButtonWithData
              ariaDescribedBy="like-button"
              upvotes={this.props.upvoteCount}
              isUpvoted={this.props.isUpvoted}
              forumQuestionId={this.props.forumQuestionId}
              creator={this.props.creator}
            />
          </span>
          {this.props.replyCount !== undefined && (
            <span className="ForumItemCard__content__responseControls__controlContainer">
              <ReplyButton
                forumQuestionId={this.props.forumQuestionId}
                replies={this.props.replyCount}
                creator={this.props.creator}
                onClick={() => this.toggleReply(showEditor)}
              />
            </span>
          )}
          {this.state.showEditor && (
            <div className="ForumItemCard__replyDropdownMessage">
              {_t('To reply to the discussion, go to ')}
              <a target="__blank" href={this.props.deepLink}>
                {_t('the post')}
              </a>
              .
              <TrackedSvgButton
                size="zero"
                type="noStyle"
                onClick={() => this.toggleReply(showEditor)}
                trackingName="resource_panel_reply_notification_close_button"
                svgElement={<SvgClose size={16} />}
              />
            </div>
          )}
        </div>

        {this.props.children && <div className="ForumItemCard__content__childContainer">{this.props.children}</div>}
      </div>
    );
  }
}

export function ReplyCardShimmer() {
  return (
    <div className="ForumItemCard">
      <div className="ForumItemCard__content">
        <ShimmerSentence width="100px" />
        <span
          className={classNames('comment', 'br', 'animated', 'ForumItemCard__content__PostAge')}
          style={{ backgroundColor: shimmerColor, display: 'block', height: '10px', width: '40px' }}
        >
          {'        '}
        </span>
      </div>

      <ShimmerParagraph />
    </div>
  );
}

export function PostAge({ createdAt }: { createdAt: number }) {
  return (
    <span
      style={{
        height: '18px',
        width: '64px',
        color: '#666666',
        fontFamily: 'Open Sans',
        fontSize: '12px',
        letterSpacing: 0,
        lineHeight: '18px',
      }}
    >
      {moment(new Date(createdAt)).fromNow()}
    </span>
  );
}

// TODO: this needs to be fixed for i18n
// only supports Latin alphabet
export function initialsFromName(fullName: string) {
  const [firstName, ...rest] = fullName.split(' ');
  let lastInitial = '';

  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i][0].match(/^[a-z,A-Z]/)) {
      lastInitial = rest[i][0];
    }
  }
  return `${firstName[0]}${lastInitial}`;
}

export function ContributorNameWithIcon({ fullName, photoUrl }: { fullName: string | undefined; photoUrl?: string }) {
  const initials = (fullName && initialsFromName(fullName)) || '--';
  return (
    <div>
      <ProfileAvatar initials={initials} photoUrl={photoUrl} />
      <span
        style={{
          height: '36px',
          display: 'inline-block',
          fontWeight: 'bold',
          fontSize: '12px',
          paddingLeft: '7px',
        }}
      >
        {fullName}
      </span>
    </div>
  );
}
export default ForumItemCard;
