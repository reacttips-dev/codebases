import styled from "styled-components";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent, useEffect } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "../../../filters/ngFilters";
import { swSettings } from "common/services/swSettings";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";

export const AddToDashboardWrapper = styled.div`
    position: inherit;
    top: 7px;
    right: 0;
`;

export const AddToDashboardButton: StatelessComponent<any> = ({ onClick, modalRef }) => {
    //TODO: remove check if dashboards will be added to sales 2
    const { user } = swSettings;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { absoluteUrl = "" } = swNavigator.current() as any;
    const isDashboardAvailable =
        absoluteUrl.startsWith("/sales/account-review/") && user.hasSI ? false : true;

    useEffect(() => {
        return () => {
            modalRef?.current?.dismiss();
        };
    }, [modalRef]);

    return isDashboardAvailable ? (
        <PlainTooltip tooltipContent={i18nFilter()(`common.addtodashboard.button.tooltip`)}>
            <div data-automation="Add To Dashboard" onClick={onClick}>
                <AddToDashboardWrapper className="AddToDashboardWrapper">
                    <IconButton type="flat" iconName="add" />
                </AddToDashboardWrapper>
            </div>
        </PlainTooltip>
    ) : (
        <></>
    );
};
export default SWReactRootComponent(AddToDashboardButton, "AddToDashboardButton");
