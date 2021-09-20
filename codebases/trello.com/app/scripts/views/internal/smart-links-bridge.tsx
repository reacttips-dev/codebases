// eslint-disable-next-line @trello/disallow-filenames
import React from 'react';
import {
  SmartLink,
  SmartLinkAnalyticsContextType,
} from 'app/src/components/SmartMedia';

interface SmartLinksBridgeProps {
  url: string;
  analyticsContext: SmartLinkAnalyticsContextType;
}

export const SmartLinksBridge = ({
  url,
  analyticsContext,
}: SmartLinksBridgeProps) => {
  const plainLink = () => <a href={url}>{url}</a>;
  return (
    <SmartLink
      url={url}
      // eslint-disable-next-line react/jsx-no-bind
      plainLink={plainLink}
      analyticsContext={analyticsContext}
    />
  );
};
