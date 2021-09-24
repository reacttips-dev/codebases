import { Record } from 'immutable';
import { FEW_MINUTES } from '../constants/StandardResponses';
import { MINUTES } from '../constants/Units';
export default Record({
  enabled: false,
  usingCustomResponse: false,
  standardResponse: FEW_MINUTES,
  customResponseQuantity: 5,
  customResponseUnit: MINUTES
}, 'TypicalResponseTime');