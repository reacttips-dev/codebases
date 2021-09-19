import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { stripSpecialChars } from 'helpers';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageImage from 'components/landing/LandingPageImage';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyArticleImages.scss';

const MelodyArticleImage = ({ image, onComponentClick, slotName, slotDetails, slotIndex, index, shouldLazyLoad, isSingleImage }) => {
  const { src, link, alt, gae, copy } = image;

  useEffect(() => {
    track(() => [evHeroImpression, {
      slotName, slotIndex, slotDetails: { ...slotDetails, ...image }, heroCount: slotDetails.images.length
    }]);
  }, [image, slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, {
      slotDetails: { ...slotDetails, ...image }, slotIndex, slotName, heroCount: slotDetails.images.length
    }]));
  }, [image, onComponentClick, slotDetails, slotIndex, slotName]);

  const linkProps = {
    'key': `${stripSpecialChars(link)}_${index}`,
    'onClick': onClick,
    'data-eventlabel': 'melodyArticleImages',
    'data-eventvalue': gae,
    'data-slotindex': slotIndex
  };

  const contents = (
    <figure className={cn(css.articleImage, { [css.singleImage]: isSingleImage })} key={`${stripSpecialChars(src)}_${index}`}>
      <LandingPageImage src={src} alt={alt} shouldLazyLoad={shouldLazyLoad} />
      <figcaption>{copy}</figcaption>
    </figure>
  );
  return link
    ?
    <LandingPageLink key={link} url={link} {...linkProps}>
      {contents}
    </LandingPageLink>
    :
    contents;
};

export const MelodyArticleImages = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }) => {
  const { images, heading, body, monetateId } = slotDetails;

  return (
    <article
      className={css.wrap}
      data-slot-id={slotName}
      data-monetate-id={monetateId}
    >
      {heading && <h3>{heading}</h3>}
      <HtmlToReact>{body}</HtmlToReact>
      {images?.length && <div className={css.articleImagesWrap}>
        {images.map((image, index) =>
          <MelodyArticleImage
            image={image}
            slotName={slotName}
            key={image.src}
            index={index}
            slotDetails={slotDetails}
            onComponentClick={onComponentClick}
            slotIndex={slotIndex}
            isSingleImage={images.length === 1}
            shouldLazyLoad={shouldLazyLoad}/>
        )}
      </div>}
    </article>
  );
};

export default withErrorBoundary('MelodyArticleImages', MelodyArticleImages);
