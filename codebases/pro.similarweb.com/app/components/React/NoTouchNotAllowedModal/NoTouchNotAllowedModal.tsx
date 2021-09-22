import { Button } from "@similarweb/ui-components/dist/button";
import { ISwSettings } from "app/@types/ISwSettings";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import styled from "styled-components";

const Title = styled.div`
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;
`;

const Body = styled.div`
    font-size: 14px;
    line-height: 1.7;
`;

const CloseButton = styled(Button)`
    display: block;
    margin-top: 12px;
    margin-left: auto;
`;

interface INoTouchNotAllowedModalState {
    isOpen: boolean;
}

class NoTouchNotAllowedModal extends React.PureComponent<any, INoTouchNotAllowedModalState> {
    private content: any;

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.content = this.setContentText();
    }

    public componentDidMount(): void {
        const cookieArray = document.cookie.split("; ") || [];

        const isOpen = cookieArray.reduce((acc, i) => {
            const [key, value] = i.split("=");
            if (key === "notouch_not_allowed") {
                return value || acc;
            }
            return acc;
        }, null);

        this.setState({ isOpen: !!isOpen });
    }

    public render() {
        const modalStyles: IProModalCustomStyles = {
            content: {
                width: "430px",
                color: "#2a3e52",
            },
        };

        return (
            <ProModal isOpen={this.state.isOpen} showCloseIcon={false} customStyles={modalStyles}>
                <Title>{this.content.title}</Title>
                <Body>{this.content.body}</Body>
                <CloseButton type="flat" onClick={this.onCloseClick}>
                    {this.content.btn}
                </CloseButton>
            </ProModal>
        );
    }

    private onCloseClick = () => {
        this.setState({ isOpen: false });
    };

    private setContentText = () => {
        return {
            title: i18nFilter()("modal.no-touch.not-allowed.title", {
                first_name: swSettings.user.firstname,
            }),
            body: i18nFilter()("modal.no-touch.not-allowed.body"),
            btn: i18nFilter()("modal.no-touch.not-allowed.button"),
        };
    };
}

export default SWReactRootComponent(NoTouchNotAllowedModal, "NoTouchNotAllowedModal");
