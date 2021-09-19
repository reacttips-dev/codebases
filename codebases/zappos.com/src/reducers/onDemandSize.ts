import { SAVE_ODSP_DATA } from 'constants/reduxActions';
import { AppAction } from 'types/app';
import { OdspData } from 'types/opal';

export type OnDemandSizeState = OdspData | {};

const onDemandSize = (state: OnDemandSizeState = {}, action: AppAction): OnDemandSizeState => {
  switch (action.type) {
    case SAVE_ODSP_DATA:
      const { data } = action;
      return data;
    default:
      return state;
  }
};

export default onDemandSize;
