import store from '../store/store';
import type ObservableOwaUserConfiguration from '../types/ObservableOwaUserConfiguration';

export default function getUserConfiguration(): ObservableOwaUserConfiguration {
    return store.userConfiguration;
}
