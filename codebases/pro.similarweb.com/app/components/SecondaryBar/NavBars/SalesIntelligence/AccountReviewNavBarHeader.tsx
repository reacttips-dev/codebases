import React, { useCallback, useMemo, FC } from "react";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const AccountReviewNavBarHeader: FC<{}> = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);

    const handleClick = useCallback(() => {
        navigator.go("salesIntelligence-home");
    }, [navigator]);

    return (
        <NavBarDefaultHeader
            text={translate("salesintelligence.accountreview.navbar.header")}
            onClick={handleClick}
        />
    );
};
