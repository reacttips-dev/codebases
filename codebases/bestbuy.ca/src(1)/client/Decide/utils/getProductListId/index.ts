import {cieUtilities} from "@bbyca/account-components";
import {ProductListIdCookieProvider} from "../../providers/ProductListIdCookieProvider";

const getProductListId = (): string | undefined => {
    const cidCookie = cieUtilities.getCustomerIdCookie();

    // if user id is present it takes precedence
    if (cidCookie) {
        return cidCookie.id.replace("{", "").replace("}", "");
    }

    const productListIdCookieProvider = new ProductListIdCookieProvider();
    const productListIdCookie = productListIdCookieProvider.getProductListId();

    // use product list id for guest user
    // it may be undefined which means that there's no list for the user
    return productListIdCookie;
};

export default getProductListId;
