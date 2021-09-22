import React from 'react';

import Q from 'q';
import _ from 'lodash';
import user from 'js/lib/user';

import { compose } from 'recompose';
import Naptime from 'bundles/naptimejs';

import connectToRouter from 'js/lib/connectToRouter';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import withComputedItem from 'bundles/learner-progress/utils/withComputedItem';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import videoPromise from 'pages/open-course/video/promises/video';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import videoQuizModelPromise from 'pages/open-course/video/promises/videoQuizPromise';
import enrollmentModePromiseMaker from 'bundles/course-preview/service/promises/enrollmentMode';

import userPreferences from 'bundles/video-player/utils/userPreferences';
import type VideoContent from 'bundles/video-player/models/VideoContent';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* eslint-enable no-restricted-imports */

type Props = {
  itemId: string;
  courseId: string;
  itemMetadata: ItemMetadata;
  // TODO: Use more specific type
  router: any;
  isSubtitleTranslationEnabled: boolean;
};

type State = {
  // TODO: Use more specific types
  enrollmentMode: any;
  videoQuizModel: any;
  videoContent?: VideoContent | null;
};

const withVideoItemData = () => (BaseComponent: any) => {
  const componentName = BaseComponent.displayName || BaseComponent.name;

  class HOC extends React.Component<Props, State> {
    static displayName = `withVideoItemData(${componentName})`;

    constructor(props: $TSFixMe) {
      super(props);

      this.state = {
        videoQuizModel: null,
        enrollmentMode: null,
        videoContent: null,
      };
    }

    componentDidMount() {
      const { courseId, itemMetadata: metadata } = this.props;

      const videoItemDataPromises = _.compact([
        videoPromise({ metadata }),
        enrollmentModePromiseMaker(user.get().id, courseId),
        videoQuizModelPromise({ metadata, authenticated: true }),
      ]);

      Q.all(videoItemDataPromises)
        .spread((videoContent, enrollmentMode, videoQuizModel) => {
          this.setState({
            videoContent,
            enrollmentMode,
            videoQuizModel: videoQuizModel || null,
          });
        })
        .done();
    }

    render() {
      const {
        router: { location },
      } = this.props;

      const { videoQuizModel, videoContent, enrollmentMode } = this.state;

      if (!videoContent) {
        return null;
      }

      // Expect a query parameter t that specifies the time to start playing
      // in seconds. If this is set, we then set autoplay to true.
      const startPlaybackSeconds = location && location.query.t ? parseInt(location.query.t, 10) : undefined;
      const autoplay = location && location.query.t ? true : userPreferences.get('autoplay');

      return (
        <BaseComponent
          {...this.props}
          autoplay={autoplay || false}
          enrollmentMode={enrollmentMode}
          videoQuizModel={videoQuizModel}
          videoContent={videoContent}
          startPlaybackSeconds={startPlaybackSeconds}
        />
      );
    }
  }

  hoistNonReactStatics(HOC, BaseComponent);

  return compose(
    connectToRouter((router) => ({ router })),
    withComputedItem(),
    waitForStores(
      ['ProgressStore', 'VerificationStore', 'CourseScheduleStore', 'SessionStore', 'CourseStore'],
      (
        { ProgressStore, VerificationStore, CourseScheduleStore, SessionStore, CourseStore }: $TSFixMe,
        { itemMetadata }: $TSFixMe
      ) => {
        const moduleId = itemMetadata.get('lesson.module.id');
        const schedule = CourseScheduleStore.getSchedule();

        return {
          courseId: CourseStore.getCourseId(),
          isSubtitleTranslationEnabled: CourseStore.isSubtitleTranslationEnabledForCourse(),
          courseProgress: ProgressStore.courseProgress,
          verificationDisplay: VerificationStore.getVerificationDisplay(),
          weekNumber: schedule.getWeekForModuleId(moduleId),
          isPreviewMode: SessionStore.isPreviewMode(),
        };
      }
    ),

    Naptime.createContainer(({ courseId }: any) => ({
      course: CoursesV1.get(courseId, {
        fields: ['isClosedCourse', 's12nIds'],
        params: { showHidden: true },
      }),
    }))
  )(HOC);
};

export default withVideoItemData;
