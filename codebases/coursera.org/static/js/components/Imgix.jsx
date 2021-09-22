/**
 * This component works similarly to HTML <img> but runs the image through
 * [imgix](http://www.imgix.com/) to dynamically optimize for the requesting device.
 *
 * Note that even in dev it will only be able to serve images that have been landed
 * in prod. As such, if you are developing, you may want to make one revision to land
 * the assets and then begin work making the UI. With the assets in prod, the images
 * will resolve.
 *
 * Note also that once you land an image asset in prod, it can never change, due to our
 * aggressive caching. If you need to change an asset, you'll have to give it a new name.
 * Therefore if you need to iterate on the images with your code, serve them locally first
 * using a regular <img> tag. Save the use of <Imgix> and prod pushing until the image
 * assets have been finalized.
 *
 * If you have ideas for how to improve this process, please suggest in #frontend-dev.
 */
import React from 'react';
import PropTypes from 'prop-types';

import imgix from 'js/lib/imgix';

class Imgix extends React.PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired, // resolved against prodAssetsRoot
    alt: PropTypes.string.isRequired, // for accessibility
    role: PropTypes.string, // for accessibility
    width: PropTypes.number,
    height: PropTypes.number,
    rigidWidth: PropTypes.number,
    rigidHeight: PropTypes.number,
    imgParams: PropTypes.object, // REF http://www.imgix.com/docs/reference
    className: PropTypes.string,
    onLoad: PropTypes.func,
    style: PropTypes.object,
    imgRef: PropTypes.func,
    degradeForSsr: PropTypes.bool, // directive for SSR to render an image with a lower quality placeholder
  };

  state = {
    componentDidMount: false,
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  render() {
    const {
      src,
      className,
      width,
      height,
      style,
      alt,
      onLoad,
      role,
      imgParams,
      degradeForSsr,
      imgRef,
      rigidWidth,
      rigidHeight,
    } = this.props;
    const { componentDidMount } = this.state;

    const srcs = imgix.getOptimizedSrcs(src, width, height, imgParams);
    // The dpr=1 value is omitted because it is implied by the `src` attribute.
    // The dpr=3 case is rare, but because the URL is so similar it costs little
    // over a gzipped connection.
    const srcSet = srcs.dpr2 && srcs.dpr3 && `${srcs.dpr2} 2x${imgParams?.ignoreDpr3SrcSet ? '' : `, ${srcs.dpr3} 3x`}`;

    if (degradeForSsr && !componentDidMount) {
      return (
        <img
          src={srcs.degraded}
          className={className}
          style={{ maxWidth: width, maxHeight: height, ...style }}
          width={rigidWidth}
          height={rigidHeight}
          alt={alt}
          onLoad={onLoad}
          ref={imgRef}
          role={role}
        />
      );
    }

    return (
      <img
        src={srcs.dpr1}
        srcSet={srcSet}
        className={className}
        style={{ maxWidth: width, maxHeight: height, ...style }}
        width={rigidWidth}
        height={rigidHeight}
        alt={alt}
        onLoad={onLoad}
        ref={imgRef}
        role={role}
      />
    );
  }
}

/**
 * Used by caller to set an alt attribute to blank, and make explicit that the alt
 * attribute is not applicable for this <img> tag.
 *
 * From http://en.wikipedia.org/wiki/Alt_attribute :
 *
 * The W3C recommends that images that convey no information, but are purely
 * decorative, be specified in CSS rather than in the HTML markup.
 * However, it may sometimes be necessary to include a decorative image as an
 * HTML img tag. In this case, if the image truly does not add to the content,
 * then a blank alt attribute should be included in the form of alt="".
 * This makes the page navigable for users of screen readers or non-graphical
 * browsers. If (in breach of the standard) no alt attribute has been
 * supplied, then browsers that cannot display the image will still display
 * something there, e.g. the URL of the image, or a fixed text string.
 */
Imgix.DECORATIVE = '';

export default Imgix;
