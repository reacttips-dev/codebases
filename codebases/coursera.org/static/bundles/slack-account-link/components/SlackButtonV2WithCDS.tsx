import React from 'react';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import SvgSlack from 'bundles/third-party-auth/components/SvgSlack';
import { Button } from '@coursera/cds-core';
import { Link as ReactRouterLink } from 'react-router';

type Props = {
  slackLink?: string;
  buttonText?: string;
  className?: string;
  'aria-label': string;
  onClick?: (event: React.SyntheticEvent<HTMLElement>) => void;
  trackingName?: string;
  buttonVariant?: 'secondary' | 'primary' | 'primaryInvert' | 'ghost' | 'ghostInvert';
};

const SlackButtonV2WithCDS = ({
  slackLink = '',
  buttonText = 'Slack',
  'aria-label': ariaLabel,
  onClick,
  buttonVariant = 'secondary',
}: Props) => {
  return (
    <Button
      size="small"
      component={ReactRouterLink}
      href={slackLink}
      target="_blank"
      aria-label={ariaLabel}
      variant={buttonVariant}
      icon={<SvgSlack size={20} />}
      iconPosition="before"
    >
      {buttonText}
    </Button>
  );
};

export default SlackButtonV2WithCDS;
