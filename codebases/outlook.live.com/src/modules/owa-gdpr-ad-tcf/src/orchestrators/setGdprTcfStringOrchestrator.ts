import gdprTcfStore from '../store/gdprTcfStore';
import { orchestrator } from 'satcheljs';
import setGdprTcfString from '../actions/setGdprTcfString';
import { CmpApi } from '@iabtcf/cmpapi';

export default orchestrator(setGdprTcfString, actionMessage => {
    gdprTcfStore.gdprTcfString = actionMessage.tcfString;
    const cmpApi = new CmpApi(168, 2, false);
    cmpApi.update(actionMessage.tcfString);
});
