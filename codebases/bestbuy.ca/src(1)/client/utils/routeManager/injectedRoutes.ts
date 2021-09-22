import { Routes } from "models";
import InjectedPage from "Decide/pages/InjectedPage";

const injectedRoutes: Routes = [
    {
        component: InjectedPage,
        isServerSideRenderEnabled: false,
        key: "returnsAndExchanges",
    },
    {
        component: InjectedPage,
        isServerSideRenderEnabled: false,
        key: "productMarketingForm",
    },
] as any;

export default injectedRoutes;
