import React from "react";
import TechnologiesDropdown, { TechnologiesDropdownProps } from "./TechnologiesDropdown";
import TechnologiesFilterContext from "../../../contexts/technologiesFilterContext";

const TechnologiesDropdownContainer = (
    props: Pick<TechnologiesDropdownProps, "onSelect" | "selectedEntries">,
) => {
    const { categories, subCategories, technologies } = React.useContext(TechnologiesFilterContext);

    return (
        <TechnologiesDropdown
            {...props}
            categories={categories}
            subCategories={subCategories}
            technologies={technologies}
        />
    );
};

export default TechnologiesDropdownContainer;
