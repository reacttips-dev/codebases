import { i18nFilter } from "filters/ngFilters";
import { NoDataLabIcon } from "pages/keyword-analysis/geo/Components/KeywordsGeoEmptyState";
import * as React from "react";
import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";

const IconWrapper = styled.div`
    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
    text-align: center;
    margin-top: 20px;
    margin-bottom: 5px;
`;

const SubTitle = styled.div`
    font-size: 14px;
    color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
    display: flex;
`;

const SubTitleLink = styled.div`
    color: ${colorsPalettes.blue["400"]};
    :hover {
        cursor: pointer;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 340px;
    align-items: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
`;

export const FindAffiliateByKeywordsEmptyState = ({ bigGroup = false }) => {
    const onSubTitleLinkClick = () => {
        const swNavigator = Injector.get("swNavigator");
        swNavigator.go(swNavigator.current().homeState);
    };
    const keyPrefix = `find.affiliate.by.opportunities.${bigGroup ? "big_group" : "empty"}.state`;
    return (
        <Wrapper>
            <IconWrapper>
                <NoDataLabIcon />
            </IconWrapper>
            <Title>{i18nFilter()(`${keyPrefix}.title`)}</Title>
            <SubTitle>
                {i18nFilter()(`${keyPrefix}.sub.title.beginning`)}
                {!bigGroup && (
                    <>
                        &nbsp;
                        <SubTitleLink onClick={onSubTitleLinkClick}>
                            {i18nFilter()(`${keyPrefix}.sub.title.link`)}
                        </SubTitleLink>
                    </>
                )}
            </SubTitle>
        </Wrapper>
    );
};
