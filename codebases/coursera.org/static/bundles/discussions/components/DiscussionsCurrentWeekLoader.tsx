import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { FluxibleContext } from 'fluxible';
import DiscussionsWeekHeroUnit from 'bundles/discussions/components/DiscussionsWeekHeroUnit';
import { getCurrentWeek } from 'bundles/ondemand/stores/StoreComputationHelpers';
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandCourseForumStatisticsV1 from 'bundles/naptimejs/resources/onDemandCourseForumStatistics.v1';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import mapProps from 'js/lib/mapProps';
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import app from 'bundles/discussions/app';

type PropsFromCaller = {
  weekNumber?: number;
};

type PropsFromDiscussionsForumsHoc = {
  courseForums: OnDemandCourseForumsV1;
  courseForumStatistics: OnDemandCourseForumStatisticsV1;
};

type PropsToMapProps = PropsFromCaller & PropsFromDiscussionsForumsHoc;

type PropsFromMapProps = {
  forum: OnDemandCourseForumsV1;
  forumStatistic: OnDemandCourseForumStatisticsV1;
};

type PropsFromFluxibleWrapper = {
  isCourseWeekPage: boolean;
};

type PropsToConnector = PropsFromCaller & PropsFromFluxibleWrapper;

type PropsToComponent = PropsFromCaller & PropsFromDiscussionsForumsHoc & PropsFromMapProps & PropsFromFluxibleWrapper;

class DiscussionsCurrentWeekLoader extends React.Component<PropsToComponent> {
  render() {
    const { weekNumber, forum, forumStatistic } = this.props;

    if (!weekNumber || !forum) {
      return null;
    }

    return (
      <DiscussionsWeekHeroUnit
        weekNumber={weekNumber}
        isLoading={false}
        title={forum.title}
        description={forum.description}
        mostRecentThread={forum.mostRecentThread}
        lastAnsweredAt={forumStatistic && forumStatistic.lastAnsweredAt}
        forumQuestionCount={forumStatistic && forumStatistic.forumQuestionCount}
      />
    );
  }
}

const DiscussionsCurrentWeekLoaderConnector = compose<PropsToComponent, PropsToConnector>(
  discussionsForumsHOC({
    fields: ['link', 'title', 'forumType', 'description', 'lastAnsweredAt', 'forumQuestionCount'],
  }),
  waitForStores(
    ['CourseStore', 'CourseScheduleStore', 'ProgressStore'],
    ({ CourseStore, CourseScheduleStore, ProgressStore }, props) => {
      const weekNumber = props.weekNumber || getCurrentWeek(CourseStore, CourseScheduleStore, ProgressStore);
      return {
        weekNumber,
      };
    }
  ),
  mapProps<PropsFromMapProps, PropsToMapProps>((props) => {
    const forum = props.courseForums.find(
      (courseForum) => courseForum.forumType.definition.weekNumber === props.weekNumber
    );

    return {
      ...props,
      forum,
      forumStatistic:
        forum &&
        props.courseForumStatistics &&
        props.courseForumStatistics.find((statistic) => statistic.courseForumId === forum.id),
    };
  })
)(DiscussionsCurrentWeekLoader);

export default class FluxibleDiscussionsAppLoader extends React.Component<PropsFromCaller> {
  static contextTypes = {
    fluxibleContext: PropTypes.object,
  };

  componentWillMount() {
    const { fluxibleContext } = this.context;
    this.fluxibleContext = app(fluxibleContext);
  }

  fluxibleContext: FluxibleContext | undefined = undefined;

  render() {
    return (
      <FluxibleComponent context={this.fluxibleContext?.getComponentContext()}>
        <DiscussionsCurrentWeekLoaderConnector {...this.props} isCourseWeekPage />
      </FluxibleComponent>
    );
  }
}
