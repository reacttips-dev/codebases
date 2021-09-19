import { devLogger } from 'middleware/logger';
import {
  AirplaneSizingOption,
  ProductBundle,
  ProductStockData
} from 'types/cloudCatalog';
import { SelectedSizing } from 'types/product';

type MinimumProductBundle = Pick<ProductBundle, 'sizing' | 'styles'>;

export const WOMENS_GENDER_RANK = 31000;
export const MENS_GENDER_RANK = 31100;
export const UNKNOWN_GENDER_RANK = 32000;
export const UNKNOWN_SIZE_RANK = 1000000;
export const UNKNOWN_WIDTH_RANK = 1000001;

export interface AirplaneCacheDimensionOption {
  id: string;
  constraintValue: string;
  label: string;
  rank: number;
}

export interface AirplaneCacheAgeGroup extends AirplaneCacheDimensionOption {
  id: AirplaneSizingOption['ageGroup'];
}

export interface AirplaneCacheGenderOption extends AirplaneCacheDimensionOption {
  id: AirplaneSizingOption['gender'];
}

export interface AirplaneCacheUnitOption extends AirplaneCacheDimensionOption {
  id: AirplaneSizingOption['sizeType'];
}

export interface AirplaneCacheSizeOption extends AirplaneCacheDimensionOption {
  ageGroup: AirplaneSizingOption['ageGroup'];
  countryOrUnit: AirplaneSizingOption['sizeType'];
  d3: string;
}

export interface AirplaneCacheWidthOption extends AirplaneCacheDimensionOption {
  countryOrUnit: AirplaneSizingOption['sizeType'];
  d4: string;
}

type Gendered<T> = { mens: T; womens: T };

export interface AirplaneCacheStock extends Omit<AirplaneSizingOption, 'sizeType'> {
  colorId: string;
  countryOrUnit: AirplaneSizingOption['sizeType'];
  d3?: string;
  d4?: string;
  onHand: number;
}

/**
 * This object consolidates various sizing data from cloudcatalog to make
 * several operations fast and straightforward:
 * - Determine what choices to display in the grid layout dimension pickers
 * - Determine what choices are unavailable given a partial dimension selection
 * - Find data needed to add to cart
 */
export interface AirplaneCache {
  /** Every stock in the catalog for this product. */
  all: {
    ageGroups: AirplaneCacheAgeGroup[];
    colorOptions: AirplaneCacheDimensionOption[];
    countryOrUnitOptions: AirplaneCacheUnitOption[];
    genderOptions: AirplaneCacheGenderOption[];
    sizeOptions: Gendered<AirplaneCacheSizeOption[]>;
    sizeOptionsByAgeGroup: Partial<Record<AirplaneSizingOption['ageGroup'], AirplaneCacheSizeOption[]>>;
    widthOptions: Gendered<AirplaneCacheWidthOption[]>;
    stocks: AirplaneCacheStock[];
  };

  /** Every stock remaining after a partial color and/or size selection. */
  available: {
    colorOptions: string[];
    countryOrUnitOptions: string[];
    genderOptions: string[];
    sizeOptions: string[];
    widthOptions: string[];
  };

  /** The partial color and/or size selection used to filter `all` into `available`. */
  constraints: {
    colorId?: string;
    countryOrUnit?: AirplaneSizingOption['sizeType'];
    d3?: string;
    d4?: string;
    gender: AirplaneSizingOption['gender'];
  };
}

function makeValidConstraints(all: AirplaneCache['all'], givenConstraints: Partial<AirplaneCache['constraints']>): AirplaneCache['constraints'] {
  const ret = { ...givenConstraints };
  if (!givenConstraints.gender) {
    if (all.genderOptions.length === 0 || all.genderOptions.some(option => option.id === 'womens')) {
      ret.gender = 'womens';
    } else {
      ret.gender = all.genderOptions[0].id;
    }
  }
  if (!givenConstraints.countryOrUnit && all.countryOrUnitOptions.length > 0) {
    ret.countryOrUnit = all.countryOrUnitOptions[0].id;
  }
  return ret as AirplaneCache['constraints'];
}

type ConstraintKey = keyof AirplaneCache['constraints'];

/**
 * Basically orders gender buttons as "Women" and then "Men". Using a rank for
 * this matches how we do it for sizing and leaves room in case we use this
 * field for "unisex", non-binary genders, or just non-gender data in general.
 */
export function getGenderRank(gender: string): number {
  if (gender === 'womens') {
    return WOMENS_GENDER_RANK;
  }
  if (gender === 'mens') {
    return MENS_GENDER_RANK;
  }
  return UNKNOWN_GENDER_RANK;
}

const AGE_GROUP_LABELS: Record<AirplaneSizingOption['ageGroup'], string> = {
  'adult': 'Adult',
  'big-kids': 'Big Kid',
  'infant': 'Infant',
  'kids': 'Kids',
  'little-kids': 'Little Kid',
  'toddler': 'Toddler'
};

const AGE_GROUP_RANKS: Record<AirplaneSizingOption['ageGroup'], number> = {
  'adult': 16000,
  'big-kids': 15000,
  'infant': 11000,
  'kids': 13000,
  'little-kids': 14000,
  'toddler': 12000
};

function makeAirplaneCacheAgeGroup(
  airplaneSizingOption: AirplaneSizingOption
): AirplaneCacheAgeGroup {
  const id = airplaneSizingOption.ageGroup;
  const constraintValue = id;
  const label = AGE_GROUP_LABELS[airplaneSizingOption.ageGroup];
  const rank = AGE_GROUP_RANKS[airplaneSizingOption.ageGroup];
  return { constraintValue, id, label, rank };
}

function makeColorAirplaneCacheDimensionOption(
  detail: MinimumProductBundle,
  legacyStockObject: ProductStockData
): AirplaneCacheDimensionOption {
  const { styles } = detail;
  const colorId = legacyStockObject.color;

  const index = styles.findIndex(style => style.colorId === colorId);
  const style = styles[index];
  const label = style?.color || '';

  return {
    id: colorId,
    constraintValue: colorId,
    label,
    rank: index
  };
}

function getSizeTypeRank(sizeType: AirplaneSizingOption['sizeType']): number {
  switch (sizeType) {
    case 'US':
      return 11000;
    case 'AT':
    case 'AU':
    case 'BR':
    case 'EU':
    case 'UK':
      return 12000;
    case 'standard':
      return 13000;
    case 'centimeter':
    case 'inch':
      return 14000;
  }
  devLogger(`WARNING: unrecognized sizeType in airplaneSizingByStockId: "${sizeType}"`);
  return 15000;
}

const AIRPLANE_CACHE_SIZE_UNIT_LABEL: Record<AirplaneSizingOption['sizeType'], string> = {
  'AT': 'AT Sizing',
  'AU': 'AU Sizing',
  'BR': 'BR Sizing',
  'centimeter': 'Centimeters',
  'EU': 'EU Sizing',
  'inch': 'Inches',
  'standard': 'Standard',
  'UK': 'UK Sizing',
  'US': 'US Sizing'
};

function makeAirplaneCacheUnitOption(airplaneSizingOption: AirplaneSizingOption): AirplaneCacheUnitOption {
  const { sizeType } = airplaneSizingOption;
  const id = sizeType;
  const constraintValue = id;
  const label = AIRPLANE_CACHE_SIZE_UNIT_LABEL[sizeType];
  const rank = getSizeTypeRank(sizeType);
  return { constraintValue, id, label, rank };
}

function isKidsAgeGroup(ageGroup: AirplaneSizingOption['ageGroup']): boolean {
  return ageGroup !== 'adult';
}

const ADULT_GENDER_LABELS = {
  mens: 'Men',
  womens: 'Women'
};

const KIDS_GENDER_LABELS = {
  mens: 'Boys',
  womens: 'Girls'
};

function makeGenderAirplaneCacheDimensionOption(
  airplaneSizingOption: AirplaneSizingOption
): AirplaneCacheDimensionOption {
  const { ageGroup, gender: id } = airplaneSizingOption;
  const constraintValue = id;
  const label = isKidsAgeGroup(ageGroup) ? KIDS_GENDER_LABELS[id] : ADULT_GENDER_LABELS[id];
  const rank = getGenderRank(id);
  return { constraintValue, id, label, rank };
}

function getRankAndDimensionValue(
  detail: MinimumProductBundle,
  legacyStockObject: ProductStockData,
  dimensionKey: 'd3' | 'd4'
): { rank: number; value: string } {
  const value = legacyStockObject[dimensionKey]!;
  const legacyDimensionOption = detail.sizing.allValues.find(option => option.id === value);
  const defaultRank = dimensionKey === 'd3' ? UNKNOWN_SIZE_RANK : UNKNOWN_WIDTH_RANK;
  const rank = legacyDimensionOption ? +legacyDimensionOption.rank : defaultRank;
  return { rank, value };
}

function makeIdForAirplaneCacheSizeOrWidthOption(option: AirplaneSizingOption, type: 'size' | 'width'): string {
  const label = type === 'size' ? option.sizeLabel : option.widthLabel;
  return `${option.sizeType}-${label}`;
}

function makeSizeAirplaneCacheDimensionOption(
  detail: MinimumProductBundle,
  legacyStockObject: ProductStockData,
  airplaneSizingOption: AirplaneSizingOption
): AirplaneCacheSizeOption {
  const label = airplaneSizingOption.sizeLabel;
  const id = makeIdForAirplaneCacheSizeOrWidthOption(airplaneSizingOption, 'size');
  const { ageGroup } = airplaneSizingOption;
  const countryOrUnit = airplaneSizingOption.sizeType;
  const { rank, value: d3 } = getRankAndDimensionValue(detail, legacyStockObject, 'd3');
  const constraintValue = d3;
  return { constraintValue, id, label, rank, ageGroup, countryOrUnit, d3 };
}

function makeWidthAirplaneCacheDimensionOption(
  detail: MinimumProductBundle,
  legacyStockObject: ProductStockData,
  airplaneSizingOption: AirplaneSizingOption
): AirplaneCacheWidthOption {
  const label = airplaneSizingOption.widthLabel;
  const id = makeIdForAirplaneCacheSizeOrWidthOption(airplaneSizingOption, 'width');
  const countryOrUnit = airplaneSizingOption.sizeType;
  const { rank, value: d4 } = getRankAndDimensionValue(detail, legacyStockObject, 'd4');
  const constraintValue = d4;
  return { constraintValue, id, label, rank, countryOrUnit, d4 };
}

/**
 * Can be used to sort an array of objects with a `rank` field in ascending
 * order.
 *
 * @example
 * const sclRankings = [{ name: 'Zain', rank: 2 }, { name: 'Mango', rank: 1 }];
 * sclRankings.sort(rankComparator);
 * // sclRankings is now [{ name: 'Mango', rank: 1 }, { name: 'Zain', rank: 2 }]
 */
export function rankComparator(a: {rank: number}, b: {rank: number}) {
  return a.rank - b.rank;
}

/**
 * This function helps with the following:
 *
 * - Ensures that we only add one of each dimension option into their
 *   respective arrays
 * - Ensures that we only do the work to construct the dimension option info
 *   once per option
 */
function recordAirplaneCacheDimensionOption<T extends { id: string }>(
  array: T[],
  id: string,
  makeDimensionOption: () => T
): T | undefined {
  if (!array.some(option => option.id === id)) {
    const newOption = makeDimensionOption();
    if (newOption.id !== id) {
      devLogger(`WARNING: mismatch between given ID and produced ID for airplane cache dimension option (${JSON.stringify({ given: id, produced: newOption.id })})`);
    }
    array.push(newOption);
    return newOption;
  }
}

export function getSingleOptionDimensionValues(
  airplaneCache: Pick<AirplaneCache, 'all' | 'constraints'>
): SelectedSizing {
  const {
    constraints: { gender }
  } = airplaneCache;
  const sizeOptionsForGender = airplaneCache.all.sizeOptions[gender];
  const widthOptionsForGender = airplaneCache.all.widthOptions[gender];
  const d3 = sizeOptionsForGender.length === 1 ? sizeOptionsForGender[0].d3 : undefined;
  const d4 = widthOptionsForGender.length === 1 ? widthOptionsForGender[0].d4 : undefined;
  return { d3, d4 };
}

function getEffectiveConstraints(airplaneCache: Omit<AirplaneCache, 'available'>) {
  const { gender } = airplaneCache.constraints;
  const effectiveConstraints: Partial<AirplaneCache['constraints']> = {
    ...airplaneCache.constraints
  };

  function removeConstraintIfNotAChoice(options: ({ constraintValue: string })[], key: ConstraintKey) {
    const value = effectiveConstraints[key];
    if (value === undefined) {
      // no constraint is set for `key`
      return;
    }
    if (options.length > 1 && options.some(option => option.constraintValue === value)) {
      // this is a valid constraint
      return;
    }
    // this is an invalid constraint
    delete effectiveConstraints[key];
  }

  removeConstraintIfNotAChoice(airplaneCache.all.colorOptions, 'colorId');
  removeConstraintIfNotAChoice(airplaneCache.all.countryOrUnitOptions, 'countryOrUnit');
  removeConstraintIfNotAChoice(airplaneCache.all.genderOptions, 'gender');
  removeConstraintIfNotAChoice(airplaneCache.all.sizeOptions[gender], 'd3');
  removeConstraintIfNotAChoice(airplaneCache.all.widthOptions[gender], 'd4');

  return effectiveConstraints;
}

/**
 * WARNING: The airplane cache object is updated in-place. It is returned from
 * this function for typechecking convenience.
 */
function refreshAirplaneCacheAvailableObject(
  airplaneCache: Omit<AirplaneCache, 'available'>
): AirplaneCache {
  const effectiveConstraints = getEffectiveConstraints(airplaneCache);

  const available: AirplaneCache['available'] = {
    colorOptions: [],
    countryOrUnitOptions: [],
    genderOptions: [],
    sizeOptions: [],
    widthOptions: []
  };

  function deleteAllButOneKey(stock: Partial<AirplaneCacheStock>, omittedKey: keyof AirplaneCacheStock) {
    const keys: (keyof AirplaneCacheStock)[] = ['colorId', 'countryOrUnit', 'd3', 'd4', 'gender'];
    keys.splice(keys.indexOf(omittedKey), 1);
    for (const key of keys) {
      delete stock[key];
    }
  }

  function markIfAvailable<T>(array: T[], id: T | undefined) {
    if (!id) {
      return;
    }
    if (array.includes(id)) {
      return;
    }
    array.push(id);
  }

  airplaneCache.all.stocks.forEach(stock => {
    if (!(stock.onHand > 0)) {
      // skip this stock if it's unavailable
      return;
    }
    const stockCopy: Partial<AirplaneCacheStock> = { ...stock };
    if (effectiveConstraints.colorId && stock.colorId !== effectiveConstraints.colorId) {
      deleteAllButOneKey(stockCopy, 'colorId');
    }
    if (effectiveConstraints.countryOrUnit && stock.countryOrUnit !== effectiveConstraints.countryOrUnit) {
      deleteAllButOneKey(stockCopy, 'countryOrUnit');
    }
    if (effectiveConstraints.gender && stock.gender !== effectiveConstraints.gender) {
      deleteAllButOneKey(stockCopy, 'gender');
    }
    if (effectiveConstraints.d3 && stock.d3 !== effectiveConstraints.d3) {
      deleteAllButOneKey(stockCopy, 'd3');
    }
    if (effectiveConstraints.d4 && stock.d4 !== effectiveConstraints.d4) {
      deleteAllButOneKey(stockCopy, 'd4');
    }
    markIfAvailable(available.colorOptions, stockCopy.colorId);
    markIfAvailable(available.countryOrUnitOptions, stockCopy.countryOrUnit);
    markIfAvailable(available.genderOptions, stockCopy.gender);
    markIfAvailable(available.sizeOptions, stockCopy.d3);
    markIfAvailable(available.widthOptions, stockCopy.d4);
  });

  const ret = airplaneCache as AirplaneCache;
  ret.available = available;
  return ret;
}

/**
 * Find which stocks are available for a new set of airplane cache constraints.
 *
 * WARNING: The airplane cache object is updated in-place. It is returned from
 * this function for typechecking convenience.
 *
 * Old constraints are passed in as part of the given airplaneCache (a field in
 * the first argument: airplaneCache.constraints). New constraints are passed
 * in as the second argument. The old constraints are used as the base for the
 * new ones. See the example below for more clarity.
 *
 * @return The airplaneCache given in the first argument.
 * @example
 *   oldConstraints = { color: 'blue', size: 7 };
 *   newConstraints = { color: 'green', width: 'wide' };
 *   resultingConstraints = { color: 'green', size: 7, width: 'wide' };
 */
export function addAndUpdateAirplaneCacheConstraints(airplaneCache: Omit<AirplaneCache, 'available'>, newConstraints: Partial<AirplaneCache['constraints']>): AirplaneCache {
  airplaneCache.constraints = { ...airplaneCache.constraints, ...newConstraints };
  return refreshAirplaneCacheAvailableObject(airplaneCache);
}

/**
 * Find which stocks are available for a new set of airplane cache constraints.
 *
 * WARNING: The airplane cache object is updated in-place. It is returned from
 * this function for typechecking convenience.
 *
 * The old constraints are discarded completely.
 *
 * @return The airplaneCache given in the first argument.
 */
export function wipeAndReplaceAirplaneCacheConstraints(airplaneCache: Omit<AirplaneCache, 'available'>, newConstraints: AirplaneCache['constraints']): AirplaneCache {
  airplaneCache.constraints = newConstraints;
  return refreshAirplaneCacheAvailableObject(airplaneCache);
}

/**
 * Creates the initial airplane cache for the redux store.
 *
 * @param detail      The product bundle from cloud catalog.
 * @param constraints The constraints (partial color and sizing selection) to put on the `available` entry in the cache. (The product's default color and the customer's sizing prediction may be set as initial constraints.)
 * @returns           An airplane cache object. At the time of writing, this gets assigned to `state.product.detail.sizing.airplaneCache`
 */
export function makeAirplaneCache(detail: MinimumProductBundle, givenConstraints: Partial<AirplaneCache['constraints']>): AirplaneCache | undefined {
  const {
    sizing: {
      airplaneSizingByStockId,
      stockData: legacyStockList
    }
  } = detail;

  if (!airplaneSizingByStockId || Object.keys(airplaneSizingByStockId).length === 0) {
    return;
  }

  // the "all" field in the airplane seat sizing cache
  const all: AirplaneCache['all'] = {
    ageGroups: [],
    colorOptions: [],
    countryOrUnitOptions: [],
    genderOptions: [],
    sizeOptions: { mens: [], womens: [] },
    sizeOptionsByAgeGroup: {},
    widthOptions: { mens: [], womens: [] },
    stocks: []
  };

  for (let i = 0; i < legacyStockList.length; ++i) {
    const legacyStockObject = legacyStockList[i];
    const airplaneSizingOptions = airplaneSizingByStockId[legacyStockObject.id];
    if (!airplaneSizingOptions) {
      // skip if there's no airplane sizing data for the stock ID (just in
      // case. this should be an invalid state)
      continue;
    }

    for (let j = 0; j < airplaneSizingOptions.length; ++j) {
      const airplaneSizingOption = airplaneSizingOptions[j];

      const { ageGroup } = airplaneSizingOption;
      if (ageGroup && ageGroup !== 'adult') {
        // we are temporarily suppressing the grid layout for buy box on kids
        // products because of some invalid data on SKU 7128115.
        //
        // the product bundle for SKU 7128115 is labelling both womens and big
        // kids sizes as big kids.
        return;
      }

      recordAirplaneCacheDimensionOption(
        all.ageGroups,
        ageGroup,
        () => makeAirplaneCacheAgeGroup(airplaneSizingOption)
      );

      recordAirplaneCacheDimensionOption(
        all.colorOptions,
        legacyStockObject.color,
        () => makeColorAirplaneCacheDimensionOption(detail, legacyStockObject)
      );

      recordAirplaneCacheDimensionOption(
        all.countryOrUnitOptions,
        airplaneSizingOption.sizeType,
        () => makeAirplaneCacheUnitOption(airplaneSizingOption)
      );

      const { gender } = airplaneSizingOption;
      recordAirplaneCacheDimensionOption(
        all.genderOptions,
        airplaneSizingOption.gender,
        () => makeGenderAirplaneCacheDimensionOption(airplaneSizingOption)
      );

      const sizeOptionId = makeIdForAirplaneCacheSizeOrWidthOption(airplaneSizingOption, 'size');
      if (legacyStockObject.d3) {
        let newSizeOption = recordAirplaneCacheDimensionOption(
          all.sizeOptions[gender],
          sizeOptionId,
          () => makeSizeAirplaneCacheDimensionOption(
            detail,
            legacyStockObject,
            airplaneSizingOption
          )
        );

        if (!newSizeOption) {
          newSizeOption = makeSizeAirplaneCacheDimensionOption(
            detail,
            legacyStockObject,
            airplaneSizingOption
          );
        }
        const options = all.sizeOptionsByAgeGroup[ageGroup];
        if (!options) {
          all.sizeOptionsByAgeGroup[ageGroup] = [newSizeOption];
        } else if (!options.some(option => option.id === newSizeOption!.id)) {
          options!.push(newSizeOption);
        }
      }

      const widthOptionId = makeIdForAirplaneCacheSizeOrWidthOption(airplaneSizingOption, 'width');
      if (legacyStockObject.d4) {
        recordAirplaneCacheDimensionOption(
          all.widthOptions[gender],
          widthOptionId,
          () => makeWidthAirplaneCacheDimensionOption(
            detail,
            legacyStockObject,
            airplaneSizingOption
          )
        );
      }

      const stock: AirplaneCacheStock = {
        ...airplaneSizingOption,
        colorId: legacyStockObject.color,
        countryOrUnit: airplaneSizingOption.sizeType,
        d3: legacyStockObject.d3,
        d4: legacyStockObject.d4,
        onHand: +(legacyStockObject.onHand || 0)
      };
      all.stocks.push(stock);
    }
  }

  all.ageGroups.sort(rankComparator);
  all.colorOptions.sort(rankComparator);
  all.countryOrUnitOptions.sort(rankComparator);
  all.genderOptions.sort(rankComparator);
  all.sizeOptions.mens.sort(rankComparator);
  all.sizeOptions.womens.sort(rankComparator);
  for (const key in all.sizeOptionsByAgeGroup) {
    const options = all.sizeOptionsByAgeGroup[key as AirplaneSizingOption['ageGroup']];
    options!.sort(rankComparator);
  }
  all.widthOptions.mens.sort(rankComparator);
  all.widthOptions.womens.sort(rankComparator);

  const constraints = makeValidConstraints(all, givenConstraints);

  return refreshAirplaneCacheAvailableObject({ all, constraints });
}
