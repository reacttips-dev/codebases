/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import ContextStatusPill from 'bundles/authoring/course-level/components/ContextStatusPill';
import EnrollmentDivider from 'bundles/preview/components/EnrollmentDivider';
import ToolbarBox from 'bundles/preview/components/ToolbarBox';
import type { AuthoringCourseContext } from 'bundles/authoring/common/types/authoringCourseContexts';
import type { CourseCatalogType } from 'bundles/author-course/utils/types';
import { getContextTypeLabel } from 'bundles/authoring/course-level/utils/contextUtils';
import { getContextDateString } from 'bundles/authoring/course-level/utils/contextDateUtils';

type Props = {
  context: AuthoringCourseContext;
  courseCatalogType: CourseCatalogType;
};

const styles = {
  root: css({
    '.enrolled-context-type': {
      fontSize: '0.75rem',
    },
    '.enrolled-context-name': {
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
      lineHeight: '1rem',
      maxWidth: '40vw',
    },
    '.rc-EnrollmentDivider': {
      transform: 'rotate(90deg)',
    },
  }),
};

const EnrolledContext: React.FC<Props> = ({ context, courseCatalogType }: Props) => {
  const { typeName } = context;
  const { name, createdAt, startsAt, endsAt, status } = context.definition;

  return (
    <ToolbarBox className="rc-EnrolledContext" css={styles.root}>
      <span className="enrolled-context-name">{name}</span>
      <span className="enrolled-context-type">{getContextTypeLabel(typeName, courseCatalogType)}</span>
      <ContextStatusPill status={status} />
      <EnrollmentDivider />
      <span className="enrolled-context-datestring">
        {getContextDateString({ status, createdAt, startsAt, endsAt, typeName })}
      </span>
    </ToolbarBox>
  );
};

export default EnrolledContext;
