import React from 'react';
import { PODCAST_URL_HOSTS } from '../../../../screens/DistributionScreen/constants.ts';
import { attributesByHost } from '../../../../station';
import { Box } from '../../../../shared/Box/index.tsx';
import Heading from '../../../../shared/Heading';
import { ListeningPlatform } from '../ListeningPlatform';
import { CopyRSS } from '../CopyRSS';
import styles from '../../styles.sass';

const ListeningPlatforms = ({ podcastUrlDictionary, isMobile, stationId }) => {
  const platforms = Object.keys(PODCAST_URL_HOSTS)
    .reduce((hosts, key) => {
      const host = PODCAST_URL_HOSTS[key];
      if (key === 'stationId' || !podcastUrlDictionary[host]) return hosts;
      return [
        ...hosts,
        {
          host,
          priority: isMobile ? 0 : 2,
          link: podcastUrlDictionary[host],
          attributes: attributesByHost.get(host),
        },
      ];
    }, [])
    .sort((a, b) => {
      if (a.priority === b.priority) {
        return a.attributes.displayName.localeCompare(b.attributes.displayName);
      }
      return a.priority - b.priority;
    });
  return (
    <div className={styles.listeningPlatforms}>
      <Box marginBottom={16}>
        <h5 className={styles.listeningPlatformTitle}>Where to listen</h5>
      </Box>
      <Box display="flex">
        {platforms.map(({ host, link, attributes }) => (
          <ListeningPlatform
            host={host}
            link={link}
            attributes={attributes}
            key={`${link}-ListeningPlatforms`}
          />
        ))}
        <CopyRSS stationId={stationId} />
      </Box>
    </div>
  );
};

export { ListeningPlatforms };
