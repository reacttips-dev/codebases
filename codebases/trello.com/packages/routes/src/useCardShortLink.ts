import { useLocation } from '@trello/router';
import { getCardShortLinkFromPathname } from './getCardShortLinkFromPathname';

export function useCardShortLink() {
  const { pathname } = useLocation();
  return getCardShortLinkFromPathname(pathname);
}
