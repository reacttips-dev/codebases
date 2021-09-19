/* ESLint errors suppressed for #4183 */
/* eslint-disable css-modules/no-undef-class, css-modules/no-unused-class */
import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { ProductStyle } from 'types/cloudCatalog';

import styles from 'styles/components/productdetail/stylePickerDropdown.scss';

interface Props {
  id?: string;
  isAssignedAirplaneSeatSizing: boolean;
  isGiftCard: boolean | '' | undefined;
  onColorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedStyle: ProductStyle;
  showColorLabel?: boolean;
  showStyleChooserPrefix: boolean;
  styleList: ProductStyle[];
}

const ColorChooser = ({
  selectedStyle,
  styleList,
  onColorChange,
  showStyleChooserPrefix,
  showColorLabel = true,
  isGiftCard,
  id,
  isAssignedAirplaneSeatSizing
}: Props) => {
  const colorName = (selectedStyle || {}).color;
  const colorLabel = isGiftCard ? 'Gift Amount' : 'Color';
  const selectId = `${id || 'pdp'}-color-select`;
  const { testId } = useMartyContext();

  const makeOptionList = () => ((isAssignedAirplaneSeatSizing) ? styleList.filter(sl => sl.stocks.some(st => st.onHand !== '0')) : styleList);

  return (
    <div className={styles.styleChooserSection}>
      {showColorLabel && <label htmlFor={selectId} className={cn({ [styles.singleVal]: styleList.length <= 1 })} data-test-id={testId('color-dropdown-label')}>{colorLabel}:</label>}
      {styleList.length > 1 ? (
        <div className={styles.styleChooserControlWrapper}>
          <select
            id={selectId}
            name="styleId"
            className={cn(styles.styleChooserControl, { [styles.giftCard]: isGiftCard })}
            value={selectedStyle && selectedStyle.styleId}
            onChange={onColorChange}
            data-test-id={testId('pdp-color')}>
            {makeOptionList().map(({ styleId, color }) => <option key={styleId} value={styleId}>{color}</option>)}
          </select>
        </div>
      ) : (
        <div className={styles.styleChooserText} data-test-id={testId('pdp-color')}>
          <input type="hidden" name="styleId" value={styleList[0]?.styleId} />
          {showStyleChooserPrefix && <span className={styles.dimensionLabel}>Color: </span>}
          {colorName}
        </div>
      )
      }
      <meta itemProp="color" content={colorName} />
    </div>
  );
};

export default ColorChooser;
/* eslint-enable */
