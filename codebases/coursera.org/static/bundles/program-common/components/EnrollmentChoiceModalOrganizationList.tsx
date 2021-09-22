/** @jsx jsx */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import _t from 'i18n!nls/program-common';
import { jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { useTheme, Typography } from '@coursera/cds-core';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import EnrollmentChoiceModalOptionListContainer from 'bundles/program-common/components/EnrollmentChoiceModalOptionListContainer';

type PropsFromCaller = {
  productType: string;
  orgOptions: OrganizationOption[];
  orgId?: string;
  onChangeRadio: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type OrganizationOption = {
  id: string;
  name: string;
};

type Props = PropsFromCaller;

const styles = {
  orgListItem: (theme: Theme) => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    margin: theme.spacing(16, 0),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(16, 0),
    },
  }),
  orgListItemRadio: {
    // Global CSS messes with this, so punch it with !important
    margin: '0 0 0 0 !important',
    zoom: 2,
    flexShrink: 0,
  },
  orgListItemLabel: (theme: Theme) => ({
    margin: theme.spacing(0, 0, 0, 12),
    flexGrow: 1,
  }),
};

const EnrollmentChoiceModalOrganizationList = ({ productType, orgOptions, orgId, onChangeRadio }: Props) => {
  const theme = useTheme();

  // ---
  return (
    <EnrollmentChoiceModalOptionListContainer
      title={_t('Select an organization:')}
      isMultiChoice={true}
      description={
        <FormattedMessage
          message={_t(
            'This {productType, select, course {course} s12n {specialization}} is available in {orgCount, plural, =1 {# organization} other {# organizations}} that you belong to. Your {productType, select, course {course} s12n {specialization}} will be tracked in the organization you select.'
          )}
          productType={productType}
          orgCount={orgOptions.length}
        />
      }
    >
      <div id="EnrollmentChoiceModal-GroupLabel" className="sr-only">
        {_t('Organization')}
      </div>
      {orgOptions.map((org) => {
        const htmlId = `ecm~${org.id}`;
        return (
          <div css={styles.orgListItem(theme)} key={org.id}>
            <input
              css={styles.orgListItemRadio}
              type="radio"
              id={htmlId}
              value={org.id}
              checked={org.id === orgId}
              onChange={onChangeRadio}
            />
            <label css={styles.orgListItemLabel(theme)} htmlFor={htmlId}>
              <Typography component="span">{org.name}</Typography>
            </label>
          </div>
        );
      })}
    </EnrollmentChoiceModalOptionListContainer>
  );
};

export default EnrollmentChoiceModalOrganizationList;
