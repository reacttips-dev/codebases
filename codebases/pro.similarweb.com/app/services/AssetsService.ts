export class AssetsServiceClass {
    private readonly _root: string;

    constructor(root) {
        this._root = root || "";
    }

    public assetsRoot(): string {
        return this._root || "";
    }

    public assetUrl(path): string {
        if (path && path.startsWith("http")) return path;
        if (this.isImagePath(path)) {
            path = path.replace(/^\/Images\//, "/images/");
        }
        const delimiter = path && path.startsWith("/") ? "" : "/";
        return [this.assetsRoot(), path].join(delimiter);
    }

    public isImagePath(path): boolean {
        return /^\/?[iI]mages\/.*/.test(path);
    }

    public normalizeImagePath(path): string {
        if (this.isImagePath(path)) {
            return this.assetUrl(path);
        } else {
            return path;
        }
    }
}

export const AssetsService = new AssetsServiceClass(window["assetsRoot"]);
