import { cellTemplates } from "pages/sneakpeek/constants";
import * as _ from "lodash";
import { Label, TableMetaDataContainer } from "pages/sneakpeek/StyledComponents";
import InputBox from "pages/sneakpeek/components/InputBox";
import { IconButton } from "@similarweb/ui-components/dist/button";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import React, { FC } from "react";

export const TableMetaDataItem: FC<any> = (props) => {
    let field = props.field || "",
        name = props.name || "",
        cellTempId = props.cellTemp || "DefaultCell",
        cellName = cellTemplates[cellTempId] || "Default(Text)";
    const { onDelete, onChange } = props;
    const cellTemplatesItems = [
        <DropdownButton key="cellTemp" width={180}>
            {cellName}
        </DropdownButton>,
        ..._.map(cellTemplates, (text: string, id: string) => {
            return {
                id,
                text,
            };
        }),
    ];

    return (
        <TableMetaDataContainer>
            <InputBox value={field} onChange={(field) => onChange(field, name, cellTempId)}>
                Field
            </InputBox>
            <InputBox
                value={name}
                onChange={(name) => onChange(field, name, cellTempId)}
                width="150px"
            >
                Title
            </InputBox>
            <div className="input-up-subtitle">
                <Label>Format</Label>
                <Dropdown
                    selectedIds={{ [cellTempId]: true }}
                    onClick={(item) => {
                        cellTempId = item.id;
                        cellName = cellTemplates[item.id];
                        onChange(field, name, cellTempId);
                    }}
                    itemsComponent={SimpleDropdownItem}
                    width={180}
                >
                    {cellTemplatesItems}
                </Dropdown>
            </div>
            <PlainTooltip tooltipContent="Remove column">
                <div style={{ marginTop: "25px" }}>
                    <IconButton iconName="clear" type="flat" onClick={onDelete} />
                </div>
            </PlainTooltip>
        </TableMetaDataContainer>
    );
};
