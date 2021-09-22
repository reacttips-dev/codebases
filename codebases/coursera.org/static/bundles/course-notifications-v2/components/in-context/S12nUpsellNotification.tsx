import React from 'react';

import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';
import type { S12nUpsellNotification as S12nUpsellNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

import EnrollModal from 'bundles/enroll/components/EnrollModal';

import _t from 'i18n!nls/course-notifications-v2';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

const S12nName = ({ s12nName, s12nSlug, s12nIsCertificate }: $TSFixMe) => {
  if (s12nIsCertificate) {
    return (
      <a href={`/specializations/${s12nSlug}`} target="_blank" rel="noreferrer">
        {s12nName}
      </a>
    );
  }

  return (
    <a href={`/specializations/${s12nSlug}`} target="_blank" rel="noreferrer">
      <FormattedMessage s12nName={s12nName} message="{s12nName} Specialization" />
    </a>
  );
};

const S12nHybridCourseMessage = ({ s12nName, s12nSlug, s12nIsCertificate }: $TSFixMe) => (
  <FormattedMessage
    s12n={<S12nName s12nName={s12nName} s12nSlug={s12nSlug} s12nIsCertificate={s12nIsCertificate} />}
    message={_t(
      `Good news! You've completed an equivalent course, so you don't 
            need to complete this course to receive credit in the {s12n}.`
    )}
  />
);

const JoinS12nMessage = ({ s12nName, s12nSlug, s12nIsCertificate }: $TSFixMe) => (
  <FormattedMessage
    s12n={<S12nName s12nName={s12nName} s12nSlug={s12nSlug} s12nIsCertificate={s12nIsCertificate} />}
    message={_t('Like this course? Become an expert by joining the {s12n}.')}
  />
);

const PurchaseCourseMessage = ({ onClick }: $TSFixMe) => (
  <FormattedMessage
    action={
      <button className="button-link" onClick={onClick} style={{ marginLeft: '15px' }}>
        {_t('Purchase')}
      </button>
    }
    message={_t(
      `Like what you've learned so far? Purchase 
      this course to advance in the Specialization. {action}`
    )}
  />
);

type Props = {
  notification: S12nUpsellNotificationType;
};

type State = {
  showModal: boolean;
};

class S12nUpsellNotification extends React.Component<Props, State> {
  state: State = { showModal: false };

  handleEnroll = () => {
    this.setState({ showModal: true });
  };

  render() {
    const {
      notification: {
        definition: {
          s12nId,
          s12nName,
          s12nSlug,
          courseId,
          isHybridCourse,
          isEnrolledInS12n,
          isEnrolledInCourse,
          s12nIsCertificate,
        },
      },
    } = this.props;

    const { showModal } = this.state;

    let message;

    if (isHybridCourse) {
      message = (
        <S12nHybridCourseMessage s12nName={s12nName} s12nSlug={s12nSlug} s12nIsCertificate={s12nIsCertificate} />
      );
    } else if (isEnrolledInCourse) {
      if (isEnrolledInS12n) {
        message = <PurchaseCourseMessage onClick={this.handleEnroll} />;
      } else {
        message = <JoinS12nMessage s12nName={s12nName} s12nSlug={s12nSlug} s12nIsCertificate={s12nIsCertificate} />;
      }
    }

    if (!message) {
      return null;
    }

    return (
      <div className="rc-S12nUpsellNotification">
        <InContextNotification trackingName="s12n_upsell_notification" type="info" message={message} />

        {showModal && (
          <EnrollModal
            s12nId={s12nId}
            courseIdOverride={courseId}
            showFreeOption={!isEnrolledInCourse}
            onClose={() => this.setState({ showModal: false })}
          />
        )}
      </div>
    );
  }
}

export default S12nUpsellNotification;
