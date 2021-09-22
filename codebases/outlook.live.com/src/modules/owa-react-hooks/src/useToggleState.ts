import { useBooleanState } from './useBooleanState';

export function useToggleState(
    initialValue: boolean
): [boolean, () => void, () => void, () => void] {
    const [value, setTrue, setFalse] = useBooleanState(initialValue);
    const toggle = value ? setFalse : setTrue;
    return [value, toggle, setTrue, setFalse];
}
