import { useEffect, useState } from "react";

const useLocalStorage = (
    key,
    defaultValue = null,
    depsArr = [],
): [string, (value: string) => void] => {
    if (defaultValue !== null) {
        localStorage.setItem(key, defaultValue);
    }

    const [internalValue, setInternalValue] = useState(localStorage.getItem(key));

    useEffect(() => {
        setInternalValue(localStorage.getItem(key));
    }, [key, ...depsArr]);

    return [
        internalValue,
        (value) => {
            localStorage.setItem(key, value);
            setInternalValue(localStorage.getItem(key));
        },
    ];
};

export default useLocalStorage;
