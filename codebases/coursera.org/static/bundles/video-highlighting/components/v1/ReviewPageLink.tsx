import React from 'react';
import { Box, color } from '@coursera/coursera-ui';
import { SvgExternalLink } from '@coursera/coursera-ui/svg';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';
import connectToRouter from 'js/lib/connectToRouter';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getCourseRootPath, getNotesUrl } from 'bundles/ondemand/utils/url';

import _t from 'i18n!nls/video-highlighting';
import 'css!./__styles__/ReviewPageLink';

type Props = {
  courseSlug: string;
};

const ReviewPageLink = ({ courseSlug }: Props) => (
  <LearnerAppClientNavigationLink
    href={getNotesUrl(getCourseRootPath(courseSlug))}
    trackingName="note_sidebar_to_review_link"
    className="nostyle rc-ReviewPageLink"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Box justifyContent="start" alignItems="center">
      <SvgExternalLink size={18} color={color.primary} />
      <div className="review-link-text"> {_t('All notes')} </div>
    </Box>
  </LearnerAppClientNavigationLink>
);

export default connectToRouter<Props, {}>(({ params: { courseSlug } }) => ({
  courseSlug,
}))(ReviewPageLink);
