import { IconButton } from "@similarweb/ui-components/dist/button";
import { PageHeaderContainer } from "pages/competitive-tracking/homepage/styled";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const PageHeader = () => {
    const onBackClicked = () => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        swNavigator.go("companyresearch_competitivetracking_home");
    };
    const i18n = i18nFilter();
    return (
        <PageHeaderContainer>
            <IconButton
                iconName={"arrow-left"}
                type={"flat"}
                isActivated={true}
                onClick={onBackClicked}
            >
                {i18n("common.back")}
            </IconButton>
        </PageHeaderContainer>
    );
};
