import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import I18n from "components/WithTranslation/src/I18n";

export type LeadGeneratorTitleProps = {
    text: string;
    className?: string;
    iconName?: string;
};

const LeadGeneratorTitle: React.FC<LeadGeneratorTitleProps> = ({
    text,
    className = null,
    iconName,
}) => {
    return (
        <div className={className}>
            <I18n>{text}</I18n>
            {iconName && <SWReactIcons iconName={iconName} size="xs" />}
        </div>
    );
};

export default LeadGeneratorTitle;
