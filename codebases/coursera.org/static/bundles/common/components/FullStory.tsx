/*
  FullStory integration component used by other HOC components, such as CourseFullStory,
  that implement logic for when to activate FullStory recording.
  For integration instructions, see:
  https://coursera.atlassian.net/wiki/spaces/EN/pages/194740229/FullStory+Integration

  FullStory has been configured to ignore elements which include the class "pii-hide".
  For more information regarding PII, see:
  https://coursera.atlassian.net/wiki/spaces/EN/pages/185008423/Personally+Identifiable+Information+PII
*/

import React from 'react';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import fullStory from 'js/lib/fullStoryUtils';

export type FullStoryProps = {
  beginOnMount?: boolean;
  endOnUnmount?: boolean;
  data?: {
    [key: string]: string | number | boolean | Date;
  };
  children: () => JSX.Element;
};

class FullStory extends React.Component<FullStoryProps> {
  componentDidMount() {
    const { beginOnMount = true, data } = this.props;
    if (beginOnMount) {
      fullStory.init();
    }
    if (data) {
      fullStory.set(data);
    }
  }

  componentWillUnmount() {
    const { endOnUnmount = true } = this.props;
    if (endOnUnmount) {
      fullStory.endSession();
    }
  }

  render() {
    const { children } = this.props;
    return children();
  }
}

export default FullStory;
