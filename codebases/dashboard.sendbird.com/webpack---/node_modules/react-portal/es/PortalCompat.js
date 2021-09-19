import ReactDOM from 'react-dom';

import Portalv4 from './Portal';
import LegacyPortal from './LegacyPortal';

var Portal = void 0;

if (ReactDOM.createPortal) {
  Portal = Portalv4;
} else {
  Portal = LegacyPortal;
}

export default Portal;