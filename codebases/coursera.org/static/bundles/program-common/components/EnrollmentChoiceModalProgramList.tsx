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
  // programOptions can come in as [], so use this proxy for count
  programCount: number;
  programOptions: ProgramOption[];
  programId?: string;
  onChangeRadio: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  programListItemRadio: {
    // Global CSS messes with this, so punch it with !important
    margin: '0 0 0 0 !important',
    zoom: 2,
    flexShrink: 0,
  },
  programListItemLabel: (theme: Theme) => ({
    margin: theme.spacing(0, 0, 0, 12),
    flexGrow: 1,
  }),
  programListItemJoinDate: (theme: Theme) => ({
    color: theme.palette.gray[700],
  }),
};

const EnrollmentChoiceModalProgramList = ({
  productType,
  programJoinTrackingVerbiage,
  programCount,
  programOptions,
  thirdPartyOrgName,
  programId,
  onChangeRadio,
  programsWithCredits,
  enterpriseProgramAssociations,
}: Props) => {
  const theme = useTheme();

  // ---

  const title = _t('Select a learning program:');
  const description = (
    <>
      <FormattedMessage
        message={_t(
          'This {productType, select, course {course} s12n {specialization}} is available in {programCount, plural, =1 {# learning program} other {# learning programs}} created by your organization, {thirdPartyOrgName}.'
        )}
        productType={productType}
        programCount={programCount}
        thirdPartyOrgName={thirdPartyOrgName}
      />{' '}
      {programJoinTrackingVerbiage &&
        _t('Your course grades will be recorded and progress will be tracked in the program you select.')}
    </>
  );

  if (!programOptions.length) {
    return (
      <EnrollmentChoiceModalOptionListContainer.Placeholder
        title={title}
        isMultiChoice={true}
        description={description}
      />
    );
  }

  return (
    <EnrollmentChoiceModalOptionListContainer title={title} isMultiChoice={true} description={description}>
      <div id="EnrollmentChoiceModal-GroupLabel" className="sr-only">
        {_t('Learning program')}
      </div>
      {programOptions.map((program) => {
        const htmlId = `ecm~${program.programId}`;
        const session = enterpriseProgramAssociations?.[program.programId]?.session;
        return (
          <div css={styles.programListItem(theme)} key={program.programId}>
            <input
              css={styles.programListItemRadio}
              type="radio"
              id={htmlId}
              value={program.programId}
              checked={program.programId === programId}
              onChange={onChangeRadio}
            />
            <label css={styles.programListItemLabel(theme)} htmlFor={htmlId}>
              <Typography component="span">{program.programName}</Typography>
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
                    date={program.date}
                    isInvitation={program.isInvitation}
                  />
                )}
              </Typography>
              <br />
              {programsWithCredits?.includes(program.programId) && <CreditBadge />}
            </label>
          </div>
        );
      })}
    </EnrollmentChoiceModalOptionListContainer>
  );
};

export default EnrollmentChoiceModalProgramList;
