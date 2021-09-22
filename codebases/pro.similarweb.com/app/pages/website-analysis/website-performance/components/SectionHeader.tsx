import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const Header = styled.span`
    ${setFont({ $size: 16, $weight: 400, $color: colorsPalettes.carbon[500] })};
    text-transform: uppercase;
`;

const SectionHeaderContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
`;

const i18n = i18nFilter();

export const SectionHeader = (props) => {
    const { sectionTitleKey } = props;
    return (
        <SectionHeaderContainer>
            <Header>{i18n(sectionTitleKey)}</Header>
        </SectionHeaderContainer>
    );
};

SWReactRootComponent(SectionHeader, "SectionHeader");
