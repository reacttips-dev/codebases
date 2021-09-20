import { PowerUpTestIds } from '@trello/test-ids';
import classnames from 'classnames';
import React from 'react';

import TrelloMarkdown from '@atlassian/trello-markdown';

import { PowerUp, PowerUpItemType } from 'app/src/components/PowerUp';
import { HeroImageUrl } from 'app/src/components/PowerUp/types';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { makeSlug } from 'app/gamma/src/util/url';

import styles from './PowerUpItem.less';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('directory_power_up_item');

import { defaultRouter } from 'app/src/router';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { Plugin } from './types';
import { useFeatureFlag } from '@trello/feature-flag-client';
import {
  microsoftTeamsId,
  microsoftTeamsUrl,
  gmailId,
  gmailUrl,
} from '@trello/config';

interface PowerUpItemProps {
  readonly type: PowerUpItemType;
  readonly plugin: Plugin;
}

// eslint-disable-next-line @trello/no-module-logic
const markdown = new TrelloMarkdown();

const getDescription = (plugin: Plugin): string => {
  const { listing } = plugin;
  const overview = listing ? listing.overview : '';
  const description = listing ? listing.description : '';

  return markdown.text(overview || description || '').output;
};

const getPluginTrackingName = (plugin: Plugin) => {
  // We only want to include public power-up names in
  // GAS events to avoid UGC violations for private power-ups
  const pluginName = plugin.listing ? plugin.listing.name : '';
  return plugin.public ? pluginName : undefined;
};

const navigateToListing = (
  e: React.MouseEvent<Element>,
  props: PowerUpItemProps,
) => {
  if ((e.target as HTMLElement).tagName !== 'BUTTON') {
    const { plugin, type } = props;
    const pluginName = plugin.listing ? plugin.listing.name : '';
    if (type !== PowerUpItemType.Basic) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'card',
        actionSubjectId: 'powerUpCard',
        objectType: 'powerUp',
        objectId: plugin.id,
        source: 'publicDirectoryScreen',
        attributes: {
          powerUpName: plugin.public ? pluginName : undefined,
          tags: plugin.tags,
        },
      });

      defaultRouter.setRoute(`/power-ups/${plugin.id}/${makeSlug(pluginName)}`);
    }
  }
};

const AddButton: React.FunctionComponent<PowerUpItemProps> = ({ plugin }) => {
  return (
    <RouterLink
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        Analytics.sendClickedButtonEvent({
          buttonName: 'powerUpAddButton',
          source: 'powerUpCard',
          attributes: {
            powerUpId: plugin.id,
            powerUpName: getPluginTrackingName(plugin),
            isPowerUpPublic: plugin.public,
            idOrganizationOwner: plugin.idOrganizationOwner,
            tags: plugin.tags,
          },
        });
      }}
      href={`/power-ups/${plugin.id}/enable`}
      className={styles.buttonAnchor}
    >
      <Button
        appearance="primary"
        className={styles.addButton}
        data-test-id={PowerUpTestIds.AddPowerUpButton}
      >
        {format('add')}
      </Button>
    </RouterLink>
  );
};

const ConfigureButton: React.FunctionComponent<PowerUpItemProps> = ({
  plugin,
}) => {
  const pluginName = plugin.listing?.name ?? '';

  let configureUrl;
  if (plugin.id === microsoftTeamsId) {
    configureUrl = microsoftTeamsUrl;
  } else if (plugin.id === gmailId) {
    configureUrl = gmailUrl;
  } else {
    return <></>;
  }

  return (
    <RouterLink
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'powerUpAddButton',
          objectType: 'powerUp',
          objectId: plugin.id,
          source: 'powerUpCard',
          attributes: {
            powerUpName: plugin.public ? pluginName : undefined,
            tags: plugin.tags,
          },
        });
      }}
      href={configureUrl}
      className={styles.buttonAnchor}
      target="_blank"
    >
      <Button appearance="primary" className={styles.addButton}>
        {format('configure')}
      </Button>
    </RouterLink>
  );
};

export const PowerUpItem: React.FunctionComponent<PowerUpItemProps> = (
  props,
) => {
  const { plugin, type } = props;
  const { icon, listing } = plugin;
  const showIntegrations = useFeatureFlag(
    'workflowers.show-integrations-in-pup-dir',
    false,
  );
  let heroImageUrl = plugin.heroImageUrl as HeroImageUrl | undefined | null;

  if (plugin.heroImageUrl && typeof plugin.heroImageUrl === 'string') {
    heroImageUrl = JSON.parse(plugin.heroImageUrl);
  }

  const containerClassNames = classnames(styles.powerUpItem, {
    [styles.listingPowerUpItem]: type === PowerUpItemType.Basic,
  });

  const isIntegration =
    showIntegrations && (plugin.tags || []).includes('integration');

  return (
    <div
      className={containerClassNames}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(e) => navigateToListing(e, props)}
      role="presentation"
    >
      <PowerUp
        type={type}
        atomProps={{
          overview: getDescription(plugin),
          icon,
          heroImageUrl,
          name: listing ? listing.name : '',
          promotional: (plugin.tags || []).includes('promotional'),
          staffPick: (plugin.tags || []).includes('staff-pick'),
          usage: (plugin.usageBrackets || {}).boards || 0,
          button: isIntegration ? (
            <ConfigureButton {...props} />
          ) : (
            <AddButton {...props} />
          ),
          integration: isIntegration,
        }}
      />
    </div>
  );
};
