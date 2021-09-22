import * as _ from "lodash";
import { IRootScopeService } from "angular";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { widgetPos } from "../DashboardTemplateService";
import { gridsterPreferences } from "../../../../pages/dashboard/gridster/gridster.preferences";
export const GridUtilities = {
    /**
     * get an instance of gridster controller
     * @returns {any}
     */
    getGridInstance: () => {
        const locals = {
            $scope: Injector.get<IRootScopeService>("$rootScope").$new(),
        };
        const options = gridsterPreferences;
        const grid = Injector.get<any>("$controller")("GridsterCtrl", locals);
        grid.setOptions(options);
        return grid;
    },

    /**
     * removes an empty rows from the grid, moving items up if needed
     * @param grid
     */
    removeEmptyRows: (grid) => {
        let emptyRowsCounter = 0;
        for (let i = 0; i < grid.grid.length; i++) {
            const row = grid.grid[i];
            if (!row) {
                const prevRowHeight = GridUtilities.getRowHeight(grid.grid, i - 1);
                // increase counter only if the previous row have no items that take more then one row
                if (prevRowHeight == 1) {
                    emptyRowsCounter++;
                }
            } else {
                row.forEach((item) => {
                    if (item && item.row) {
                        item.row = item.row - emptyRowsCounter;
                    }
                });
            }
        }
    },

    /**
     * Get the height of a row, take the highest item in that row.
     * @param grid
     * @param {number} row
     * @returns {any}
     */
    getRowHeight: (grid, row: number) => {
        const items = grid[row];
        const maxY = _.maxBy<widgetPos>(items, "sizeY");
        return (maxY && maxY.sizeY) || 1;
    },
};
