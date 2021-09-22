import React, { FC, useContext, useMemo } from "react";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

import { AccountReviewSection } from "./NavBarSections/AccountReviewSection";

export const AccountReviewNavBarBody: FC<{}> = () => {
    const { currentPage, params } = useContext<ISecondaryBarContext>(SecondaryBarContext);

    const services = useMemo(() => {
        return {
            navigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }, []);

    return (
        <>
            <AccountReviewSection
                params={params}
                currentPage={currentPage}
                navigator={services.navigator}
            />
        </>
    );
};
