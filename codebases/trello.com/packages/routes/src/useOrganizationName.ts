import { useLocation } from '@trello/router';
import { getOrganizationNameFromPathname } from './getOrganizationNameFromPathname';

export function useOrganizationName() {
  const { pathname } = useLocation();
  return getOrganizationNameFromPathname(pathname);
}
