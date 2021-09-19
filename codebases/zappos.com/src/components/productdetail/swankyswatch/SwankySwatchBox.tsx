import React, { useState } from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import SwankyStyleSwatch from 'components/productdetail/swankyswatch/SwankyStyleSwatch';
import { isColorOosForSelectedSizing } from 'helpers/SwankySwatchUtils';
import { ProductDetailState } from 'reducers/detail/productDetail';
import { ProductStyle } from 'types/cloudCatalog';

import css from 'styles/components/productdetail/swankyswatch/SwankySwatchBox.scss';

const INITIAL_COLLAPSED_STYLES = 12;
interface Props {
  onColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  productState: ProductDetailState;
  productType: string;
  selectedStyle: ProductStyle;
  styleList: ProductStyle[];
  collapsable?: boolean;
}

export default function SwankySwatchBox(props: Props) {
  const {
    selectedStyle,
    styleList,
    collapsable = false
  } = props;
  const { testId } = useMartyContext();
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className={cn({ [css.isCollapsed]: collapsable && collapsed })}>
      <div className={css.colorText}>
        <span className={css.colorTextLabel}>Color:</span>
        <span className={css.colorTextValue} data-test-id={testId('selectedColor')}>{selectedStyle.color}</span>
      </div>
      <fieldset>
        <legend className="screenReadersOnly">Select A Color</legend>
        <div className={css.swatches} data-test-id={testId('styleSwatchContainer')}>
          {styleList.map(style => makeSwatch(props, style))}
        </div>
      </fieldset>
      {collapsable && styleList.length > INITIAL_COLLAPSED_STYLES && <button className={css.collapseLink} type="button" onClick={toggleCollapse}>See {collapsed ? 'more' : 'less'} colors</button>}
    </div>
  );
}

export function makeSwatch(props: Props, style: ProductStyle) {
  const {
    onColorChange,
    productState,
    productType,
    selectedStyle
  } = props;

  const { colorId, styleId } = style;

  const isOos = isColorOosForSelectedSizing(colorId, productState);
  return (
    <SwankyStyleSwatch
      key={styleId}
      isSelected={styleId === selectedStyle.styleId}
      isUnavailable={isOos}
      onColorChange={onColorChange}
      productType={productType}
      style={style} />
  );
}

