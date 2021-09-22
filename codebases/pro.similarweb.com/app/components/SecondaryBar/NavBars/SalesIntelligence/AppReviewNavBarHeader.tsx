import React from "react";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import { useTranslation } from "components/WithTranslation/src/I18n";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";

const AppReviewNavBarHeader: React.FC<WithSWNavigatorProps> = ({ navigator }) => {
    const translate = useTranslation();

    const handleClick = React.useCallback(() => {
        navigator.go("salesIntelligence-home");
    }, [navigator]);

    return <NavBarDefaultHeader text={translate("si.apps.navbar.title")} onClick={handleClick} />;
};

export default withSWNavigator(AppReviewNavBarHeader);
