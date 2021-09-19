import React, { ReactNode } from 'react';
import cn from 'classnames';

import ImageLazyLoader from 'components/common/ImageLazyLoader';
import MelodyCarousel from 'components/common/MelodyCarousel';
import useMartyContext from 'hooks/useMartyContext';
import { ProductStyle } from 'types/cloudCatalog';
import { StyleThumbnail } from 'reducers/detail/productDetail';

import css from 'styles/components/productdetail/swatchPicker.scss';

function convertThumbnail(src: string) {
  return src.replace('t-THUMBNAIL', 'p-MOBILETHUMB');
}

function onImageLoadError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAB+ElEQVR4AY3UJdSuVRAF4Od75zPcNeFScHe3iEvCrXd6pOBQ8IhTsEzE3d3194HDP+Fg99691ivH9jqzZ/YYk1jDAnInEjki9U83t0N968zahITlJwf50uA9nIXjj+VsnDbmdPXU/2lHcTZOwikvDl59epBYgYUnBvd8EVY+Co/YRHwUbv8q5DODh7FgOxKHfBXO+zXkW+FZjOA+5gjEU8wU3gqPLob8IlyKQzcnzcmDOQveCFf8GPLd8LhCEu1ReDc88HPINwc3w4Gc2Yggd+cMhXfCpY3snfCUHng7PPDb+tp1CntxBlJl4nQVSpFd8sP6gac7kkd/WZ+7Fh5lCjitOGRlxHVMkqiDVxTZQ38+d/0U8u0KJxnaXqizSXcjjOFtZqXHZV+H/CvUwfXwMpNkhAD/R5REF87d74V8v26m8Dzj/yQa9xp1wi60cMJVb4ULSp8nod9bZ0tsToMucw/22VFh/vBf2ezFrrKnSH4uTVQYTReVza7ORlB2SmXSE+HN8PBvHUkylLCS6OusHADHF4fEKR+HO1vZvzG4EW5ldgtTjNvT0t10UQ5odmreHHMWEn5rLv4irH0ZrrCJaN5sRq+u8TusPjMoFzt0X87ckzO71nF6/9/sdDhn4ZDWNVoLwpqBxDJ+34rcfBMa25ysrrGA5TH5B65w8sQkEYt/AAAAAElFTkSuQmCC';
}

const makeSlider = (thumbnails: StyleThumbnail[], thumbnailButtons: ReactNode) => {
  const classes = {
    itemsViewport: css.sliderItemsViewport,
    prevButton: css.sliderButtons,
    nextButton: css.sliderButtons
  };
  return (
    <MelodyCarousel
      buttonsOutsideItemsViewport={true}
      classes={classes}
      ItemsWrappingElement="ul"
      reconfigure={true}
      reconfigureNonce={thumbnails}
      showDots={false}
    >
      {thumbnailButtons}
    </MelodyCarousel>
  );
};

interface Props {
  onStyleChange: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  productStyles: Record<string, ProductStyle>;
  selectedStyleId: string;
  thumbnails: StyleThumbnail[];
}

const SwatchPicker = ({
  onStyleChange,
  productStyles,
  thumbnails,
  selectedStyleId
}: Props) => {
  const { testId } = useMartyContext();

  if (thumbnails && thumbnails.length > 1) {
    const thumbnailButtons = thumbnails.map(thumbnail => {
      const { styleId, src } = thumbnail;
      const btnClasses = cn(css.thumbWrap, { [css.selectedSwatch]: selectedStyleId === styleId });
      const { color, productUrl } = productStyles[styleId];
      const placeholder = <div className={css.swatchThumbnailPlaceholder} />;
      const imgProps = {
        'onError': onImageLoadError,
        'src': convertThumbnail(src),
        'alt': color,
        'data-track-action': 'Product-Page',
        'data-track-label': 'PrImage',
        'data-track-value': 'Swatch',
        'className': cn(css.swatchThumbnail, { [css.selectedSwatch]: selectedStyleId === styleId })
      };
      return (
        <li className={css.buttonWrapper} key={styleId}>
          <a
            href={productUrl}
            className={btnClasses}
            onClick={onStyleChange}
            data-style-id={styleId}
            data-test-id={testId(`swatch-${styleId}`)}
            aria-current={selectedStyleId === styleId}
            aria-label={`Toggle product color ${color}`}
          >
            <ImageLazyLoader imgProps={imgProps} placeholder={placeholder} />
          </a>
        </li>
      );
    });

    return (
      <div className={css.swatchPicker} data-test-id={testId('swatchPicker')}>
        {makeSlider(thumbnails, thumbnailButtons)}
      </div>
    );
  } else {
    return (
      <div className={css.emptySwatchPicker} />
    );
  }
};

export default SwatchPicker;
