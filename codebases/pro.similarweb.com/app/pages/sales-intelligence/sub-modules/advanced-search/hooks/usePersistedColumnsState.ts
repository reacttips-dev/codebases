import { useEffect, useState } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FlexTableColumnType } from "pages/sales-intelligence/types";
import usePersistedColumnsSelection from "./usePersistedColumnsSelection";
import { getSearchResultsTableColumns } from "../configuration/table-columns";
import { arraysHaveSamePrimitiveValues } from "pages/sales-intelligence/helpers/helpers";

type HookReturnType = [readonly FlexTableColumnType[], (columns: FlexTableColumnType[]) => void];

const usePersistedColumnsState = (): HookReturnType => {
    const translate = useTranslation();
    const [columnsNames, persistColumnsNames] = usePersistedColumnsSelection();
    const [columns, updateColumns] = useState(getInitialColumns);

    useEffect(() => {
        const currentVisibleNames = columns.filter((c) => c.field && c.visible).map((c) => c.field);

        if (!arraysHaveSamePrimitiveValues(currentVisibleNames, columnsNames)) {
            persistColumnsNames(currentVisibleNames);
        }
    }, [columns]);

    function getInitialColumns() {
        const fromConfig = getSearchResultsTableColumns(translate);

        if (columnsNames.length === 0) {
            return fromConfig;
        }

        return fromConfig.map((c) => {
            if (!c.field) {
                return c;
            }

            return {
                ...c,
                visible: columnsNames.includes(c.field),
            };
        });
    }

    return [columns, updateColumns];
};

export default usePersistedColumnsState;
