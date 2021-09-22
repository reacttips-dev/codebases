import React from "react";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTableContext } from "../../TableContextProvider";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { optionsConfig } from "../../configs/allConfigs";

export const TableTypeSelect = (): JSX.Element => {
    const { selectedTableType, setTableType, tableTypes, isLoading } = useTableContext();

    const translate = useTranslation();

    const handleClick = (selectedTableTest): void => {
        setTableType(selectedTableTest);
    };

    const getOptions = () => {
        return tableTypes.map((category) => {
            const { text, id, tooltipText } = category;
            return (
                <EllipsisDropdownItem
                    selected={selectedTableType === id}
                    key={text}
                    id={id}
                    tooltipText={tooltipText}
                    text={text}
                >
                    {text}
                </EllipsisDropdownItem>
            );
        });
    };

    const selectedText = selectedTableType
        ? optionsConfig.find((item) => item.id === selectedTableType).text
        : "";

    return (
        <ChipDownContainer
            width={340}
            onClick={handleClick}
            selectedText={""}
            onCloseItem={() => setTableType(null)}
            buttonText={translate(selectedText)}
            searchPlaceHolder={translate("Search")}
            tooltipDisabled
            disabled={isLoading}
            hasSearch
        >
            {getOptions()}
        </ChipDownContainer>
    );
};
