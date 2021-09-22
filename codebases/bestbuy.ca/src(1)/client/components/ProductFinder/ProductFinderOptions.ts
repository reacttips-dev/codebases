export interface Product {
    name: string;
    sku: string;
    images: string[];
    price: number;
    options: {
        model: string;
        capacity: string;
        carrier: number;
        color: {
            [key: string]: string;
            en: string;
            fr: string;
        };
    };
}

export interface Option {
    label: string;
    options?: Options;
    selectedValue: string;
}

export interface LeafOption extends Option {
    product: Product;
}

export interface Options {
    byId: {
        [key: string]: Option | LeafOption;
    };
    allIds: string[];
}

export interface IProductFinderOptions {
    options: Options;
    getAllOptionsForPath: (path: string[]) => Option[];
    getNodeForPath: (path: string[]) => Option | LeafOption;
}

class ProductFinderOptions implements IProductFinderOptions {
    public options: Options;

    constructor(options: Options) {
        this.options = options;
    }

    public getAllOptionsForPath = (path: string[]) => {
        const options = this.traverseTree(path);

        return options && options.allIds.map((id) => options.byId[id]);
    };

    public getNodeForPath = (path: string[]) => {
        const options = this.traverseTree(path.slice(0, path.length - 1));

        return options && options.byId[path[path.length - 1]];
    };

    private traverseTree = (path: string[]) => {
        let currentOption = this.options;

        path.forEach((p) => {
            if (!currentOption.byId[p]) {
                return;
            }

            currentOption = currentOption.byId[p].options;
        });

        return currentOption;
    };
}

export default ProductFinderOptions;
