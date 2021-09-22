import * as React from "react";
import { StatelessComponent } from "react";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { DropdownContainer, LeadGeneratorEllipsisButton } from "./elements";
import { i18nFilter } from "filters/ngFilters";

interface IReportActionsEllipsisProps {
    onClickRename: () => void;
    onClickCopy: () => void;
    onClickArchive: () => void;
    onToggleEllipsis: (boolean) => void;
}

const ReportActionsEllipsis: StatelessComponent<IReportActionsEllipsisProps> = ({
    onClickRename,
    onClickCopy,
    onClickArchive,
    onToggleEllipsis,
}) => {
    function createActionsMenuContent() {
        return [
            <LeadGeneratorEllipsisButton key="LeadGeneratorEllipsisButton" />,
            {
                id: "edit",
                iconName: "edit",
                text: i18nFilter()("grow.lead_generator.sidenav.action.rename"),
                onClickFunc: onClickRename,
            },
            {
                id: "copy",
                iconName: "copy",
                text: i18nFilter()("grow.lead_generator.sidenav.action.copy"),
                onClickFunc: onClickCopy,
            },
            {
                id: "archive",
                iconName: "archive",
                text: i18nFilter()("grow.lead_generator.sidenav.action.archive"),
                onClickFunc: onClickArchive,
            },
        ];
    }

    return (
        <DropdownContainer>
            <Dropdown
                buttonWidth="40px"
                width="180px"
                itemsComponent={EllipsisDropdownItem}
                onClick={(action) => action.onClickFunc(action.id)}
                onToggle={onToggleEllipsis}
            >
                {createActionsMenuContent()}
            </Dropdown>
        </DropdownContainer>
    );
};

export default ReportActionsEllipsis;
