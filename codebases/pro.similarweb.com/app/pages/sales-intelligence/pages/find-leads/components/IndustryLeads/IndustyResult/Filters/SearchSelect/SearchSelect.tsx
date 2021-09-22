import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTableContext } from "../../TableContextProvider";

export const SearchSelect = (): JSX.Element => {
    const translate = useTranslation();

    const { searchSelectValue, searchSelectOptions, onSearchSelect, isLoading } = useTableContext();
    // const [selectedItemText, setSelectedItemText] = useState<string>(searchSelectValue);

    const handleChange = (selectedTableTest): void => {
        onSearchSelect(selectedTableTest);
    };

    const websiteTypeItems = searchSelectOptions.map(({ text, id, tooltipText }) => {
        return (
            <EllipsisDropdownItem key={text} id={id} tooltipText={tooltipText} text={text}>
                {text}
            </EllipsisDropdownItem>
        );
    });

    return (
        <ChipDownContainer
            tooltipDisabled
            width={280}
            hasSearch={false}
            selectedText={searchSelectValue}
            buttonText={"All Sources"}
            onClick={handleChange}
            onCloseItem={() => onSearchSelect(null)}
            disabled={isLoading}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
