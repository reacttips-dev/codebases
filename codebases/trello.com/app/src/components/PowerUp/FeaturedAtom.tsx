/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import React from 'react';

import { DescriptionAtom } from './DescriptionAtom';
import { FeaturedAtomProps } from './types';

// eslint-disable-next-line @trello/less-matches-component
import styles from './PowerUp.less';

export const FeaturedAtom: React.FunctionComponent<FeaturedAtomProps> = ({
  className,
  heroImageUrl,
  ...props
}) => {
  let src = '';
  const srcSet = [];
  if (heroImageUrl) {
    if (heroImageUrl['@1x']) {
      src = heroImageUrl['@1x'];
      srcSet.push(heroImageUrl['@1x']);
    }
    if (heroImageUrl['@2x']) {
      srcSet.push(`${heroImageUrl['@2x']} 2x`);
    }
  }

  return (
    <div className={classNames(styles.featuredAtomContainer, className)}>
      <img
        alt=""
        className={styles.heroImage}
        role="presentation"
        src={src}
        srcSet={srcSet.join(', ')}
      />
      <DescriptionAtom className={styles.featuredAtom} {...props} />
    </div>
  );
};

export default FeaturedAtom;
