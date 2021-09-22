import useLocalStorage from "custom-hooks/useLocalStorage";
import { COLUMNS_SELECTION_STORAGE_KEY } from "../constants/table";

type HookReturnType = [readonly string[], (namesToPersist: readonly string[]) => void];

const usePersistedColumnsSelection = (): HookReturnType => {
    const [columnsNamesString, persistColumnsNames] = useLocalStorage(
        COLUMNS_SELECTION_STORAGE_KEY,
    );
    /**
     * Calls useLocalStorage hook to save given columns names
     * @param namesToPersist
     */
    const stringifyAndSave = (namesToPersist: readonly string[]) => {
        if (!Array.isArray(namesToPersist)) {
            return;
        }

        persistColumnsNames(JSON.stringify(namesToPersist));
    };

    return [columnsNamesString === null ? [] : JSON.parse(columnsNamesString), stringifyAndSave];
};

export default usePersistedColumnsSelection;
