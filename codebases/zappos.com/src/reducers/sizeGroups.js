import { RECEIVE_RELATED_PRODUCTS } from 'constants/reduxActions';
import { mapValues, pick } from 'helpers/lodashReplacement';
import { toUSD } from 'helpers/NumberFormats';

const priceKeys = ['basePrice', 'salePrice'];
const keysWeWant = [...priceKeys, 'imageId', 'seoUrl', 'sizeGroupName', 'styleId'];

const processSizeGroup = sizeGroup => {
  const filtered = pick(sizeGroup, keysWeWant);
  return mapValues(filtered, (value, key) => (priceKeys.includes(key) ? toUSD(value) : value));
};

const processColor = (colors, colorId) => colors[colorId].map(processSizeGroup);

const processColors = colors => {
  const colorIds = Object.keys(colors);
  const reduceFn = (ret, colorId) => {
    ret[colorId] = processColor(colors, colorId);
    return ret;
  };
  return colorIds.reduce(reduceFn, {});
};

const processDataWithSizeGroups = ({ productNameWithoutSizeGroup, sizeGroupStyleMap }) => ({
  hasSizeGroups: true,
  productNameWithoutSizeGroup,
  groupListsByColorId: processColors(sizeGroupStyleMap)
});

const processData = ({ sizeGroup }) => {
  if (sizeGroup) {
    return processDataWithSizeGroups(sizeGroup);
  }
  return { hasSizeGroups: false };
};

export default function sizeGroups(state = { hasSizeGroups: false }, { type, data }) {
  return type === RECEIVE_RELATED_PRODUCTS ? processData(data) : state;
}
