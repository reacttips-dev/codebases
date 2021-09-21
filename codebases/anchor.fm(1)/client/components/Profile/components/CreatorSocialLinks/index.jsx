import React from 'react';
import classNames from 'classnames';
import styles from './styles.sass';
import { addProtocol, sortSocialLinks } from './utils';

import { CreatorLink } from '../CreatorSocialLink';

export const CreatorSocialLinks = ({
  creatorUrl,
  socialUrls = {
    facebook: '',
    youtube: '',
    instagram: '',
    twitter: '',
  },
}) => {
  const links = { ...socialUrls, website: creatorUrl };
  const activeLinks = Object.keys(links).filter(platform => links[platform]);
  return (
    <div
      className={classNames(styles.container, {
        [styles.singleUrlContainer]: activeLinks.length === 1,
      })}
    >
      {activeLinks.sort(sortSocialLinks).map((platform, _, arr) => {
        const url =
          platform === 'website'
            ? links[platform]
            : addProtocol(`${platform}.com/${socialUrls[platform]}`);
        return (
          <CreatorLink
            platform={platform}
            url={url}
            key={`${platform}-socialLink`}
            isSingle={arr.length === 1}
          />
        );
      })}
    </div>
  );
};
