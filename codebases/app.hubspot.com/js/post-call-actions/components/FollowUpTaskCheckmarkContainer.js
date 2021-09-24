'use es6';

import compose from 'transmute/compose';
import { withUserSettingsData } from '../../userSettings/decorators/RequireUserSettingsData';
import FollowUpTaskCheckmark from './FollowUpTaskCheckmark';
export default compose(withUserSettingsData())(FollowUpTaskCheckmark);