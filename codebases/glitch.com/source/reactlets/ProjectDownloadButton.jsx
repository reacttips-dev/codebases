import { Button } from '@glitchdotcom/shared-components';
import React from 'react';

/**
 *
 * @param {*} application - the application object
 * @param {*} location - like "Glitch Subscription Required Overlay", or "Uptime Limits Exceeded Overlay"
 */
export default function ProjectDownloadButton({ application, location }) {
  return (
    <Button
      variant="secondary"
      size="small"
      as="a"
      href={application.projectDownloadUrl()}
      onClick={() => application.analytics.track('Project Downloaded', { clickLocation: `${location}` })}
      data-testid={`${location.toLowerCase().replace(' ', '-')}-download`}
    >
      Download Project
    </Button>
  );
}
