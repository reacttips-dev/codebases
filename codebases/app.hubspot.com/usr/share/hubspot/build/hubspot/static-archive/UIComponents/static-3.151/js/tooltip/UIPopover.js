'use es6';

import Controllable from '../decorators/Controllable';
import UIControlledPopover from './UIControlledPopover';
export default Controllable(UIControlledPopover, ['open']);