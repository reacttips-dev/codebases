import * as React from "react";
import { StatelessComponent } from "react";
import { AssetsService } from "services/AssetsService";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { EmptyStateWrapper } from "./elements";

interface IEmptyStateProps {
    onClickCreateReport: () => void;
}

const EmptyState: StatelessComponent<IEmptyStateProps> = ({ onClickCreateReport }) => {
    return (
        <EmptyStateWrapper>
            <img src={AssetsService.assetUrl(`/images/lead-generator-empty-state.svg`)} />
            <Button onClick={onClickCreateReport}>
                {i18nFilter()("grow.lead_generator.all.create_first")}
            </Button>
        </EmptyStateWrapper>
    );
};

export default EmptyState;
