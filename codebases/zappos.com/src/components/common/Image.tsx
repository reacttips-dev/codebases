import React, { ImgHTMLAttributes, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { SmallLoader } from 'components/Loader';
import IntersectionObserver from 'components/common/IntersectionObserver';
import { combineSideEffects } from 'helpers/index';
import { BLANK_IMAGE_PLACEHOLDER } from 'constants/appConstants';

import css from 'styles/components/common/image.scss';

const defaultProps = {
  placeholder: <div className={css.placeholder}><SmallLoader/></div>,
  forceLoad: false
};

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & Partial<typeof defaultProps>;
const Image = ({ onLoad, placeholder, className, forceLoad, ...rest }: ImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const showPlaceholder = placeholder && !loaded && !forceLoad;
  return <>
    { showPlaceholder && placeholder}
    <img alt="" className={cn(className, css.image, { [css.loaded] : loaded })} onLoad={combineSideEffects(onLoad, () => setLoaded(true))} {...rest}/>
  </>;
};

Image.propTypes = {
  src: PropTypes.string.isRequired
};

Image.defaultProps = defaultProps;

export const LazyImage = ({ placeholder, forceLoad, ...rest }: ImageProps) => {
  const placeholderWithEmptyImage = <>
    {placeholder}
    {rest.alt && <img src={BLANK_IMAGE_PLACEHOLDER} className="screenReadersOnly" alt={rest.alt} />} {/* hidden blank image place holder for screen readers. */}
  </>;
  return <IntersectionObserver placeholder={placeholderWithEmptyImage} forceLoad={forceLoad}>
    <Image placeholder={placeholder} forceLoad={forceLoad} {...rest}/>
  </IntersectionObserver>;
};

export default Image;
