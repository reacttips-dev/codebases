import _ from 'underscore';

import React, { useEffect } from 'react';
import { Analytics } from '@trello/atlassian-analytics';

import { PowerUpItemType } from 'app/src/components/PowerUp';
import { PowerUpsList } from './PowerUpsList';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('directory_home');

import { Plugin, Plugins } from './types';

import { Banner } from './Banner';

import { useFeatureFlag } from '@trello/feature-flag-client';

export function getPluginsByTag(plugins: Plugins, tag: string): Plugins {
  if (!plugins) {
    return [];
  }

  return plugins.filter((plugin: Plugin) => plugin.tags.includes(tag));
}

interface HomePageProps {
  readonly plugins: Plugins;
}

export const sortFeaturedPowerUps = (featuredPowerUps: Plugins) => {
  const toSort = [];
  const toShuffle = [];

  for (const powerUp of featuredPowerUps) {
    if (powerUp.tags.find((tag) => /^pos-\d+$/.test(tag))) {
      toSort.push(powerUp);
    } else {
      toShuffle.push(powerUp);
    }
  }

  const sortedPowerUps = _.sortBy(toSort, (powerUp) => {
    const numericTag = powerUp.tags.find((tag) => /^pos-\d+$/.test(tag));
    if (!numericTag) {
      return 100;
    }
    const numericValue = /^pos-(\d+)$/.exec(numericTag);
    return numericValue ? parseInt(numericValue[1], 10) : 100;
  });

  const shuffledPowerUps = _.shuffle(toShuffle);

  return [...sortedPowerUps, ...shuffledPowerUps] as Plugins;
};

export const HomePage: React.FunctionComponent<HomePageProps> = ({
  plugins,
}) => {
  const essentialPowerUps = getPluginsByTag(plugins, 'essential');
  const integrations = getPluginsByTag(plugins, 'integration');
  const featuredPowerUps = sortFeaturedPowerUps(
    getPluginsByTag(plugins, 'featured'),
  );

  const showIntegrations = useFeatureFlag(
    'workflowers.show-integrations-in-pup-dir',
    false,
  );

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'publicDirectoryHomeScreen',
      attributes: {
        totalListed: featuredPowerUps.length + essentialPowerUps.length,
        isMarketingEvent: true,
      },
    });
  });

  return (
    <React.Fragment>
      <Banner
        heading="power-ups-for-trello"
        paragraph="calendars-custom-fields-repeating-cards-and-so-much-more-with-integrations-like-jira-slack-google-drive-invision-get-your-trello-superpowers-now"
      />
      <PowerUpsList
        title={format('featured-power-ups')}
        plugins={featuredPowerUps}
        type={PowerUpItemType.Featured}
      />

      {showIntegrations && (
        <PowerUpsList
          title={format('integrations')}
          plugins={integrations}
          type={PowerUpItemType.Featured}
        />
      )}

      <PowerUpsList
        title={format('essential-power-ups')}
        plugins={essentialPowerUps}
        type={PowerUpItemType.Featured}
      />
    </React.Fragment>
  );
};
