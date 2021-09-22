import { SWReactIcons } from "@similarweb/icons";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import CoreTrendsBarCell from "components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import { ITrendsBarValue } from "components/TrendsBar/src/TrendsBar";
import { default as React, FunctionComponent } from "react";
import {
    NoDataContainer,
    NoDataSubTitle,
    NoDataText,
    NoDataTitle,
    SuggestionWidgetIconButton,
    SuggestionWidgetRightSection,
    SuggestionWidgetTextWrapper,
    SuggestionWidgetTrendBarWrapper,
    SuggestionWidgetWrapper,
} from "./styledComponents";

export const SuggestionWidgetNoData: any = ({ messageTop, messageBottom }) => {
    return (
        <NoDataContainer>
            <NoDataText>
                <NoDataTitle>{messageTop}</NoDataTitle>
                <NoDataSubTitle>{messageBottom}</NoDataSubTitle>
            </NoDataText>
        </NoDataContainer>
    );
};

interface ISeedKWSuggestionWidgetProps {
    name: string;
    value: ITrendsBarValue[];
    onClick: VoidFunction;
    isLoading: boolean;
}

const SeedKWSuggestionWidget: FunctionComponent<ISeedKWSuggestionWidgetProps> = ({
    name,
    value,
    onClick,
    isLoading,
}) => {
    return (
        <SuggestionWidgetWrapper>
            {isLoading ? (
                <>
                    <div className="SeedKWSuggestionWidget-loader">
                        <DotsLoader />
                    </div>
                    <SuggestionWidgetIconButton
                        type="flat"
                        iconName="add"
                        width={40}
                        height={40}
                        isDisabled
                    />
                </>
            ) : (
                <>
                    <SuggestionWidgetTextWrapper title={name}>{name}</SuggestionWidgetTextWrapper>
                    <SuggestionWidgetRightSection>
                        <SuggestionWidgetTrendBarWrapper>
                            {!value ? (
                                <span className="SeedKWSuggestionWidget-NA">N/A</span>
                            ) : (
                                <CoreTrendsBarCell value={value} />
                            )}
                        </SuggestionWidgetTrendBarWrapper>
                        <SuggestionWidgetIconButton
                            type="flat"
                            iconName="add"
                            width={40}
                            height={40}
                            onClick={onClick}
                        />
                    </SuggestionWidgetRightSection>
                </>
            )}
        </SuggestionWidgetWrapper>
    );
};

export default SeedKWSuggestionWidget;
