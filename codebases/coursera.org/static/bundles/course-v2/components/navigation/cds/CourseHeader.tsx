/* @jsx jsx */
import React from 'react';
import { Partner } from 'bundles/course-v2/types/Course';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Typography } from '@coursera/cds-core';

import PartnerLogo from 'bundles/course-v2/components/PartnerLogo';

import 'css!./../__styles__/CourseHeader';

type Props = {
  name: string;
  partnerImage?: string;
  brandingImage?: string;
  partners: Array<Partner>;
};

const CourseHeader = (props: Props) => {
  const { brandingImage, partnerImage, name, partners } = props;

  if (brandingImage && !partnerImage) {
    // Trimming the course name such that it takes up a maximum of three lines in the menu.
    // Checks for the last index of a space when adding ellipses.
    const maxLength = 80;
    let trimmedName = name.substr(0, maxLength);
    trimmedName = trimmedName.substr(0, Math.min(trimmedName.length, trimmedName.lastIndexOf(' ')));
    const showTrimmedName = name.length > maxLength;
    return (
      <div className="rc-CourseHeader">
        <Typography variant="h3semibold" title={name}>
          {showTrimmedName ? `${trimmedName}...` : name}
        </Typography>
        <Typography color="supportText">{partners?.map((university) => university.name).join(', ')}</Typography>
      </div>
    );
  }
  return (
    <div className="align-horizontal-center od-dark od-container cozy">
      {partners.length === 1 && partnerImage && <PartnerLogo thumbnail={partnerImage} altText={partners[0].name} />}
    </div>
  );
};

export default CourseHeader;
