import * as React from "react";
import styled from "styled-components";
import { DefaultCellHeader } from "./DefaultCellHeader";

// export const DefaultCenteredCellHeader: StatelessComponent<ITableHeaderCellProps> = (props) => {
//     return <DefaultCellHeader headerCellTextCls="headerCell-text u-truncate u-alignCenter u-block u-full-width" {...props} />
// };
export const DefaultCenteredCellHeader = styled(DefaultCellHeader)`
    flex-direction: row;
    display: flex;
    width: 100%;
    .u-flex-row {
        flex-direction: row;
        align-items: center;
    }
`;
DefaultCenteredCellHeader.displayName = "DefaultCenteredCellHeader";
