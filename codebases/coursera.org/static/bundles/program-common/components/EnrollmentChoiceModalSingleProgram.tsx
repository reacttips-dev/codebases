/** @jsx jsx */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import _t from 'i18n!nls/program-common';
import { jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { useTheme, Typography } from '@coursera/cds-core';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import EnrollmentChoiceModalOptionListContainer from 'bundles/program-common/components/EnrollmentChoiceModalOptionListContainer';
import { CreditBadge } from 'bundles/enterprise-ui/components/Badges';
import type { EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery_EnterpriseProgramSessionAssociationsV1Resource_byProgramsAndCourse_elements as EnterpriseProgramSessionAssociation } from 'bundles/program-common/constants/__generated__/EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery';

type PropsFromCaller = {
  productType: string;
  programJoinTrackingVerbiage: boolean;
  thirdPartyOrgName: string;
  programOption: ProgramOption;
  programsWithCredits?: Array<string | undefined>;
  enterpriseProgramAssociations?: { [key: string]: EnterpriseProgramSessionAssociation };
};

type ProgramOption = {
  programId: string;
  programName: string;
  date: Date;
  isInvitation: boolean;
};

type Props = PropsFromCaller;

const styles = {
  programListItem: (theme: Theme) => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    margin: theme.spacing(16, 0),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(16, 0),
    },
  }),
  programListItemLabel: {
    flexGrow: 1,
  },
};

const EnrollmentChoiceModalSingleProgram = ({
  productType,
  programJoinTrackingVerbiage,
  programOption,
  thirdPartyOrgName,
  programsWithCredits,
  enterpriseProgramAssociations,
}: Props) => {
  const theme = useTheme();

  const description = (
    <>
      <FormattedMessage
        message={_t(
          'This {productType, select, course {course} s12n {specialization}} is available in the learning program created by your organization, {thirdPartyOrgName}.'
        )}
        productType={productType}
        thirdPartyOrgName={thirdPartyOrgName}
      />{' '}
      {programJoinTrackingVerbiage &&
        _t('Your course grades will be recorded and progress will be tracked in the following program:')}
    </>
  );

  // ---
  if (!programOption) {
    return (
      <EnrollmentChoiceModalOptionListContainer.Placeholder
        title={null}
        description={description}
        isMultiChoice={false}
      />
    );
  }

  const session = enterpriseProgramAssociations?.[programOption.programId]?.session;
  return (
    <EnrollmentChoiceModalOptionListContainer description={description} isMultiChoice={false}>
      <div css={styles.programListItem(theme)}>
        <div css={styles.programListItemLabel}>
          <Typography component="span">{programOption.programName}</Typography>
          <br />
          <Typography variant="body2" color="supportText" component="span">
            {session ? (
              <FormattedMessage
                message={_t('{startDate, date, long} - {endDate, date, long}')}
                startDate={session.startsAt}
                endDate={session.endsAt}
              />
            ) : (
              <FormattedMessage
                message={_t('Program {isInvitation, select, true {invite} false {join}} date: {date, date, long}')}
                date={programOption.date}
                isInvitation={programOption.isInvitation}
              />
            )}
          </Typography>
          <br />
          {programsWithCredits?.includes(programOption.programId) && <CreditBadge />}
        </div>
      </div>
    </EnrollmentChoiceModalOptionListContainer>
  );
};

export default EnrollmentChoiceModalSingleProgram;
