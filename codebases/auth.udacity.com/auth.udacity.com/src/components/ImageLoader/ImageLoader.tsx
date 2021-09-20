import React, { useState, useEffect, useMemo } from "react";
import classNames from "classnames";
import utils from "./ImageLoaderUtils";

export const PREFIX = "vds-image-loader";

/** ImageLoader Props */

export interface ImageLoaderProps {
  /** URL to full-scale image */
  src: string;

  /** URL to the low-scale placeholder image */
  placeholder?: string;

  /** Height of the image, in pixels or percentage */
  height: string;

  /** Width of the image, in pixels or percentage */
  width: string;

  /** Label describing the image for accessibility */
  label: string;

  /** Callback when full-scale image has loaded */
  onLoad?(): void;

  /** Callback when the image is clicked */
  onClick?(): void;

  /** Children to render over the background image */
  children?: React.ReactNode;
}

/**
 * ImageLoader is a progressive image loader. It will first display a low-scale placeholder
 * image, and will then transition to the full-scale image once it has loaded.
 */
const ImageLoader: React.FC<ImageLoaderProps> = ({
  children,
  height,
  label,
  onLoad,
  onClick,
  placeholder,
  src,
  width
}: ImageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  const containerClass = classNames(
    PREFIX,
    `${PREFIX}--${loading ? "loading" : "loaded"}`,
    onClick && `${PREFIX}--clickable`
  );
  const placeholderClass = classNames(`${PREFIX}__placeholder`);
  const imageClass = classNames(`${PREFIX}__full`);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const handleImageLoad = (): void => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const containerStyle = useMemo(
    (): { height: string; width: string } => ({
      height,
      width
    }),
    [height, width]
  );

  const placeholderUrl = useMemo((): string | undefined => {
    let url = placeholder;
    if (!url && utils.isTopherUrl(src)) {
      url = utils.getTopherPlaceholder(src);
    }
    return url;
  }, [placeholder, src]);

  const placeholderStyle = useMemo(
    (): { backgroundImage: string } => ({
      backgroundImage: `url(${placeholderUrl})`
    }),
    [placeholderUrl]
  );

  const imageStyle = useMemo(
    (): { backgroundImage: string } => ({
      backgroundImage: `url(${src})`
    }),
    [src]
  );

  return (
    <div
      className={containerClass}
      style={containerStyle}
      onClick={onClick}
      role={onClick && "button"}
    >
      {/** Hidden image so we can track when the source image is finished loading */}
      <img hidden src={src} onLoad={handleImageLoad} />

      {placeholderUrl && (
        <div className={placeholderClass} style={placeholderStyle}>
          {/** When image is still loading, show children in the placeholder div */}
          {loading && children}
        </div>
      )}

      <div aria-label={label} className={imageClass} style={imageStyle}>
        {/** Once image has loaded, show children in the main dev */}
        {!loading && children}
      </div>
    </div>
  );
};

export default ImageLoader;
