import React from 'react';
import { compose } from 'recompose';

import connectToRouter from 'js/lib/connectToRouter';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

type Props = {
  router: any;
  courseRootPath: string;
};

class ItemNotFound extends React.Component<Props> {
  componentDidMount() {
    const { router, courseRootPath } = this.props;
    router.push(`${courseRootPath}/home/welcome`);
  }

  render() {
    return null;
  }
}

export default compose<Props, {}>(
  connectToRouter((router) => ({ router })),
  connectToStores(['CourseStore'], ({ CourseStore }) => ({
    courseRootPath: CourseStore.getCourseRootPath(),
  }))
)(ItemNotFound);
