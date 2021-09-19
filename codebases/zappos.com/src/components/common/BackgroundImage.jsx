import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { SmallLoader } from 'components/Loader';
import IntersectionObserver from 'components/common/IntersectionObserver';
import { combineSideEffects } from 'helpers';

import css from 'styles/components/common/backgroundImage.scss';

const BackgroundImage = ({ src, placeholder, onLoad, alt, className, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const style = { backgroundImage: `url(${src})` };
  return <>
    { !loaded && placeholder }
    <div style={style} className={cn(className, css.image, { [css.loaded] : loaded })} {...rest}/>
    <img
      hidden
      alt={alt || ''}
      src={src}
      onLoad={combineSideEffects(onLoad, () => setLoaded(true))}/>
  </>;
};

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired
};

BackgroundImage.defaultProps = {
  placeholder: <SmallLoader />
};

export default BackgroundImage;

export const LazyBackgroundImage = ({ placeholder, forceLoad, ...rest }) => (
  <IntersectionObserver forceLoad={forceLoad} placeholder={placeholder}>
    <BackgroundImage placeholder={placeholder} {...rest}/>
  </IntersectionObserver>
);
