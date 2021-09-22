import React from 'react';
import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import Naptime from 'bundles/naptimejs';
import VcMembershipsV1 from 'bundles/naptimejs/resources/vcMemberships.v1';

import _t from 'i18n!nls/course-home';

type Props = {
  courseId: string;
  vcMembership?: {
    certificateLink: string;
  };
  style?: React.CSSProperties;
  children?: JSX.Element;
};

class ViewCertLink extends React.Component<Props, {}> {
  render() {
    const { style, children, courseId, vcMembership } = this.props;
    if (!courseId || !vcMembership || !vcMembership.certificateLink) return null;

    return (
      <div>
        <a
          style={style}
          className="primary"
          target="_blank"
          rel="noopener noreferrer"
          href={vcMembership.certificateLink}
        >
          {children || _t('View your certificate')}
        </a>
      </div>
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
})(ViewCertLink);
