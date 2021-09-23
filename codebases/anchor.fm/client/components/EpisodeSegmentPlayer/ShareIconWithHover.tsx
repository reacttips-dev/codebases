import ShareIcon from '../ShareIcon';
import { HoverWrappedComponent } from './utils';

/**
 * @deprecated Re-implement this with CSS hover styling
 */
export const ShareIconWithHover = HoverWrappedComponent(
  ShareIcon,
  { fgColor: '#7F8287' },
  { fgColor: '#292F36' }
);
