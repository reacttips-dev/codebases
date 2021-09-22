import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";

type TitleOptionsProps = {
    iconName: string;
    name: string;
};

const TitleOptions: React.FC<TitleOptionsProps> = ({ iconName, name }) => {
    const translate = useTranslation();

    return (
        <>
            <SWReactIcons iconName={iconName} />
            {translate(name)}
        </>
    );
};

export default TitleOptions;
