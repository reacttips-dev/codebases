import React from 'react';
import redirect from 'js/lib/coursera.redirect';

import connectToRouter from 'js/lib/connectToRouter';

import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';

type Props = {
  courseSlug: string;
};

class CourseUnauthorized extends React.Component<Props, void> {
  componentDidMount() {
    const { courseSlug } = this.props;
    redirect.setLocation(`/learn/${courseSlug}`);
  }

  render() {
    return (
      <div className="align-horizontal-center">
        <LoadingIcon />
      </div>
    );
  }
}

export default connectToRouter((router, props) => ({
  courseSlug: router.params.courseSlug,
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'typeof CourseUnauthorized' is no... Remove this comment to see the full error message
}))(CourseUnauthorized);
