import { DefaultDataFetcher } from "components/widget/widget-fetchers/DefaultDataFetcher";
import { Injector } from "common/ioc/Injector";
function dataFetcherFactory(widget) {
    const internalFetcher = Injector.instantiate(DefaultDataFetcher, { widget });
    return {
        fetch() {
            const endPointFinalFilters = widget.apiParams;
            return internalFetcher.fetch(endPointFinalFilters).then((data) => {
                return data;
            });
        },
        destroy() {},
    };
}
export default class {
    create(widget) {
        return Injector.invoke(dataFetcherFactory, null, { widget });
    }
}
