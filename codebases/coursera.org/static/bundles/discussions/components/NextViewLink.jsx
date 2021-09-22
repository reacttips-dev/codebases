import { compose } from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import path from 'js/lib/path';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import mapProps from 'js/lib/mapProps';

class NextViewLink extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    questionForum: PropTypes.oneOfType([
      PropTypes.instanceOf(OnDemandCourseForumsV1),
      PropTypes.instanceOf(OnDemandMentorForumsV1),
      PropTypes.instanceOf(GroupForumsV1),
    ]),

    rootPath: PropTypes.string,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  render() {
    if (!this.props.questionForum) {
      return null;
    }

    const link = path.join(this.props.rootPath, this.props.questionForum.link);
    const title = this.props.questionForum.title;

    if (!link || !title) return null;
    return (
      <span className="rc-NextViewName">
        <Link to={link} className="caption-text">
          {title}
        </Link>
      </span>
    );
  }
}

export default compose(
  discussionsForumsHOC({ fields: ['link', 'title'] }),
  connectToRouter(routerConnectToCurrentForum),
  mapProps((props) => {
    const questionForumId = props.question.forumId;
    return {
      questionForum:
        props.courseForums.concat(props.mentorForums) &&
        props.courseForums.find((forum) => forum.forumId === questionForumId),
    };
  })
)(NextViewLink);
