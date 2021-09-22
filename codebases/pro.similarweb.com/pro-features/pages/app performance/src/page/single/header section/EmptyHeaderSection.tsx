import { Button } from "@similarweb/ui-components/dist/button";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import BoxSubtitle from "../../../../../../components/BoxSubtitle/src/BoxSubtitle";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import WithAllContexts from "../../../common components/WithAllContexts";
import { Type } from "../../StyledComponents";
import Metric from "./Metric";
import {
    AppDescription,
    AppTitle,
    HeaderContainer,
    Metrices,
    StyledSubtitle,
} from "./StyledComponents";

const EmptyHeaderSection: StatelessComponent<any> = ({ isPropertyTracked, onAppTrack }) => {
    return (
        <WithAllContexts>
            {({ translate, filters }) => {
                const subtitleFilters = [
                    {
                        filter: "date",
                        value: {
                            from: filters.from,
                            to: filters.to,
                        },
                    },
                ];
                return (
                    <HeaderContainer>
                        <FlexRow>
                            <AppDescription>
                                <FlexRow>
                                    <ItemIcon
                                        iconType={Type.App}
                                        iconName={filters.appsInfo[0].title}
                                        iconSrc={filters.appsInfo[0].icon}
                                    />
                                    <AppTitle>
                                        {filters.appsInfo[0].title || filters.mainAppId}
                                    </AppTitle>
                                    <Button
                                        type="outlined"
                                        className={classNames("Button-track", {
                                            "Button-track--tracking": isPropertyTracked,
                                        })}
                                        height={36}
                                        onClick={onAppTrack}
                                    >
                                        {translate(
                                            isPropertyTracked
                                                ? "app.performance.header.tracking"
                                                : "app.performance.header.track",
                                        )}
                                    </Button>
                                </FlexRow>
                                <StyledSubtitle>
                                    <BoxSubtitle filters={subtitleFilters} />
                                </StyledSubtitle>
                            </AppDescription>
                        </FlexRow>
                        <Metrices>
                            <Metric
                                icon="app-downloads"
                                title={translate("app.performance.header.downloads")}
                            />
                            <Metric
                                icon="app-rating"
                                title={translate("app.performance.header.rating")}
                            />
                            <Metric
                                icon="current-version"
                                title={translate("app.performance.header.version")}
                            />
                        </Metrices>
                    </HeaderContainer>
                );
            }}
        </WithAllContexts>
    );
};
EmptyHeaderSection.displayName = "EmptyHeaderSection";
export default EmptyHeaderSection;
