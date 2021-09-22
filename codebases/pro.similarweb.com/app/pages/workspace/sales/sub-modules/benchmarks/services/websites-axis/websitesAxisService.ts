import { WebsiteWithValue } from "../../types/common";
import { AxisWebsiteType } from "../../types/chart";
import createBenchmarkItemService from "../benchmark-item/benchmarkItemServiceFactory";
import { compareNumericPropAsc, compareNumericPropDesc, prop } from "pages/workspace/sales/helpers";

const createWebsitesAxisService = (itemService: ReturnType<typeof createBenchmarkItemService>) => {
    const TICKS_VALUES_COEFFICIENT = 0.05;
    const getValue = prop("value");
    const formatValue = itemService.defaultFormatter;
    const compareValues = itemService.bResult.greaterIsBetter
        ? compareNumericPropAsc("value")
        : compareNumericPropDesc("value");
    const allWebsites: WebsiteWithValue[] = [
        itemService.prospect,
        ...itemService.bResult.competitors,
    ].sort(compareValues);
    const allWebsitesValues = allWebsites.map(getValue);
    const min = Math.min.apply(null, allWebsitesValues);
    const max = Math.max.apply(null, allWebsitesValues);
    const minTick = min - Math.abs((max - min) * TICKS_VALUES_COEFFICIENT);
    const maxTick = max + Math.abs((max - min) * TICKS_VALUES_COEFFICIENT);
    /**
     * Flips given position in percents
     * @example
     * `
     *   flipPosition(25) -> 75
     *   flipPosition(100) -> 0
     * `
     */
    const flipPosition = (position: number) => {
        return Math.abs(position - 100);
    };
    /**
     * Formats tick values for min & max based on the "greaterIsBetter" condition.
     */
    const getMinMaxTicks = () => {
        if (itemService.bResult.greaterIsBetter) {
            return { minTick: formatValue(minTick), maxTick: formatValue(maxTick) };
        }

        return { minTick: formatValue(maxTick), maxTick: formatValue(minTick) };
    };
    /**
     * Calculates website's position on the axis in percents
     */
    const calculatePosition = (value: number) => {
        const position = ((value - minTick) * 100) / (maxTick - minTick);

        return itemService.bResult.greaterIsBetter ? position : flipPosition(position);
    };
    /**
     * Creates ready-to-use websites objects for "axis" view
     */
    const createAxisWebsite = (website: WebsiteWithValue): AxisWebsiteType => {
        return {
            domain: website.domain,
            favicon: website.favicon,
            value: formatValue(website.value),
            isMain: website.domain === itemService.prospect.domain,
            position: calculatePosition(website.value),
        };
    };

    return {
        getConfig() {
            return {
                websites: allWebsites.map(createAxisWebsite),
                ...getMinMaxTicks(),
            };
        },
    };
};

export default createWebsitesAxisService;
