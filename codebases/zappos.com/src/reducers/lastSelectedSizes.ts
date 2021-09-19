import { SET_LAST_SELECTED_SIZE } from 'constants/reduxActions';
import { AppAction } from 'types/app';
import { MapSomeDimensionIdTo } from 'types/cloudCatalog';

export const getLastSelectedSize = (lastSelectedSizeObject: LastSelectedSizeState = {}, gender: string, dimensionId: string) => {
  const lastSizesByGender = lastSelectedSizeObject[gender];
  if (lastSizesByGender && lastSizesByGender[dimensionId]) {
    return lastSizesByGender[dimensionId];
  } else {
    return undefined;
  }
};

interface ApproximateSize {
  id: string | undefined;
  overlap: number | undefined;
}

export const getApproximateSize = (sizeIds: string[] | undefined, lastSelectedSize: SelectedSize | undefined, hypercubeSizingData: Partial<Record<string, {
  min: number;
  max: number;
}>>) => {
  if (!lastSelectedSize || !sizeIds || !hypercubeSizingData) {
    return undefined;
  }
  if (sizeIds.find(sizeId => sizeId === lastSelectedSize.sizeId)) {
    return lastSelectedSize.sizeId; // exact match exists
  } else {
    const approximateSize = sizeIds.map(sizeId => {
      // calculate all the overlaps
      const sizeRange = hypercubeSizingData[sizeId];
      const overlap = sizeRange && Math.min(sizeRange.max, lastSelectedSize.max) - Math.max(sizeRange.min, lastSelectedSize.min);
      return { id: sizeId, overlap };
    }).reduce((largest, current: ApproximateSize) => {
      // find the non-zero max
      if (current.overlap && current.overlap > 0 && current.overlap > (largest.overlap as number)) {
        return current;
      } else {
        return largest;
      }
    }, { id : undefined, overlap : -Infinity } as ApproximateSize);

    return approximateSize?.id;
  }
};

interface SelectedSize {
  sizeId: string;
  min: number;
  max: number;
}

interface LastSelectedSizeState {
  [key: string]: MapSomeDimensionIdTo<SelectedSize>;
}

const reducer = (state: Readonly<LastSelectedSizeState> = {}, action: AppAction): LastSelectedSizeState => {
  switch (action.type) {
    case SET_LAST_SELECTED_SIZE:
      return {
        ...state,
        [action.gender] : {
          ...state[action.gender],
          [action.dimensionId] : {
            sizeId : action.sizeId,
            min : action.min,
            max : action.max
          }
        }
      };
    default:
      return state;
  }
};

export default reducer;
