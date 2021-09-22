import store from '../store/store';
import { mutatorAction } from 'satcheljs';
import type { LeftNavUpsellState } from '../store/schema/leftNavUpsellState';

export default mutatorAction(
    'setUpsellState',
    function setUpsellState(state: LeftNavUpsellState): void {
        store.isHidden = state.isHidden;
        store.url = state.url;
        store.datapointNameShow = state.datapointNameShow;
        store.datapointNameClicked = state.datapointNameClicked;
        store.buttonText = state.buttonText;
        store.buttonTextLine2 = state.buttonTextLine2;
        store.buttonIconPath = state.buttonIconPath;
        store.buttonIconType = state.buttonIconType;
        if (state.irisImpressionUrl) {
            store.irisImpressionUrl = state.irisImpressionUrl;
        }
        if (state.irisBeaconUrl) {
            store.irisBeaconUrl = state.irisBeaconUrl;
        }
    }
);
