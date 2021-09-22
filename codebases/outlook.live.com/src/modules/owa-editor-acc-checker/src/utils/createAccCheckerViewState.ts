import type AccCheckerViewState from '../store/schema/AccCheckerViewState';

export default function createAccCheckerViewState(useFlexPane: boolean): AccCheckerViewState {
    return {
        isOpen: false,
        errors: [],
        useFlexPane,
    };
}
