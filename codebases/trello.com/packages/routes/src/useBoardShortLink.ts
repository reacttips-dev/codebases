import { useLocation } from '@trello/router';
import { getBoardShortLinkFromPathname } from './getBoardShortLinkFromPathname';

export function useBoardShortLink() {
  const { pathname } = useLocation();
  return getBoardShortLinkFromPathname(pathname);
}
