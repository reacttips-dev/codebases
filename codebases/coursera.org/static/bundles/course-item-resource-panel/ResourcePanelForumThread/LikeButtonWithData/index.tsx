import * as React from 'react';
import store from 'js/lib/coursera.store';
import PropTypes from 'prop-types';
import LikeButton from '../__components/LikeButton';
import LikeButtonProvider from '../__providers__/ForumPostLikeDataProvider';
import { AuthorProfile } from '../__types__';

type childrenProps = {
  isUpvoted: boolean;
  upvotes: number;
};

type LikeLocalStoreProps = {
  forumQuestionId: string;
  isUpvoted: boolean;
  upvotes: number;
  children: (props: childrenProps) => {};
};
type LikeLocalStoreState = {
  upvotes: number;
};

// TODO: this is a temporary fix while learning how to do apollo mutations with @rest directive
export class LikeLocalStore extends React.Component<LikeLocalStoreProps, LikeLocalStoreState> {
  static contextTypes = {
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    userId: PropTypes.number,
  };

  state = {
    upvotes: 0,
  };

  constructor(props: LikeLocalStoreProps) {
    super(props);
    this.like.bind(this);
    this.unlike.bind(this);

    this.state.upvotes = this.adjustedUpVotesCount();
  }

  static childContextTypes = {
    like: PropTypes.func,
    unlike: PropTypes.func,
  };

  adjustedUpVotesCount = () => {
    const upVotes = this.props?.upvotes;

    if (upVotes !== undefined) {
      if (this.props?.isUpvoted === true) {
        return upVotes;
      }
      if (this.localIsUpvoted() === true) {
        return upVotes + 1;
      }
    }
    return upVotes;
  };

  localIsUpvoted = () => {
    const localStore = store.get(`resourcePanelContextLike_${this.props.forumQuestionId}`);
    return localStore?.isUpvoted;
  };

  getChildContext() {
    return {
      like: this.like.bind(this),
      unlike: this.unlike.bind(this),
    };
  }

  like() {
    if (this.props.forumQuestionId) {
      store.set(`resourcePanelContextLike_${this.props.forumQuestionId}`, { isUpvoted: true });
    }

    if (this.context.like) {
      this.context.like();
    }
    this.setState({ upvotes: this.adjustedUpVotesCount() });
  }

  unlike() {
    if (this.props.forumQuestionId) {
      store.set(`resourcePanelContextLike_${this.props.forumQuestionId}`, { isUpvoted: false });
    }
    if (this.context.like) {
      this.context.unlike();
    }
    // eslint-disable-next-line react/no-access-state-in-setstate
    const upvotes = this.state.upvotes - 1;
    this.setState({ upvotes });
  }

  render() {
    const upvotes = this.state.upvotes;
    let isUpvoted = this.localIsUpvoted();
    if (typeof isUpvoted !== 'boolean') {
      isUpvoted = this.props.isUpvoted;
    }
    return <span>{this.props?.children({ isUpvoted, upvotes })}</span>;
  }
}

export default function LikeButtonWithData({
  forumQuestionId,
  isUpvoted,
  upvotes,
  ariaDescribedBy,
  creator,
}: {
  forumQuestionId: string;
  courseId?: string;
  isUpvoted: boolean;
  upvotes: number;
  ariaDescribedBy?: string;
  creator?: AuthorProfile;
}) {
  return (
    <LikeButtonProvider forumQuestionId={forumQuestionId}>
      <LikeLocalStore forumQuestionId={forumQuestionId} isUpvoted={isUpvoted} upvotes={upvotes}>
        {({ isUpvoted: localStoreUpvoted, upvotes: localStoreUpvotes }) => (
          <LikeButton
            forumQuestionId={forumQuestionId}
            creator={creator}
            isUpvoted={localStoreUpvoted}
            upvotes={localStoreUpvotes}
            ariaDescribedBy={ariaDescribedBy}
          />
        )}
      </LikeLocalStore>
    </LikeButtonProvider>
  );
}
