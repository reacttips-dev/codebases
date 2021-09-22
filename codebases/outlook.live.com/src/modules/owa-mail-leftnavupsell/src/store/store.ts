import { createStore } from 'satcheljs';
import { LeftNavUpsellState, ButtonIconType } from './schema/leftNavUpsellState';

export default createStore<LeftNavUpsellState>('LeftNavUpsellState', {
    isHidden: true,
    url: '',
    datapointNameShow: '',
    datapointNameClicked: '',
    buttonText: '',
    buttonTextLine2: '',
    buttonIconPath: '',
    buttonIconType: ButtonIconType.SvgIcon,
    irisImpressionUrl: '',
    irisBeaconUrl: '',
})();
