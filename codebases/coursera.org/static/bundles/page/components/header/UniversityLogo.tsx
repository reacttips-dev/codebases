import PropTypes from 'prop-types';
import React from 'react';
import Imgix from 'js/components/Imgix';

import Naptime from 'bundles/naptimejs';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import Degrees from 'bundles/naptimejs/resources/degrees.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';

import { Box } from '@coursera/coursera-ui';

import 'css!./__styles__/UniversityLogo';

const UniversityLogo = ({ course, degree, partner }: $TSFixMe) => {
  if (course && course.brandingImageUrl) {
    return (
      <Box rootClassName="rc-UniversityLogo" alignItems="center">
        <div className="branding-image">
          <Imgix width={256} height={32} alt="" src={course.brandingImageUrl} className="w-100" />
        </div>
      </Box>
    );
  }

  if (degree) {
    return (
      <Box rootClassName="rc-UniversityLogo" alignItems="center" data-e2e="UniversityLogo">
        {partner && partner.rectangularLogo && (
          <div className="branding-image">
            <Imgix src={partner.rectangularLogo} width={74} height={30} alt="" className="w-100" />
          </div>
        )}
      </Box>
    );
  }

  return null;
};

UniversityLogo.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    brandingImageUrl: PropTypes.string,
  }),

  degree: PropTypes.instanceOf(Degrees),
  partner: PropTypes.instanceOf(PartnersV1),
};

export default Naptime.createContainer(UniversityLogo, ({ degree }) => ({
  partner: degree
    ? PartnersV1.get(degree.partnerIds[0], {
        fields: ['rectangularLogo', 'name', 'partnerPageUrl'],
      })
    : null,
}));
