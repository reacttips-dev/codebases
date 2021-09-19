import { AirplaneCache } from 'reducers/detail/airplaneCache';
import { ProductStockData, ProductStyle, SizingValue } from 'types/cloudCatalog';
import { SelectedSizing } from 'types/product';

export const isGenderNeutralString = (str: string) => (str.indexOf('Men\'s ') > -1 || str.indexOf('Woman\'s ') > -1);

export function showAirplaneSizing(
  hydraBlueSkyPdp: boolean,
  productType: string,
  airplaneCache: AirplaneCache | undefined,
  isSingleShoe: boolean
): boolean {
  if (!hydraBlueSkyPdp) {
    return false;
  }
  if (productType !== 'Shoes') {
    return false;
  }
  if (isSingleShoe) {
    return false;
  }
  return !!airplaneCache;
}

export const returnColorIdOrDefaultStyleColor = (colorId: string | undefined, styleList: ProductStyle[]) => {
  if (!colorId && styleList[0]) {
    return styleList[0].colorId;
  }
  return colorId;
};

export const isOos = (option: SizingValue, colorId: string | undefined, dimensionsSet: string[], selectedSizing: SelectedSizing, stockData: ProductStockData[]): boolean => {
  for (const stock of stockData) {
    // is this a stock of the currently selected color
    const cond0 = stock.color === colorId;

    // does this stock's first dimension's value ("size" in the case of shoes)
    // match the `option` we want to know about
    const cond1 = stock[dimensionsSet[0]] === option.id;

    // does this stock's second dimension's value ("width" in the case of shoes)
    // match the "width" from the currently selected sizing
    const cond2 = stock[dimensionsSet[1]] === selectedSizing.d4;

    // is this stock (color and sizing combo) available?
    const cond3 = stock.onHand !== '0';

    if (cond0 && cond1 && cond2 && cond3) {
      return false;
    }
  }
  return true;
};

export const manageValueAndSubTitleStrings = (value: string) => {
  const matchValidNumber = /\d+([,.]\d+)?/g;
  let sizeValue = value.match(matchValidNumber)?.map(Number).join(',') as string;
  let subTitle = value.replace(matchValidNumber, '');
  let unisexSizing = false;

  // Account for Men's and Women's Sizing
  // Format:
  // MValue
  // WValue
  if ((isGenderNeutralString(subTitle)) && !subTitle.includes('(')) {
    if (subTitle.indexOf('Left') || subTitle.indexOf('Right')) {
      const tmpArray = subTitle.split(' ');
      subTitle = tmpArray[tmpArray.length - 1];
    } else {
      subTitle = '';
    }
    sizeValue = ''.concat('M', sizeValue).replace(',', ',W');
    unisexSizing = true;
  }

  return {
    sizeValue,
    subTitle,
    unisexSizing
  };
};

/*
 * sortAndGroupOptions()
 *
 * Cloud catalogue returns sizing values with strings in them. For airplane seat sizing
 * we need to parse the string to pull out the size and subTitle (sub string) for
 * display.
 *
 * Most of the time, these sizing groups are grouped in the response (little kid
 *  / big kid / toddler / etc). In the case of single shoe sizing, these sub strings
 * alternate.
 *
 * This method sorts the array and groups by the substring.
 * If gender neutral:
 * We split off of the spaces in the string knowing the last value
 * is the left or right foot option - which is the subString we're looking
 * for.
 * Else:
 * .value.split(regEx)[0] is the size.
 * .value.split(regEx)[1] is the substring.
 *
 * Because there is a chance there isn't white space in the string I'm using a regEx
 * which splits and captures in groups. We sort by the subString. If that subString
 * is undefined, we then sort by the size.
 *
 * The unit test represents the worst possible scenario I could think of in the value
 * response.
 *
 * See Unit Test: test/components/productdetail/stylepicker/AirplaneSeatSizing.js
 */
export const sortAndGroupOptions = (options: SizingValue[]) => {
  const regEx = /\s(.+)/;
  const sortedArray = options.sort((a, b) => {
    const isGenderNeutral = isGenderNeutralString(a.value);
    const splitValue = (isGenderNeutral) ? ' ' : regEx;
    const aValArr = a.value.split(splitValue);
    const bValArr = b.value.split(splitValue);
    let titleA, titleB;

    if (isGenderNeutral) {
      titleA = aValArr[aValArr.length - 1];
      titleB = bValArr[bValArr.length - 1];
    } else {
      titleA = aValArr[1] || aValArr[0];
      titleB = bValArr[1] || bValArr[0];
    }

    return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
  });

  return sortedArray;
};
