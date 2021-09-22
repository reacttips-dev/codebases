import React from 'react';
import _ from 'underscore';
import Naptime from 'bundles/naptimejs';
import waitFor from 'js/lib/waitFor';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';

import {
  getPartnerBannerViewStatus,
  togglePartnerEmailSubscription,
  dismissPartnerEmailSubscription,
} from 'bundles/account-settings/actions/SettingsActionCreators';

import SettingsStore from 'bundles/account-settings/stores/SettingsStore';

import EmailSubscription from 'bundles/course-home/page-course-welcome/components/EmailSubscription';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';

type Props = {
  courseId: string;
  partnerId: string;
  partnerName: string;
};

type State = {
  status?: 'subscribed' | 'unsubscribed' | 'dismissed';
};

class LegacyEmailSubscription extends React.Component<Props, State> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      status: SettingsStore.getPartnerBannerStatus(props.partnerId),
    };
  }

  componentDidMount() {
    const { courseId, partnerId } = this.props;
    getPartnerBannerViewStatus(courseId, partnerId);
    SettingsStore.addListener('change', this.handleStoreChange);
  }

  componentWillUnmount() {
    SettingsStore.removeListener('change', this.handleStoreChange);
  }

  handleStoreChange = () => {
    const { partnerId } = this.props;

    this.setState({
      status: SettingsStore.getPartnerBannerStatus(partnerId),
    });
  };

  handleDismiss = () => {
    const { courseId, partnerId } = this.props;
    dismissPartnerEmailSubscription(courseId, partnerId);
  };

  handleUpdate = (subscription) => {
    const { courseId, partnerId } = this.props;
    togglePartnerEmailSubscription(partnerId, courseId, subscription);
  };

  render() {
    const { status } = this.state;
    const { partnerName } = this.props;

    if (!status || status === 'dismissed') {
      return null;
    }

    return (
      <EmailSubscription
        status={status}
        partnerName={partnerName}
        onDismiss={this.handleDismiss}
        onUpdate={this.handleUpdate}
      />
    );
  }
}

export default _.compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: $TSFixMe) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id'],
      includes: ['partnerIds'],
    }),
  })),
  Naptime.createContainer(({ course }: $TSFixMe) => ({
    partners: PartnersV1.multiGet(course.partnerIds, {
      fields: ['name'],
    }),
  })),
  waitFor(({ partners }) => !!partners?.[0]),
  mapProps<
    { courseId: string; partnerId: string; partnerName: string },
    {
      course: $TSFixMe;
      partners: $TSFixMe;
    }
  >(({ course, partners }) => {
    const partner = partners[0];

    return {
      courseId: course.id,
      partnerId: partner.id,
      partnerName: partner.name,
    };
  })
)(LegacyEmailSubscription);
