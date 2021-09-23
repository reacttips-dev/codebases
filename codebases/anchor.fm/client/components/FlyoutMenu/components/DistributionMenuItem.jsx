import React from 'react';
import Box from '../../../shared/Box';
import Link from '../../Link';
import styles from '../styles.sass';
import DistributionSVG from '../../svgs/Distribution';
import { Text } from '../../../shared/Text/index';

export const DistributionMenuItem = ({ onClickMenuItem }) => (
  <Box
    dangerouslySetInlineStyle={{
      borderBottom: '2px solid #dfe0e1',
    }}
    paddingTop={14}
    paddingBottom={14}
    display="flex"
    alignItems="center"
  >
    <Link
      to="/dashboard/podcast/distribution"
      style={{ display: 'block', width: '100%' }}
      className={styles.distributionLinkContainer}
      onClick={onClickMenuItem}
    >
      <div className={`${styles.link} ${styles.distributionLink}`}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginRight={14}
          marginLeft={14}
        >
          <DistributionSVG color="#c9cbcd" width={24} height={24} />
        </Box>
        <Text color="#292f36" isBold size="xl" isInline>
          Podcast availability
        </Text>
      </div>
    </Link>
  </Box>
);
