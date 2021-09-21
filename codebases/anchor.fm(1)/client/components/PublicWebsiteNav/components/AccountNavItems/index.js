import React from 'react';
import PropTypes from 'prop-types';
import { DropdownMenuContainer } from '../../../DropdownMenu/DropdownMenuContainer';
import { getAccountLinks } from '../../modules/getAccountLinks';

import Text from '../../../../shared/Text/index.tsx';
import Box from '../../../../shared/Box';
import Link from '../../../Link';
import Img from '../../../Img';
import { Caret } from '../../../../shared/Caret';

import LinkStyles from '../../LinkStyles.sass';
import { useCurrentUserCtx } from '../../../../contexts/CurrentUser';

const isShowingCoverArt = podcastImage =>
  podcastImage &&
  podcastImage !==
    'https://d12xoj7p9moygp.cloudfront.net/images/default-podcast-image.png';

const renderCoverArt = imageUrl => (
  <Box
    marginRight={10}
    dangerouslySetInlineStyle={{ borderRadius: '2px' }}
    minWidth={28}
    overflow="hidden"
  >
    <Img
      height={28}
      width={28}
      src={
        imageUrl ||
        `https://d12xoj7p9moygp.cloudfront.net/images/avatars/cover_art_placeholder.png`
      }
      alt="Podcast cover art"
    />
  </Box>
);

const AccountNavItems = ({
  onLogOut,
  podcastName,
  podcastImage,
  showNetworkLinks,
  isSaiOrVodcast,
}) => {
  const { resetCurrentUser } = useCurrentUserCtx();
  const menuItems = getAccountLinks([
    {
      label: 'Log out',
      icon: {
        type: 'PowerIcon',
        iconColor: '#c9cbcd',
        backgroundColor: 'transparent',
        width: 18,
        padding: 0,
      },
      onClick: e => {
        onLogOut(e);
        resetCurrentUser();
      },
    },
  ]);
  const isShowingPodcastCoverOrName =
    isShowingCoverArt(podcastImage) && podcastName;
  return (
    <DropdownMenuContainer
      shouldShowDistributionItem={true}
      renderPressableContent={() => (
        <Box display="flex" alignItems="center">
          {isShowingPodcastCoverOrName && renderCoverArt(podcastImage)}
          <span className={LinkStyles.settings}>
            Settings <Caret className={LinkStyles.caret} />
          </span>
        </Box>
      )}
      renderMenuHeader={
        isShowingPodcastCoverOrName ? (
          <Box display="flex" alignItems="center">
            {isShowingCoverArt(podcastImage) && renderCoverArt(podcastImage)}
            <Text color="#292f36" isBold size="md" isInline>
              {podcastName.slice(0, 57)}
              {podcastName.length > 57 ? '…' : ''}
            </Text>
          </Box>
        ) : null
      }
      renderMenuFooter={
        showNetworkLinks && !isSaiOrVodcast ? (
          <Link to="/dashboard/podcastnetwork" className={LinkStyles.link}>
            <Box
              width="100%"
              height={48}
              paddingLeft={14}
              paddingRight={14}
              display="flex"
              alignItems="center"
            >
              <Text color="#292f36" isBold size="xl" isInline>
                Podcast Network
              </Text>
            </Box>
          </Link>
        ) : null
      }
      menuItems={menuItems}
    />
  );
};

AccountNavItems.propTypes = {
  onLogOut: PropTypes.func.isRequired,
  podcastName: PropTypes.string,
  podcastImage: PropTypes.string,
};

AccountNavItems.defaultProps = {
  podcastName: null,
  podcastImage: null,
};

export { AccountNavItems };
