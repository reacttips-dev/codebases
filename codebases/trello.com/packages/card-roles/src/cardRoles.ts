/* eslint-disable @typescript-eslint/no-use-before-define */
import Url from 'url-parse';
import { featureFlagClient } from '@trello/feature-flag-client';

export type CardRole = 'board' | 'separator' | 'link' | 'mirror' | null;

export const determinePossibleCardRole = (
  card: Card,
  urlOrigin = window.location.origin,
): CardRole => {
  if (canBeSeparatorCard(card)) {
    return 'separator';
  } else if (canBeBoardCard(card, urlOrigin)) {
    return 'board';
  } else if (canBeMirrorCard(card, urlOrigin)) {
    return 'mirror';
  } else if (canBeLinkCard(card, urlOrigin)) {
    return 'link';
  } else {
    return null;
  }
};

interface Card {
  name: string;
  description: string | null | undefined;
  numAttachments: number;
  numLabels: number;
  numMembers: number;
  numChecklistItems: number;
  numCustomFieldItems: number;
  startDate: string | Date | null | undefined;
  dueDate: string | Date | null | undefined;
  cover:
    | {
        color?: null | string;
        idAttachment?: null | string;
        idUploadedBackground?: null | string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [k: string]: any; // We don't care about the other fields
      }
    | null
    | undefined;
}

const doesCardOnlyHaveName = ({
  description,
  numAttachments,
  numLabels,
  numMembers,
  numChecklistItems,
  startDate,
  dueDate,
  cover,
  numCustomFieldItems,
}: Omit<Card, 'name'>) =>
  !description?.trim().length &&
  numAttachments === 0 &&
  numLabels === 0 &&
  numMembers === 0 &&
  numChecklistItems === 0 &&
  numCustomFieldItems === 0 &&
  !dueDate &&
  !startDate &&
  (!cover ||
    (!cover.color && !cover.idAttachment && !cover.idUploadedBackground));

const isUrlMatch = (url: string, pathname: RegExp, urlOrigin: string) => {
  const parsedUrlOrigin = new Url(urlOrigin, {});
  const parsedUrl = new Url(url, {});

  return (
    parsedUrl.host === parsedUrlOrigin.host &&
    parsedUrl.pathname.match(pathname) &&
    !parsedUrl.pathname.trim().match(/\s+/)
  );
};

const canBeSeparatorCard = ({ name, ...otherFields }: Card) => {
  return (
    name.trim().match(/^(_|-)\1\1+$/gim) && doesCardOnlyHaveName(otherFields)
  );
};

const canBeBoardCard = ({ name, ...otherFields }: Card, urlOrigin: string) =>
  isUrlMatch(
    name,
    new RegExp(`\
^\
/b/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
    urlOrigin,
  ) && doesCardOnlyHaveName(otherFields);

const canBeMirrorCard = ({ name, ...otherFields }: Card, urlOrigin: string) =>
  featureFlagClient.get('wildcard.mirror-cards', false) &&
  isUrlMatch(
    name,
    new RegExp(`\
^\
/c/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
    urlOrigin,
  ) &&
  doesCardOnlyHaveName(otherFields);

const canBeLinkCard = ({ name, ...otherFields }: Card, urlOrigin: string) => {
  return (
    !isUrlMatch(
      name,
      new RegExp(`\
^\
/c/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
      urlOrigin,
    ) &&
    /^https?:\/\/\S+$/.test(name) &&
    doesCardOnlyHaveName(otherFields)
  );
};
