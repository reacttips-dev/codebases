/* @jsx jsx */
import _ from 'lodash';
import Naptime from 'bundles/naptimejs';
import connectToRouter from 'js/lib/connectToRouter';
import { css, jsx } from '@emotion/react';
import { Typography, useTheme } from '@coursera/cds-core';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import PartnersV1 from 'bundles/naptimejs/resources/partners.v1';

import _t from 'i18n!nls/course-home';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import 'css!./__styles__/CourseNameHeader';

type Props = {
  course: CoursesV1;
  partners?: Array<PartnersV1>;
};

// same as bundles/catalogP/lib/stringifyList
// copied over to prevent shared dependency
const stringifyPartners = (partners: Array<PartnersV1>) => {
  const names = partners.map((partner) => partner.name);
  return _.compact([_.initial(names).join(', '), _.last(names)]).join(' & ');
};

const CourseNameHeader = (props: Props) => {
  const { course, partners } = props;
  const name = (course || {}).name || _t('Course Overview');
  // TODO: Investigate why `partners` is undefined at times.
  const partnerNames = partners && stringifyPartners(partners);

  const theme = useTheme();

  return (
    <div className="rc-CourseNameHeader vertical-box styleguide">
      <Typography
        aria-describedby="partner-names-description"
        variant="h1semibold"
        css={css`
          margin: ${theme.spacing(0, 0, 8, 0)};
        `}
      >
        {name}
      </Typography>

      <Typography id="partner-names-description">
        {partnerNames && <FormattedMessage message={_t('by {partnerNames}')} partnerNames={partnerNames} />}
      </Typography>
    </div>
  );
};

export default _.flowRight(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: { courseSlug: string }) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['name', 'partnerIds'],
      includes: ['partnerIds'],
    }),
  })),
  Naptime.createContainer(({ course }: { course: CoursesV1 }) => ({
    partners:
      course &&
      course.partnerIds &&
      PartnersV1.multiGet(course.partnerIds, {
        fields: ['name'],
      }),
  }))
)(CourseNameHeader);
