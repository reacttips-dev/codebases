import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { StyledIconButtonViewDetails } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { BENCHMARK_ITEM_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";

type ViewDetailsButtonProps = {
    onClick(): void;
};

const ViewDetailsButton = (props: ViewDetailsButtonProps) => {
    const translate = useTranslation();
    const { onClick } = props;

    return (
        <StyledIconButtonViewDetails>
            <IconButton onClick={onClick} type="flat" iconName="chev-down">
                {translate(`${BENCHMARK_ITEM_KEY}.button.title.view_details`)}
            </IconButton>
        </StyledIconButtonViewDetails>
    );
};

export default ViewDetailsButton;
