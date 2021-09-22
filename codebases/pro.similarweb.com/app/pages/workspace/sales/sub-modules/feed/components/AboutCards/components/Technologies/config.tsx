/* eslint-disable react/display-name */
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { GreyCheckMark, StyledBoldTextWrapper } from "../../styles";
import { i18nFilter } from "filters/ngFilters";
import { DomainNameAndIcon } from "pages/workspace/common/tableAdditionalColumns";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { RightAlignedHeaderCell } from "components/Workspace/TableCells/DefaultHeaderCell";

const PAID = "Paid";

export const technologiesColumns = [
    {
        fixed: false,
        field: "technologyName",
        displayName: i18nFilter()("analysis.overview.technographics.table.technology_name"),
        type: "string",
        format: "None",
        sortDirection: "asc",
        sortable: false,
        isSorted: false,
        groupable: false,
        totalCount: true,
        tooltip: false,
        visible: true,
        showTotalCount: true,
        width: 325,
        cellComponent: ({ row }: ITableCellProps) => {
            const { topDomain, description, technologyName, technologyId } = row;
            return (
                <PopupHoverContainer
                    content={() => (
                        <div>
                            <StyledBoldTextWrapper>On: {topDomain}</StyledBoldTextWrapper>
                            <div>{description}</div>
                        </div>
                    )}
                    config={{
                        enabled: true,
                        placement: "top",
                        width: 400,
                    }}
                >
                    <div>
                        <DomainNameAndIcon
                            domain={technologyName}
                            icon={`https://www.similartech.com/images/technology?id=${technologyId}`}
                        />
                    </div>
                </PopupHoverContainer>
            );
        },
    },
    //FIXME uncomment when backend done SIM-33531
    // {
    //     field: "installed",
    //     fixed: true,
    //     displayName: "Installed",
    //     type: "string",
    //     format: "date",
    //     sortDirection: "asc",
    //     sortable: false,
    //     isSorted: false,
    //     isLink: true,
    //     groupable: false,
    //     headTemp: "",
    //     totalCount: false,
    //     tooltip: false,
    //     visible: true,
    //     minWidth: 80,
    //     width: 80,
    // },
    {
        field: "freePaid",
        displayName: "Paid",
        type: "string",
        sortDirection: "asc",
        format: "",
        sortable: false,
        isSorted: false,
        visible: true,
        groupable: false,
        cellComponent: ({ value }: { value: string }) => {
            const checkMark =
                value === PAID ? <GreyCheckMark className="sw-icon-checkmark" /> : <></>;
            return checkMark;
        },
        width: 80,
        headerComponent: RightAlignedHeaderCell,
        totalCount: false,
        tooltip: false,
    },
];

export const TECHNOLOGIES_PAGE_SIZE = 5;
