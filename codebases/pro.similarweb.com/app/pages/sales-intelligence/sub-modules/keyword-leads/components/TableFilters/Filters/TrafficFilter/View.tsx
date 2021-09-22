import React from "react";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { capitalize } from "../../../../utils";
import { TableTrafficPropsType } from "../../../../types";

export const TableTrafficSelect = ({
    selectedTraffic,
    setTraffic,
    trafficTypes,
    isFetching,
}: TableTrafficPropsType): JSX.Element => {
    const translate = useTranslation();

    const handleClick = (selectedTableTest): void => {
        setTraffic(selectedTableTest);
    };

    const getOptions = () => {
        return trafficTypes && trafficTypes.length
            ? trafficTypes.map((category) => {
                  return (
                      <EllipsisDropdownItem
                          selected={selectedTraffic === category}
                          key={`${category}-key`}
                          id={category}
                          text={category}
                      >
                          {capitalize(category)}
                      </EllipsisDropdownItem>
                  );
              })
            : [];
    };

    return (
        <ChipDownContainer
            width={340}
            onClick={handleClick}
            selectedText={""}
            onCloseItem={() => setTraffic(null)}
            buttonText={capitalize(selectedTraffic)}
            tooltipDisabled
            disabled={isFetching}
        >
            {getOptions()}
        </ChipDownContainer>
    );
};
