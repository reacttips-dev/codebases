import {
    booleanSearchUrlToComponent,
    onChipAdd,
    onChipRemove,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { BooleanSearchWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import React from "react";
import { BooleanSearch } from "@similarweb/ui-components/dist/boolean-search";

interface IBooleanSearchProps {
    onChange: (e) => void;
    booleanSearchTerms: string;
}

const BooleanSearchStateBasedInner: React.FunctionComponent<IBooleanSearchProps> = (props) => {
    const { onChange, booleanSearchTerms } = props;
    const chips = booleanSearchUrlToComponent(booleanSearchTerms);
    return (
        <BooleanSearchWrapper>
            <BooleanSearch
                onChange={onChange}
                chips={chips}
                onChipRemove={onChipRemove}
                onChipAdd={onChipAdd}
            />
        </BooleanSearchWrapper>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.booleanSearchTerms === nextProps.booleanSearchTerms;

export const BooleanSearchStateBased = React.memo(BooleanSearchStateBasedInner, propsAreEqual);
