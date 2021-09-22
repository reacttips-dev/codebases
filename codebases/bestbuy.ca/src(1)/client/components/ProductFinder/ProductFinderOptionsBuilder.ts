import {LeafOption, Option, Options, Product} from "./ProductFinderOptions";

interface IProductFinderOptionsBuilder {
    build: (data: any[], order: string[]) => Options;
}

interface FacetMap {
    [option: string]: {
        [value: string]: string[];
    };
}

export default class ProductFinderOptionsBuilder implements IProductFinderOptionsBuilder {
    public build = (data: Product[], optionOrder: string[]): Options => {
        const facetMap = this.buildFacetMap(data);
        const opts = this.buildOptions(data, facetMap, optionOrder);
        return opts;
    };

    private buildFacetMap = (data: Product[]): FacetMap => {
        const facetMap: FacetMap = {};

        const initializeFacetMap = (key) => (facetMap[key] = {});

        // initialize facetMap for all the keys, no skus yet
        data.forEach((dataPoint) => Object.keys(dataPoint).forEach(initializeFacetMap));

        data.forEach((dataPoint) => Object.keys(dataPoint.options).forEach(initializeFacetMap));

        // process all keys that are not options
        data.forEach((dataPoint) => {
            Object.keys(dataPoint).forEach((key) => {
                if (key !== "options") {
                    if (!facetMap[key][dataPoint[key]]) {
                        facetMap[key][dataPoint[key]] = [dataPoint.sku];
                    } else {
                        facetMap[key][dataPoint[key]].push(dataPoint.sku);
                    }
                }
            });
        });

        // process options key
        data.forEach((dataPoint) => {
            Object.keys(dataPoint.options).forEach((key) => {
                // if it is an object, and has en/fr keys, use en as the indexing key
                if (dataPoint.options[key] && dataPoint.options[key].en) {
                    if (!facetMap[key][dataPoint.options[key].en]) {
                        facetMap[key][dataPoint.options[key].en] = [dataPoint.sku];
                    } else {
                        facetMap[key][dataPoint.options[key].en].push(dataPoint.sku);
                    }
                } else {
                    if (!facetMap[key][dataPoint.options[key]]) {
                        facetMap[key][dataPoint.options[key]] = [dataPoint.sku];
                    } else {
                        facetMap[key][dataPoint.options[key]].push(dataPoint.sku);
                    }
                }
            });
        });

        return facetMap;
    };

    private buildOptions = (data: Product[], facetMap: FacetMap, optionOrder: string[]): Options => {
        const currentOption = {byId: {}, allIds: []};
        const [option, ...restOfOrder] = optionOrder;

        if (option && facetMap[option]) {
            Object.keys(facetMap[option]).forEach((value) => {
                const availableSkus = data.filter(this.intersect(facetMap[option][value]));

                if (!availableSkus.length) {
                    return;
                }

                const node = {
                    label: value,
                    selectedValue: value,
                };

                const checkFn = (prod) => {
                    if (option === "color") {
                        return `${prod.options[option].en}` === `${value}`;
                    } else {
                        return `${prod.options[option]}` === `${value}`;
                    }
                };

                if (this.isLeaf(optionOrder)) {
                    const found = data.filter(checkFn);
                    (node as LeafOption | any).product = found[0];
                } else {
                    (node as Option).options = this.buildOptions(availableSkus, facetMap, restOfOrder);
                }

                currentOption.byId[value] = node;
            });
        }

        currentOption.allIds = Object.keys(currentOption.byId);

        return currentOption;
    };

    private intersect = (skuList: string[]) => (product: Product) => skuList.indexOf(product.sku) >= 0;

    private isLeaf = (order: string[]) => order.length === 1;
}
