import * as React from "react";
import * as PropTypes from "prop-types";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { Checkbox } from "../../Checkbox/Checkbox";
import * as classNames from "classnames";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { allTrackers } from "services/track/track";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip.tsx";
import { StatelessComponent } from "react";

interface ITableColumnToggleProps extends ITableColumnTogglePopup {
    popupWidth?: number;
}

@SWReactRootComponent
export class TableColumnToggle extends React.PureComponent<ITableColumnToggleProps, any> {
    static propTypes = {
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string.isRequired,
                visible: PropTypes.bool.isRequired,
            }),
        ).isRequired,
        onClick: PropTypes.func.isRequired,
        popupWidth: PropTypes.number,
    };

    static defaultProps = {
        popupWidth: 188,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    onToggle = () => {
        const isOpen = !this.state.isOpen;
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", state, "Table Columns");
        this.setState({ isOpen });
    };

    render() {
        const count = this.props.columns.filter((column) => column.visible).length;
        return (
            <PopupClickContainer
                content={() => <TableColumnTogglePopup {...this.props} />}
                config={{
                    placement: "bottom-left",
                    width: this.props.popupWidth,
                    cssClass: "table-column-toggle-popup",
                    cssClassContainer: "tooltip-element-wrapper",
                    cssClassContent: "Popup-element-wrapper-content",
                    onToggle: this.onToggle,
                }}
            >
                <div className={classNames("column-toggle-wrapper", { open: this.state.isOpen })}>
                    <i className="column-toggle-icon sw-icon-columns-toggle-stripes" />
                    {count < this.props.columns.length && (
                        <label className="column-toggle-count">
                            {count}/{this.props.columns.length}
                        </label>
                    )}
                    <i className="column-toggle-icon sw-icon-triangle" />
                </div>
            </PopupClickContainer>
        );
    }
}

interface ColumnPickerProps {
    selected: boolean;
    available: boolean;

    onClick(): void;
}

const ColumnPicker: any = styled.div`
    height: 42px;
    line-height: 42px;
    box-sizing: border-box;
    display: flex;
    padding: 24px 8px;
    background-color: ${colorsPalettes.carbon[0]};
    //background-color: #{map-get($color_palette_carbon, 0)}fff;
    ${(props: ColumnPickerProps) =>
        props.selected &&
        css`
            background-color: rgba(74, 134, 197, 0.08);
        `}

    &:hover {
        background-color: rgba(74, 134, 197, 0.08);
    }

    ${(props: ColumnPickerProps) =>
        !props.available &&
        css`
            user-select: none;
            opacity: 0.3;
            &,
            label,
            .checkbox-icon-container {
                cursor: text;
            }
        `}
`;

export interface ITableColumnTogglePopup {
    columns: any;
    onClick: (index) => void;
}

export const TableColumnTogglePopup: StatelessComponent<ITableColumnTogglePopup> = ({
    columns,
    onClick,
}) => {
    const onClickColumn = (i, displayName, selected) => {
        const state = selected ? "remove" : "add";
        allTrackers.trackEvent("Drop down", state, `Table Columns/${displayName}`);
        onClick(i);
    };
    return (
        <div>
            {columns.map((column, i) => {
                const { available = true } = column;
                const PickerContainer = ({ children }) => {
                    if (column.columnPickerTooltip) {
                        return (
                            <PlainTooltip text={column.columnPickerTooltip}>
                                {children}
                            </PlainTooltip>
                        );
                    }
                    return children;
                };
                return (
                    <PickerContainer key={i}>
                        <ColumnPicker
                            selected={column.visible}
                            available={available}
                            onClick={() =>
                                available && onClickColumn(i, column.displayName, column.visible)
                            }
                        >
                            <Checkbox
                                label={column.displayName}
                                selected={column.visible}
                                isDisabled={!available}
                            />
                        </ColumnPicker>
                    </PickerContainer>
                );
            })}
        </div>
    );
};
