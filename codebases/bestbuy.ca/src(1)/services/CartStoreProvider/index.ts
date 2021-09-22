import { Cookie, CookieUtils } from "@bbyca/bbyca-components";
export class CookieCartStoreProvider {
    constructor() {
        this.id = "cartId";
        this.deleteCartId = () => {
            try {
                CookieUtils.removeCookie(this.id, this.getDomain());
            }
            catch (_a) {
                // it is Ok if the Cookie is already absent
            }
        };
        this.getCartId = () => {
            const cookie = CookieUtils.getCookie(this.id);
            const cartId = cookie ? cookie.value : undefined;
            if (cartId) {
                this.deleteCartId();
                this.setCartId(cartId);
            }
            return cartId;
        };
        this.setCartId = (cartId) => {
            const cookie = new Cookie(this.id, cartId);
            cookie.domain = this.getDomain();
            CookieUtils.setCookie(cookie);
        };
        this.getDomain = () => {
            let baseDomain = "";
            if (typeof document !== "undefined") {
                const domain = document.location.hostname.match(/\w+\.?\w+$/);
                baseDomain = domain ? domain[0] : "";
            }
            return baseDomain;
        };
    }
}
//# sourceMappingURL=index.js.map