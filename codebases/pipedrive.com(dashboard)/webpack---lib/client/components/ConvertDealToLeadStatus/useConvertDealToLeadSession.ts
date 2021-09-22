import { getPrefixedKey, useLocalStorage } from 'Hooks/useLocalStorage';
import { Dispatch, SetStateAction } from 'react';

import { ConvertSessionResponse } from './types';

export const STORAGE_KEY = 'convertSession';

type StoredValue = ConvertSessionResponse | null;

export const useConvertDealToLeadSession = (): [StoredValue, Dispatch<SetStateAction<StoredValue>>, () => void] => {
	return useLocalStorage<StoredValue>(getPrefixedKey(STORAGE_KEY), null);
};
