/** @jsx jsx */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import { jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { Typography, useTheme } from '@coursera/cds-core';
import Skeleton from 'bundles/program-home/components/cds/Skeleton';

type PropsFromCaller = {
  title?: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  isMultiChoice: boolean;
};

type Props = PropsFromCaller;

type PropsForPlaceholder = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  isMultiChoice?: boolean;
  shouldRenderItemDescriptions?: boolean;
};

const styles = {
  section: (theme: Theme) => ({
    margin: theme.spacing(32, 48, 0, 48),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(24, 16, 0, 16),
    },
  }),
  description: (theme: Theme) => ({
    marginTop: theme.spacing(8),
  }),
  listItem: (theme: Theme) => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    margin: theme.spacing(16, 0),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(16, 0),
    },
  }),
  listItemRadio: {
    // Global CSS messes with this, so punch it with !important
    margin: '0 0 0 0 !important',
    zoom: 2,
    flexShrink: 0,
  },
  listItemLabelMultiChoice: (theme: Theme) => ({
    margin: theme.spacing(0, 0, 0, 12),
    flexGrow: 1,
  }),
  listItemLabel: {
    flexGrow: 1,
  },
};

const EnrollmentChoiceModalOptionListContainer = ({ title, description, isMultiChoice, children }: Props) => {
  const theme = useTheme();

  // ---

  return (
    <div css={styles.section(theme)}>
      {title && (
        <Typography variant="h3bold" component="h3">
          {title}
        </Typography>
      )}
      <Typography variant="body1" css={styles.description(theme)}>
        {description}
      </Typography>
      {isMultiChoice && (
        <div role="group" aria-labelledby="EnrollmentChoiceModal-GroupLabel">
          {children}
        </div>
      )}
      {!isMultiChoice && children}
    </div>
  );
};

const EnrollmentChoiceModalOptionListContainerPlaceholder = ({
  title = <Skeleton width="30%" />,
  description = (
    <>
      <Skeleton width="100%" />
      <Skeleton width="100%" />
      <Skeleton width="60%" />
    </>
  ),
  isMultiChoice = true,
  shouldRenderItemDescriptions = true,
}: PropsForPlaceholder) => {
  const theme = useTheme();

  // ---

  return (
    <EnrollmentChoiceModalOptionListContainer title={title} description={description} isMultiChoice={isMultiChoice}>
      {isMultiChoice ? (
        <>
          <div css={styles.listItem(theme)}>
            <input css={styles.listItemRadio} type="radio" tabIndex={-1} disabled />
            <span css={styles.listItemLabelMultiChoice(theme)}>
              <Typography component="span">
                <Skeleton width="25%" />
              </Typography>
              {shouldRenderItemDescriptions && <br />}
              {shouldRenderItemDescriptions && (
                <Typography variant="body2" color="supportText" component="span">
                  <Skeleton width="50%" />
                </Typography>
              )}
            </span>
          </div>
          <div css={styles.listItem(theme)}>
            <input css={styles.listItemRadio} type="radio" tabIndex={-1} disabled />
            <span css={styles.listItemLabelMultiChoice(theme)}>
              <Typography component="span">
                <Skeleton width="30%" />
              </Typography>
              {shouldRenderItemDescriptions && <br />}
              {shouldRenderItemDescriptions && (
                <Typography variant="body2" color="supportText" component="span">
                  <Skeleton width="47%" />
                </Typography>
              )}
            </span>
          </div>
          <div css={styles.listItem(theme)}>
            <input css={styles.listItemRadio} type="radio" tabIndex={-1} disabled />
            <span css={styles.listItemLabelMultiChoice(theme)}>
              <Typography component="span">
                <Skeleton width="22%" />
              </Typography>
              {shouldRenderItemDescriptions && <br />}
              {shouldRenderItemDescriptions && (
                <Typography variant="body2" color="supportText" component="span">
                  <Skeleton width="53%" />
                </Typography>
              )}
            </span>
          </div>
        </>
      ) : (
        <div css={styles.listItem(theme)}>
          <span css={styles.listItemLabel}>
            <Typography component="span">
              <Skeleton width="25%" />
            </Typography>
            {shouldRenderItemDescriptions && <br />}
            {shouldRenderItemDescriptions && (
              <Typography variant="body2" color="supportText" component="span">
                <Skeleton width="50%" />
              </Typography>
            )}
          </span>
        </div>
      )}
    </EnrollmentChoiceModalOptionListContainer>
  );
};

EnrollmentChoiceModalOptionListContainer.Placeholder = EnrollmentChoiceModalOptionListContainerPlaceholder;

export default EnrollmentChoiceModalOptionListContainer;
