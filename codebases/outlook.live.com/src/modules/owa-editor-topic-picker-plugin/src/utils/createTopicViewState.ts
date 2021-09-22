import type { TopicViewState } from '../store/schema/TopicViewState';
import createPickerPluginViewState from 'owa-editor-picker-plugin/lib/utils/createPickerPluginViewState';

export default function createTopicViewState(): TopicViewState {
    const viewState = {
        ...createPickerPluginViewState(),
        queryString: '',
        topics: [],
        selectedIndex: 0,
    };
    return viewState;
}
