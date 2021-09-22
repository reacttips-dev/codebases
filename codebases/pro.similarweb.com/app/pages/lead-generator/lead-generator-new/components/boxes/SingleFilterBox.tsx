import React from "react";
import FiltersBox from "./FiltersBox";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

interface ISingleFilterBoxProps {
    preface: string;
    dataAutomation: string;
    title: string;
    subtitle: string;
    subtitleCollapsed: string;
    filters: any[]; // TODO: proper type
    setActive: (boolean) => void;
    hasToggle?: boolean;
    hasValue: boolean;
    technologies: ICategoriesResponse;
}

const SingleFilterBox: React.FC<ISingleFilterBoxProps> = ({
    title,
    subtitleCollapsed,
    filters,
    setActive,
    preface,
    dataAutomation,
    hasValue,
    technologies,
}) => {
    const filter = filters[0];
    const setFilterActive = (): void => {
        const crrValue = !filter.getValue();

        filter.setValue({ [filter.stateName]: crrValue });
        setActive(crrValue);
    };

    return (
        <FiltersBox
            technologies={technologies}
            preface={preface}
            dataAutomation={dataAutomation}
            title={title}
            subtitle={filter.title}
            subtitleCollapsed={subtitleCollapsed}
            filters={filters}
            hasValue={hasValue}
            isActive={filter.getValue()}
            setActive={setFilterActive}
        />
    );
};

export default SingleFilterBox;
