import React from "react";
import { StyledTabContentWrapper } from "./styles";
import ItemsListContainer from "../ItemsList/ItemsListContainer";
import AccountReviewLinkContainer from "../AccountReviewLink/AccountReviewLinkContainer";
import CategoriesSectionContainer from "../CategoriesSection/CategoriesSectionContainer";

const TabContent = () => {
    return (
        <StyledTabContentWrapper>
            <CategoriesSectionContainer />
            <ItemsListContainer />
            <AccountReviewLinkContainer />
        </StyledTabContentWrapper>
    );
};

export default TabContent;
