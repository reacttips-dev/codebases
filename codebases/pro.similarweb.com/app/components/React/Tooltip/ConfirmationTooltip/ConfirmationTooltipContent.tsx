import * as React from "react";
import * as PropTypes from "prop-types";
import * as _ from "lodash";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { Button } from "@similarweb/ui-components/dist/button";
import { ButtonGroup } from "../../../../../.pro-features/components/ButtonsGroup/src/ButtonsGroup";
import styled from "styled-components";

const DeleteConfirmationContainer = styled.div`
    height: auto;
    width: auto;
`;

const DeleteConfirmationMenuItem = styled.div`
    padding: 0px;
    font-size: 14px;
    font-weight: 400;
`;

const DeleteConfirmationTitle = styled.div`
    padding: 0px 10px 9px 10px;
`;

export class ConfirmationTooltipContent extends InjectableComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    static defaultProps = {
        loaderOptions: {
            svg: {
                cx: "7",
                cy: "7",
                r: "5.2",
                strokeWidth: "2",
            },
            style: {
                width: "14px",
                height: "14px",
                marginLeft: "8px",
                top: "1px",
            },
        },
    };

    static propTypes = {
        loaderOptions: PropTypes.object,
        onDelete: PropTypes.func.isRequired,
        onOpen: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        removeItemTooltip: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.onOpen();
    }

    render() {
        const { title, buttonOk, buttonCancel } = _.mapValues(
            this.props.removeItemTooltip,
            (text) => this.i18n(text),
        );
        return (
            <DeleteConfirmationContainer>
                <DeleteConfirmationMenuItem>
                    <DeleteConfirmationTitle>{title}</DeleteConfirmationTitle>
                    <ButtonGroup>
                        <Button
                            type="flatWarning"
                            onClick={this.deleteItem}
                            isLoading={this.state.isLoading}
                        >
                            {buttonOk}
                        </Button>

                        <Button type="flat" onClick={this.onCancel}>
                            {buttonCancel}
                        </Button>
                    </ButtonGroup>
                </DeleteConfirmationMenuItem>
            </DeleteConfirmationContainer>
        );
    }

    onCancel = (event) => {
        this.props.closePopup && this.props.closePopup();
        this.props.onCancel(event);
    };

    deleteItem = () => {
        this.setState({ isLoading: true });
        this.props.onDelete();
    };
}
