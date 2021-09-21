import React from 'react';
import classNames from 'classnames';
import OutboundLink from '../../OutboundLink';
import styles from './CreatorSocialLinks/styles.sass';
import { addProtocol, typeByPlatform } from './CreatorSocialLinks/utils';
import { getProviderData } from '../../../screens/SettingsScreen/components/SocialConnection';
import { Icon } from '../../../shared/Icon';
import { LinkIcon } from '../../../shared/Icon/components/LinkIcon';

export const CreatorLink = ({ platform, url, isSingle }) => {
  if (!url) return null;
  const { label } = getProviderData(platform);
  if (isSingle)
    return (
      <a
        href={addProtocol(url)}
        className={classNames(styles.singleUrl, styles[platform])}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.singleUrlLabel}>{label}</span>
        {platform === 'website' ? (
          <LinkIcon className={styles.linkIcon} fillColor="#FFFFFF" />
        ) : (
          <Icon type={typeByPlatform(platform)} fillColor="#FFFFFF" />
        )}
      </a>
    );
  return (
    <OutboundLink
      className={classNames(styles.userUrl, styles[`${platform}Icon`])}
      newWindow
      isUserGeneratedContent
      to={addProtocol(url)}
    >
      {platform === 'website' ? (
        <LinkIcon fillColor="#FFFFFF" className={styles.linkIcon} />
      ) : (
        <Icon type={typeByPlatform(platform)} isInCircle fillColor="#FFFFFF" />
      )}
    </OutboundLink>
  );
};
