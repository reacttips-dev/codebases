import { useState, useCallback } from 'react';

export function useBooleanState(initialValue: boolean): [boolean, () => void, () => void] {
    const [value, setValue] = useState(initialValue);
    const setTrue = useCallback(() => setValue(true), [setValue]);
    const setFalse = useCallback(() => setValue(false), [setValue]);
    return [value, setTrue, setFalse];
}
