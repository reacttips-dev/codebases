import React from 'react';
import SvgSlack from 'bundles/third-party-auth/components/SvgSlack';
import 'css!./__styles__/SlackButtonV2';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

type Props = {
  slackLink?: string;
  buttonText?: string;
  className?: string;
  'aria-label': string;
  onClick?: (event: React.SyntheticEvent<HTMLElement>) => void;
  trackingName?: string;
};

const SlackButtonV2 = ({
  slackLink = '',
  className,
  buttonText = 'Slack',
  'aria-label': ariaLabel,
  onClick,
  trackingName = 'slack-button',
}: Props) => {
  function clickHandler(event: React.SyntheticEvent<HTMLElement>) {
    if (onClick) {
      event.preventDefault();
      onClick(event);
    }
  }

  const componentClassName = className ? `rc-SlackButtonV2 ${className}` : 'rc-SlackButtonV2';

  return (
    <TrackedA
      className={componentClassName}
      trackingName={trackingName}
      href={slackLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={clickHandler}
    >
      <SvgSlack size={35} />
      <div className="slack-label">{buttonText}</div>
    </TrackedA>
  );
};

export default SlackButtonV2;
