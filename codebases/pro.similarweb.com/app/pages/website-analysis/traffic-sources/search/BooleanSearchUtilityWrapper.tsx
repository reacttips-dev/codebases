import {
    BooleanSearch,
    BooleanSearchActionListStyled,
    BooleanSearchInputWrap,
} from "@similarweb/ui-components/dist/boolean-search";
import { Injector } from "common/ioc/Injector";
import {
    booleanSearchToString,
    booleanSearchUrlToComponent,
    onChipAdd,
    onChipRemove,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import React from "react";
import styled from "styled-components";

export const BooleanSearchWrapper = styled.div`
    min-height: 42px;
    display: flex;
    ${BooleanSearchActionListStyled} {
        z-index: 9999;
        background-color: #fff;
    }
    ${BooleanSearchInputWrap} {
        min-width: 235px;
    }
    .boolean-search {
        width: 100%;
    }
`;

interface IBooleanSearchUtilityWrapperProps {
    shouldEncodeSearchString?: boolean;
    searchInputPlaceholder?: string;
    onChange?: (items) => void;
}

export const BooleanSearchUtilityWrapper: React.FunctionComponent<IBooleanSearchUtilityWrapperProps> = (
    props,
) => {
    const { searchInputPlaceholder, shouldEncodeSearchString } = props;
    const swNavigator = Injector.get<any>("swNavigator");
    const { BooleanSearchTerms } = swNavigator.getParams();
    const chips = decodeURIComponent(booleanSearchUrlToComponent(BooleanSearchTerms));

    const onChange = (items) => {
        const newApiParams = swNavigator.getParams();
        const BooleanSearchTerms = booleanSearchToString(items, shouldEncodeSearchString);
        swNavigator.applyUpdateParams({ ...newApiParams, BooleanSearchTerms });
        if (typeof props.onChange === "function") {
            props.onChange(BooleanSearchTerms);
        }
    };
    return (
        <BooleanSearchWrapper>
            <BooleanSearch
                placeholder={searchInputPlaceholder}
                onChange={onChange}
                chips={chips}
                onChipRemove={onChipRemove}
                onChipAdd={onChipAdd}
            />
        </BooleanSearchWrapper>
    );
};
