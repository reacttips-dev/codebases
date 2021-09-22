import { errorActiontype, navigationActionTypes } from "../../actions";
import { initialNavigationState, } from "./initialNavigationState";
export const navigation = (state = initialNavigationState, action) => {
    switch (action.type) {
        case navigationActionTypes.clear:
            return Object.assign(Object.assign({}, state), { loading: false, selectedCategory: "", showAccountLinks: false });
        case navigationActionTypes.toggleFlyoutOverlay:
            return Object.assign(Object.assign({}, state), { flyoutOverlay: action.open });
        case navigationActionTypes.displayCategory:
            return Object.assign(Object.assign({}, state), { loading: false, selectedCategory: action.selectedCategory });
        case navigationActionTypes.viewCart:
            return Object.assign(Object.assign({}, state), { viewCart: true });
        case navigationActionTypes.retrieveBrandsMenuContent:
            return Object.assign(Object.assign({}, state), { brandsMenuContent: action.brandsMenuContent });
        case navigationActionTypes.retrieveShopMenuContent:
            return Object.assign(Object.assign({}, state), { shopMenuContent: action.shopMenuContent });
        case navigationActionTypes.retrieveGlobalMenuContent:
            return Object.assign(Object.assign({}, state), { globalMenuContent: action.globalMenuContent });
        case errorActiontype.error:
            return Object.assign(Object.assign({}, state), { loading: false });
        default:
            return state;
    }
};
export default navigation;
//# sourceMappingURL=index.js.map