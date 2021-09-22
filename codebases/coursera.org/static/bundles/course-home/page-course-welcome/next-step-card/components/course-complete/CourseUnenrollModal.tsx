import React from 'react';
import PropTypes from 'prop-types';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';

import Q from 'q';
import _ from 'underscore';

import API from 'bundles/phoenix/lib/apiWrapper';

import MembershipsV1 from 'bundles/naptimejs/resources/memberships.v1';
import CourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import UnenrollConfirmationModal from 'bundles/s12n-common/components/dashboard/UnenrollConfirmationModal';

import _t from 'i18n!nls/course-home';

type OuterProps = {
  course: {
    id: string;
    name: string;
    slug: string;
    courseType: 'v2.ondemand' | 'v2.capstone' | 'v1.session' | 'v1.capstone';
  };

  onClose: () => void;
};

type Props = OuterProps & Naptime.AddedProps;

class CourseUnenrollModal extends React.Component<Props> {
  static contextTypes = {
    executeMutation: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
  };

  onUnenrollFromCourse = () => {
    const userId = user.get().id;
    const {
      naptime,
      onClose,
      course: { id, courseType },
    } = this.props;

    if (['v2.ondemand', 'v2.capstone'].indexOf(courseType) > -1) {
      this.context.executeMutation(CourseMembershipsV1.delete(`${userId}~${id}`, { body: {} })).then(() => {
        naptime.refreshData({
          resources: ['memberships.v1'],
        });

        onClose();
      });
    } else {
      // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
      const unenrollApi = new API('/api/enrollments.v1');
      const NaptimeStore = this.context.getStore('NaptimeStore');
      const items = NaptimeStore.__getAllFromInternalStorage(MembershipsV1);

      _(items).forEach((membership) => {
        if (membership.courseId === id) {
          Q(unenrollApi.delete(`${userId}~${membership.v1SessionId}`, { body: {} })).then(() => {
            naptime.refreshData({
              resources: ['memberships.v1'],
            });

            onClose();
          });
        }
      });
    }
  };

  renderModalBody() {
    return (
      <div>
        <h2 className="headline-4-text">{_t('Are you sure you want to un-enroll?')}</h2>
        <p>
          {_t(
            `When you un-enroll, this course will no longer appear on your course dashboard.
            Your progress will be saved, and you can re-enroll through the catalog if you change your mind.`
          )}
        </p>
      </div>
    );
  }

  render() {
    const { onClose } = this.props;

    return (
      <UnenrollConfirmationModal
        modalName="Un-enroll from Course"
        closeModal={onClose}
        unenrollLink={null}
        unenrollButtonText={null}
        handleUnenroll={this.onUnenrollFromCourse}
      >
        {this.renderModalBody()}
      </UnenrollConfirmationModal>
    );
  }
}

export default Naptime.createContainer<Props, OuterProps>(() => ({}))(CourseUnenrollModal);
