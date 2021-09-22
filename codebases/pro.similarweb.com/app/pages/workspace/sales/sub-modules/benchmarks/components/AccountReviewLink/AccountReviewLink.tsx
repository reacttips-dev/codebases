import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledAccountReviewLinkContainer } from "./styles";
import { BENCHMARK_ITEMS_LINK_FULL_REVIEW } from "../../constants";

type AccountReviewLinkProps = {
    link: string;
    onLinkClick(): void;
};

const AccountReviewLink = (props: AccountReviewLinkProps) => {
    const translate = useTranslation();
    const { link, onLinkClick } = props;

    return (
        <StyledAccountReviewLinkContainer>
            <a
                href={link}
                onClick={onLinkClick}
                data-automation="website-analysis-tile"
                target="_blank"
                rel="noreferrer"
            >
                <IconButton type="flat" iconName="link-out" placement="right">
                    {translate(`${BENCHMARK_ITEMS_LINK_FULL_REVIEW}`)}
                </IconButton>
            </a>
        </StyledAccountReviewLinkContainer>
    );
};

export default AccountReviewLink;
