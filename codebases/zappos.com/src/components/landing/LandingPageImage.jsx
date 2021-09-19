import ImageLazyLoader from 'components/common/ImageLazyLoader';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

const SrcSet = ({ media, srcset, bp, reg, ret }) => {
  const mediaAttribute = media ? media : `(max-width: ${bp})`;
  if (!reg && !srcset) {
    return null;
  }
  if (!srcset) {
    srcset = reg;
    if (ret) {
      srcset += `, ${ret} 2x`;
    }
  }
  return (<source key={bp + reg} media={mediaAttribute} srcSet={srcset} />);
};

/**
* Render images with different src files depending on what SiteMerch populates in Symphony
*/
export const LandingPageImage = ({
  src = null,
  srcset = null,
  mobilesrc = null,
  tabletsrc = null,
  retina = null,
  mobileretina = null,
  tabletretina = null,
  mobileSrcSetBreakpoint = '650px',
  tabletSrcSetBreakpoint = '1024px',
  sources = null,
  alt = null,
  title = null,
  width = null,
  height = null,
  role = null,
  itemProp = null,
  shouldLazyLoad = false,
  className = null,
  imgTestId = null
}) => {

  let pictureProps;
  if (sources?.length) {
    pictureProps = sources.map(({ media, srcset }) => <SrcSet key={srcset + media} media={media} srcset={srcset} />);
  } else {
    pictureProps = [
      <SrcSet
        bp={mobileSrcSetBreakpoint}
        key={mobileSrcSetBreakpoint}
        reg={mobilesrc}
        ret={mobileretina}/>,
      <SrcSet
        bp={tabletSrcSetBreakpoint}
        key={tabletSrcSetBreakpoint}
        reg={tabletsrc}
        ret={tabletretina}/>
    ];
  }

  const altString = !alt || alt === '""' ? '' : alt;
  const srcSet = srcset || (retina ? `${retina} 2x, ${src} 1x` : null);
  const imgProps = { src, title, width, height, srcSet, role, itemProp, 'alt': altString, 'data-test-id': imgTestId };

  if (src) {
    if (shouldLazyLoad) {
      return <ImageLazyLoader
        className={className}
        imgProps={imgProps}
        pictureProps={pictureProps}/>;
    } else {
      return (
        <picture>
          {pictureProps}
          <img
            src={src}
            alt={altString}
            title={title}
            width={width}
            height={height}
            srcSet={srcSet}
            role={role}
            itemProp={itemProp}
            data-test-id={imgTestId}
          />
        </picture>
      );
    }
  }
  return null;
};

export default withErrorBoundary('LandingPageImage', LandingPageImage);
