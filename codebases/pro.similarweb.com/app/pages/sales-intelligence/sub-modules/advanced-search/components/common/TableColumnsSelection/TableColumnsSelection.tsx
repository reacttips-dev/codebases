import React from "react";
import { FlexTableColumnType } from "pages/sales-intelligence/types";
import ColumnsSelectionButton from "../ColumnsSelectionButton/ColumnsSelectionButton";
import ColumnsSelectionModal from "../ColumnsSelectionModal/ColumnsSelectionModal";
import { StyledTableColumnsSelectionContainer } from "./styles";

type TableColumnsSelectionProps = {
    columns: readonly FlexTableColumnType[];
    className?: string;
    onSelectionChange(columns: FlexTableColumnType[]): void;
};

const TableColumnsSelection = (props: TableColumnsSelectionProps) => {
    const { columns, onSelectionChange, className = null } = props;
    const [isSelectionModalOpened, setIsSelectionModalOpened] = React.useState(false);

    const handleApply = (columns: FlexTableColumnType[]) => {
        setIsSelectionModalOpened(false);
        setTimeout(() => {
            onSelectionChange(columns);
        }, 0);
    };

    return (
        <StyledTableColumnsSelectionContainer className={className}>
            <ColumnsSelectionButton onClick={() => setIsSelectionModalOpened(true)} />
            <ColumnsSelectionModal
                columns={columns}
                onApply={handleApply}
                isOpened={isSelectionModalOpened}
                onCancel={() => setIsSelectionModalOpened(false)}
            />
        </StyledTableColumnsSelectionContainer>
    );
};

export default TableColumnsSelection;
