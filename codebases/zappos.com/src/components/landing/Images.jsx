import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import LandingPageLink from 'components/landing/LandingPageLink';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import styles from 'styles/components/landing/images.scss';

export const Images = (props, { testId }) => {
  const { slotDetails, slotName, className, onComponentClick, slotIndex } = props;
  const { images, monetateId } = slotDetails;

  const shoppableLink = useMemo(() => images?.some(({ href }) => href), [images]);

  useEffect(() => {
    track(() => ([evHeroImpression, {
      slotDetails, slotIndex, slotName, heroCount: images?.length, shoppableLink
    }]));
  }, [images, shoppableLink, slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount: 1, shoppableLink }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName, shoppableLink]);

  if (slotDetails && images) {
    return (
      <div className={className || styles.imagesWrapper} data-test-id={testId('landingPageImages')} data-monetate-id={monetateId}>
        {images.map(image => {
          const { src, msrc, href, alt, width, title, gae } = image;
          if (href) {
            const linkProps = {
              'key': msrc || src,
              'onClick': onClick,
              'data-eventlabel': 'Promos',
              'data-eventvalue': gae,
              'data-slotindex': slotIndex
            };
            return (
              <LandingPageLink key={href} url={href} {...linkProps}>
                <img
                  src={msrc || src}
                  alt={alt}
                  width={width}
                  title={title}
                  data-te={props['data-te']}
                />
              </LandingPageLink>
            );
          } else {
            return <img
              key={msrc || src}
              src={msrc || src}
              alt={alt}
              width={width}
              title={title} />;
          }
        })}
      </div>
    );
  } else {
    return false;
  }
};

Images.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('Images', Images);
