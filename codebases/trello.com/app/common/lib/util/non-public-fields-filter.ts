/* eslint-disable @trello/disallow-filenames */
type Maybe<T> = T | null;
type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
import type {
  MemberResponse,
  NonPublicFields,
} from 'app/gamma/src/types/responses';

type Fields = 'nonPublic' | NonPublicFields;

// this utility method is almost identical to the one used on server side (changes made for TS)
export const useNonPublicIfAvailable = (
  member: MakeMaybe<Pick<MemberResponse, Fields>, Fields>,
  attribute: NonPublicFields,
) => member.nonPublic?.[attribute] ?? member[attribute];
