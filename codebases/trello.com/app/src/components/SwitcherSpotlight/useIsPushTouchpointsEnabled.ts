import { useMemo } from 'react';
import {
  isPushTouchpointsEnrolled,
  useIsLocalStorageEnabled,
  ptStorageTestErrorHandler,
} from './targeting';
import { MemberModel } from 'app/gamma/src/types/models';
import { getCacheKey, getBlankCache } from './caching';

export const useIsPushTouchpointsEnabled = (member?: MemberModel): boolean => {
  const isEnrolled = isPushTouchpointsEnrolled(member);
  const blankCache = useMemo(() => getBlankCache(), []);
  const isLocalStorageEnabled = useIsLocalStorageEnabled({
    testKey: getCacheKey(member?.id ?? ''),
    testValue: blankCache,
    skip: !isEnrolled,
    onStorageTestError: ptStorageTestErrorHandler,
  });

  return isEnrolled && isLocalStorageEnabled;
};
