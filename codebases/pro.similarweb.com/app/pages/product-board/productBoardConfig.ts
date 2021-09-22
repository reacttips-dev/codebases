/* eslint-disable @typescript-eslint/camelcase */
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

export const productBoardConfig = {
    "product_roadmap-root": {
        abstract: true,
        parent: "sw",
        secondaryBarType: "None" as SecondaryBarType,
        template: `<!-- START research layout --><div ui-view class="sw-layout-module sw-layout-no-scroll-container fadeIn"></div><!-- END research layout -->`,
    },
    product_roadmap_dmi: {
        parent: "product_roadmap-root",
        url: "/product-updates/dmi",
        configId: "ProductBoard",
        template: `<sw-react component="ProductBoardPage" props="{ solution: 'dmi' }"></sw-react>`,
    },
    product_roadmap_ri: {
        parent: "product_roadmap-root",
        url: "/product-updates/ri",
        configId: "ProductBoard",
        template: `<sw-react component="ProductBoardPage" props="{ solution: 'ri' }"></sw-react>`,
    },
};

export default productBoardConfig;
