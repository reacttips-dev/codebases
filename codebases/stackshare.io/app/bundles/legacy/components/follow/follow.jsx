import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import PlusIcon from '../../../../shared/library/buttons/follow/plus.svg';
import CheckmarkIcon from '../../../../shared/library/buttons/follow/checkmark.svg';
export default class Follow extends Component {
  constructor(props) {
    super();
    this.mounted = false;
    this.state = {
      userId: props.userId,
      following: props.defaultFollowing,
      followeeId: props.followeeId,
      followeeType: props.followeeType,
      followerCount: 0
    };
  }

  static propTypes = {
    showCount: PropTypes.bool
  };

  getFollowStatus = () => {
    get(
      '/api/v1/follows/following?followee_id=' +
        this.state.followeeId +
        '&followee_type=' +
        this.state.followeeType
    ).then(response => {
      if (this.mounted) {
        this.setState({followerCount: response.data.follower_count});
        this.setState({
          followerCountReadable: response.data.follower_count_readable
        });
        this.setState({following: response.data.following});
      }
    });
  };

  toggleFollow = () => {
    if (this.state.userId) {
      get(
        '/api/v1/follows/toggle?followee_id=' +
          this.state.followeeId +
          '&followee_type=' +
          this.state.followeeType
      ).then(response => {
        if (this.mounted) {
          this.setState({followerCount: response.data.follower_count});
          this.setState({
            followerCountReadable: response.data.follower_count_readable
          });
          this.setState({following: response.data.following});
        }
      });
    } else {
      signupModal();
    }
  };

  componentDidMount() {
    this.mounted = true;
    $('.follow_button').remove();
    if (this.state.userId) {
      this.getFollowStatus();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {following, followerCount, followerCountReadable} = this.state;
    const {showCount} = this.props;
    return (
      <div className="follow_button_component">
        <SimpleButton
          data-testid="follow"
          onClick={this.toggleFollow}
          active={following}
          width={125}
          className={showCount && followerCount > 0 ? 'show-count' : 'hide-count'}
        >
          {following ? <CheckmarkIcon /> : <PlusIcon />}&nbsp;
          {following ? 'Following' : 'Follow'}
        </SimpleButton>
        {showCount && followerCount > 0 && (
          <div className="follow_button_component__count">{followerCountReadable}</div>
        )}
      </div>
    );
  }
}
