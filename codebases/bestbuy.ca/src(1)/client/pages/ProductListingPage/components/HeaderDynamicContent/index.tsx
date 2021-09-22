import * as React from "react";
import DynamicContent from "components/DynamicContent";
import {Props as DynamicContentProps} from "components/DynamicContent";

export interface Props extends DynamicContentProps {
    wasFacetFilterSelected: boolean;
}

export const HeaderDynamicContent: React.FC<Props> = (props: Props) => {
    const {wasFacetFilterSelected, sectionList, isLoading, screenSize, regionName, language} = props;

    if (!wasFacetFilterSelected) {
        return (
            <DynamicContent
                isLoading={isLoading}
                sectionList={sectionList}
                screenSize={screenSize}
                regionName={regionName}
                language={language}
            />
        );
    }
    return null;
};

HeaderDynamicContent.displayName = "HeaderDynamicContent";

export default HeaderDynamicContent;
