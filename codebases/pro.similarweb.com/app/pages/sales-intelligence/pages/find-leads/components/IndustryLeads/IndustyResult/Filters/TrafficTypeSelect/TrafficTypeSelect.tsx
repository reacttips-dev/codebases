import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTableContext } from "../../TableContextProvider";

export const TrafficTypeSelect = (): JSX.Element => {
    const translate = useTranslation();

    const { trafficTypeValue, trafficTypes, onTrafficTypeSelect, isLoading } = useTableContext();

    const handleChange = (selectedTableTest): void => {
        onTrafficTypeSelect(selectedTableTest);
    };

    const websiteTypeItems = trafficTypes.map(({ text, id }) => {
        return (
            <EllipsisDropdownItem key={text} id={id} text={text}>
                {text}
            </EllipsisDropdownItem>
        );
    });

    return (
        <ChipDownContainer
            tooltipDisabled
            width={280}
            hasSearch={false}
            selectedText={trafficTypeValue}
            buttonText={"All Sources"}
            onClick={handleChange}
            onCloseItem={() => onTrafficTypeSelect(null)}
            disabled={isLoading}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
