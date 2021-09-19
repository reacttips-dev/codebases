import React, { ReactNode } from 'react';
import cn from 'classnames';

import { ImageProps, LazyImage } from 'components/common/Image';

import css from 'styles/components/common/card/cardMedia.scss';

interface CardMediaProps {
  imageIndex?: number;
  isHovered?: boolean;
  mainImage: ImageProps;
  hoverImage?: ImageProps;
  children?: ReactNode;
  className?: string;
  forceLoadIndex?: number;
  imageNoBackground?: boolean;
  fullSizeImage?: boolean;
}

const CardMedia = ({ className, imageIndex, isHovered, mainImage, hoverImage, forceLoadIndex, imageNoBackground = false, fullSizeImage = false, children }: CardMediaProps) => {
  const forceLoad = imageIndex !== undefined && forceLoadIndex !== undefined && imageIndex < forceLoadIndex;
  return <div className={cn(
    className,
    css.imageWrapper,
    { [css.hovered]: isHovered && hoverImage?.src, [css.fullSizeImage]: fullSizeImage },
    // .imageNoBackground exists but is nested under a :not() which the linter
    // has trouble reading.
    // eslint-disable-next-line css-modules/no-undef-class
    { [css.imageNoBackground]: imageNoBackground }
  )}>
    {children}
    <figure>
      <meta itemProp="image" content={mainImage.src} />
      <LazyImage
        forceLoad={forceLoad}
        className={css.mainImage}
        {...mainImage}/>
      {hoverImage && <LazyImage
        forceLoad={forceLoad}
        className={css.hoverImage}
        {...hoverImage}/>}
    </figure>
  </div>;
};

export default CardMedia;
