import {Cookie, CookieUtils} from "@bbyca/bbyca-components";

export interface IProductListIdCookieProvider {
    deleteProductListId: () => void;
    getProductListId: () => string | undefined;
    setProductListId: (productListId: string) => void;
}

export default class ProductListIdCookieProvider implements IProductListIdCookieProvider {
    private id = "productListId";

    public deleteProductListId = (): void => {
        try {
            CookieUtils.removeCookie(this.id, this.getDomain());
        } catch {
            // it is Ok if the Cookie is already absent
        }
    };

    public getProductListId = (): string | undefined => {
        const cookie = CookieUtils.getCookie(this.id);
        const productListId = cookie?.value;

        if (productListId) {
            this.deleteProductListId();
            this.setProductListId(productListId);
        }

        return productListId;
    };

    public setProductListId = (productListId: string): void => {
        const cookie = new Cookie(this.id, productListId);
        cookie.domain = this.getDomain();

        CookieUtils.setCookie(cookie);
    };

    private getDomain = (): string => {
        let baseDomain = "";
        if (typeof document !== "undefined") {
            const domain = document.location.hostname.match(/\w+\.?\w+$/);
            baseDomain = domain ? domain[0] : "";
        }

        return baseDomain;
    };
}
