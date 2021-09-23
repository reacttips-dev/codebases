import { createContext, useContext } from 'react';
import { STATUS } from 'screens/EpisodeScreen/components/CuePoints/constants';
import {
  NewCuePoint,
  SavedCuePoint,
  SavedCuePoints,
  ValidationError,
} from 'screens/EpisodeScreen/components/CuePoints/types';

type SAIModalProviderValue = {
  setCuePointErrors: (errors: ValidationError[] | undefined) => void;
};

export const SAIModalContext = createContext<SAIModalProviderValue>({
  setCuePointErrors: errors => null,
});

export const useSAIModalContext = () => useContext(SAIModalContext);

type SAIWaveformProviderValue = {
  onTimestampInputChange: (time: number) => void;
  onTableRowClick: (cuePoint: SavedCuePoint) => void;
};

export const SAIWaveformContext = createContext<SAIWaveformProviderValue>({
  onTimestampInputChange: time => null,
  onTableRowClick: cuePoint => null,
});

export const useSAIWaveformContext = () => useContext(SAIWaveformContext);

type AdInsertionProviderValue = {
  setCuePointCount: (count: number) => void;
  setHasInvalidCuePointError: (hasError: boolean) => void;
  cuePointsState: {
    newCuePoint: NewCuePoint;
    status: STATUS;
    errors?: ValidationError[];
    savedCuePoints?: SavedCuePoints;
  };
  updateNewCuePoint: (updatedCuePoint: NewCuePoint) => void;
  addCuePoint: () => void;
  removeCuePoint: (cuePoint: SavedCuePoint) => void;
  editCuePoint: (
    newCuePoint: SavedCuePoint,
    originalCuePoint: SavedCuePoint
  ) => void;
  clearErrors: (error?: ValidationError) => void;
};

export const AdInsertionContext = createContext<AdInsertionProviderValue>({
  setCuePointCount: count => null,
  setHasInvalidCuePointError: hasError => null,
  cuePointsState: {
    newCuePoint: {
      startTime: null,
      startTimeString: null,
      adCount: 0,
      placementType: null,
    },
    status: STATUS.IDLE,
    errors: undefined,
    savedCuePoints: undefined,
  },
  updateNewCuePoint: updatedCuePoint => null,
  addCuePoint: () => null,
  removeCuePoint: cuePoint => null,
  editCuePoint: (newCuePoint, originalCuePoint) => null,
  clearErrors: () => null,
});

export const useAdInsertionContext = () => useContext(AdInsertionContext);
