import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { ProductImage, ProductStyle } from 'types/cloudCatalog';

import css from 'styles/components/productdetail/swankyswatch/SwankyStyleSwatch.scss';

interface Props {
  isSelected: boolean;
  isUnavailable: boolean;
  onColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  productType: string;
  style: ProductStyle;
}

export default function SwankyStyleSwatch({ isUnavailable, onColorChange, productType, isSelected, style }: Props) {
  const {
    color: colorName,
    images = [],
    styleId
  } = style;
  const { testId } = useMartyContext();
  const styleSwatchImageId = chooseStyleSwatchImageId(images, productType);
  const imageUrl = styleSwatchImageId ? `https://m.media-amazon.com/images/I/${styleSwatchImageId}.AC_SS144.jpg` : undefined;
  return (
    <>
      <input
        type="radio"
        name="colorSelect"
        className={cn('screenReadersOnly', css.input)}
        onChange={onColorChange}
        data-color-name={colorName}
        data-style-id={styleId}
        id={styleId}
      />
      <label
        htmlFor={styleId}
        className={cn(css.button, { [css.unavailable]: isUnavailable, [css.selected]: isSelected })}
        data-test-id={testId(`styleSwatch-${styleId}`)}
      >
        <span className="screenReadersOnly">{colorName}</span>
        <img
          src={imageUrl}
          alt=""
          aria-hidden
          className={css.image}
        />
      </label>
    </>
  );
}

function chooseStyleSwatchImageId(images: ProductImage[], productType: string) {
  // use the "left side" angle for shoes
  if (productType && productType.toLowerCase() === 'shoes') {
    const leftImageInfo = images.find(imageInfo => imageInfo.type === 'LEFT');
    if (leftImageInfo) {
      return leftImageInfo.imageId;
    }
  }
  return images[0]?.imageId;
}
