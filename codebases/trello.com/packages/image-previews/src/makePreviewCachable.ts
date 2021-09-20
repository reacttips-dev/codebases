import { siteDomain } from '@trello/config';

export function makePreviewCachable(previewUrl: string | undefined) {
  if (
    typeof previewUrl !== 'string' ||
    !previewUrl ||
    !previewUrl.startsWith(siteDomain)
  ) {
    return previewUrl;
  }
  const url = new URL(previewUrl);
  url.searchParams.delete('signature');
  return url.href;
}
