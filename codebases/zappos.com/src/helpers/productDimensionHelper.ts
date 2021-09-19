import { MapSomeDimensionIdTo, SizingDimension } from 'types/cloudCatalog';

export const DIMENSION_TYPE_SHORT = 'SHORT';
export const DIMENSION_TYPE_MEDIUM = 'MEDIUM';
export const DIMENSION_TYPE_LONG = 'LONG';

export const buildDimensionValueLengthTypes = (dimensions: SizingDimension[]) => {
  const dimensionValueLengthTypes: MapSomeDimensionIdTo<string> = { };
  // for every dimension check and see what the longest value is so the UI can better hint at how to lay out the values
  dimensions.forEach(({ id, units }) => {
    let longestValueType = DIMENSION_TYPE_SHORT;
    if (units.length) {
      const longestValue = units[0].values?.reduce((a, b) => (a.value.length > b.value.length ? a : b), { value: '' }).value.length;
      // 12 characters for "long", 6 characters for "medium"
      if (longestValue && longestValue > 12) {
        longestValueType = DIMENSION_TYPE_LONG;
      } else if (longestValue && longestValue > 6) {
        longestValueType = DIMENSION_TYPE_MEDIUM;
      } // else SHORT
    }

    dimensionValueLengthTypes[`d${id}`] = longestValueType;
  });
  return dimensionValueLengthTypes;
};
