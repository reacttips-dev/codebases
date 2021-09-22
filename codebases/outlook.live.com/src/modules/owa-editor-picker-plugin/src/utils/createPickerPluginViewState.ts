import type PickerPluginViewState from '../schema/PickerPluginViewState';

export default function createPickerPluginViewState(): PickerPluginViewState {
    return {
        isSuggesting: false,
        bufferZone: 0,
        targetPoint: null,
    };
}
