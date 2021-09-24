import React, {Component} from 'react';

export default class ReasonUpvote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      votes: props.reason.cached_votes_total,
      user_voted: props.reason.user_voted
    };

    this.voteToggle = this.voteToggle.bind(this);
    this.upvoteClass = this.upvoteClass.bind(this);
  }

  upvoteClass() {
    return this.state.user_voted ? 'active' : '';
  }

  voteToggle() {
    let votes = this.state.votes + (this.state.user_voted ? -1 : 1);
    this.setState({user_voted: !this.state.user_voted, votes: votes});
    let vote = this.state.user_voted ? '-1' : '1';
    $.post('/api/v1/reasons/toggle_vote', {id: this.props.reason.id, vote: vote});
  }

  render() {
    return (
      <div className="one-liner">
        <div onClick={this.voteToggle} className={this.upvoteClass()}>
          <i className="fa fa-arrow-circle-up" aria-hidden="true" />
          &nbsp;{this.state.votes}
        </div>
        <span className="onboarding-reason-text">{this.props.reason.text}</span>
      </div>
    );
  }
}
