import React from 'react';
import _t from 'i18n!nls/course-home';
import ShareButtonWithModal from 'bundles/sharing-common/components/modal/ShareButtonWithModal';
import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import Naptime from 'bundles/naptimejs';
import VcMembershipsV1 from 'bundles/naptimejs/resources/vcMemberships.v1';

import { SvgShare } from '@coursera/coursera-ui/svg';

import 'css!bundles/course-home/page-course-welcome/next-step-card/components/__styles__/CourseCompleted';

type Props = {
  courseId: string;
  vcMembership?: {
    certificateLink: string;
  };
};

class CourseRatingShareCertifcate extends React.Component<Props> {
  render() {
    const { courseId, vcMembership } = this.props;
    if (!courseId || !vcMembership || !vcMembership.certificateLink) return null;

    return (
      <ShareButtonWithModal shareLink={'https://www.coursera.org' + vcMembership.certificateLink}>
        <div className="share-cert-icon">
          <SvgShare color="#2B73CC" size={12} />
          {_t('Share your Certificate')}
        </div>
      </ShareButtonWithModal>
    );
  }
}

export default Naptime.createContainer<Props, Props>((props: Props) => {
  const { courseId } = props;
  const membershipId = tupleToStringKey([user.get().id, courseId]);

  return {
    ...props,
    courseId,
    vcMembership: VcMembershipsV1.get(membershipId, {
      fields: ['certificateCode'],
    }),
  };
})(CourseRatingShareCertifcate);
