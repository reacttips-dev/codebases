/**
 * Created by eyal.albilia on 10/31/17.
 */
import React, { Component, StatelessComponent } from "react";
import ReactModal from "react-modal";
import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { i18nFilter } from "filters/ngFilters";
import I18n from "../../../../../components/React/Filters/I18n";
import { AssetsService } from "../../../../../services/AssetsService";
import SWReactRootComponent from "../../../../../decorators/SWReactRootComponent";
import autobind from "autobind-decorator";
import HookModalHoc from "./HookModalHoc";
import * as PropTypes from "prop-types";
import swLog from "@similarweb/sw-log";
import ContactUsService from "services/ContactUsService";
import * as _ from "lodash";

export const modalStyles = {
    overlay: {
        zIndex: "9999",
        backgroundColor: "rgba(43, 61, 82, 0.8)",
    },
    content: {
        top: "200px",
        left: "50%",
        bottom: "auto",
        maxHeight: "85%",
        marginLeft: "-280px",
        overflow: "visible",
        opacity: "1",
        width: "45%",
        minWidth: "850px",
        padding: 0,
        backgroundColor: "rgb(255,255,255)",
        borderRadius: "4px",
        border: "1px solid #FFF",
    },
};

interface ITitle {
    primary?: boolean;
    padding?: string;
}

export const Title = styled.span`
    display: inline-block;
    font-family: "Roboto", Tahoma, sans-serif;
    font-weight: 300;
    color: #344a65;
    font-size: ${({ primary }: ITitle) => (primary ? "1.875rem" : "15px")};
    padding: ${({ padding }: ITitle) => (padding ? padding : "0")};
    line-height: 50px;
`;

export const HighlightSubtitle = styled(Title)`
    font-weight: 500;
    font-size: 17px;
`;

const FlexBox = styled.div`
    display: flex;
`;

const CenteredFlexBox = styled(FlexBox)`
    align-items: center;
`;

export const CustomIcon: StatelessComponent<any> = ({ className, iconName }) => {
    return <SWReactIcons className={className} iconName={iconName} />;
};

export const StyledCustomIcon: any = styled(CustomIcon)`
    width: 24px;
    line-height: 1rem;
    margin-right: 8px;
`;

export interface ITitleAndIcon {
    preTitleIconName?: string;
    title: string;
    primary?: boolean;
}

const TitleAndIcon: StatelessComponent<ITitleAndIcon> = (props) => {
    const { title, primary, preTitleIconName } = props;
    return (
        <CenteredFlexBox>
            <StyledCustomIcon iconName={preTitleIconName} />
            <Title primary={primary}>{title}</Title>
        </CenteredFlexBox>
    );
};

export interface IBGImage {
    imgSrc: string;
    height?: number;
}

export const BgImage: any = styled.div`
    background-image: url(${({ imgSrc }: IBGImage) => AssetsService.assetUrl(imgSrc)});
    background-repeat: no-repeat;
    flex: 1;
    height: ${({ height }: IBGImage) => (height ? `${height}px` : `432px`)};
`;

export const LeftContent: any = styled.div`
    flex: 2;
    padding: 63px 0px 43px 40px;
`;

class CreativeUpgradeModal extends Component<any, any> {
    private translations;
    private userMessage: string;

    constructor(props) {
        super(props);
        this.userMessage = "user requested upgrade to ad intelligence";
        this.translations = {
            title: "trafficSources.displayAds.upgrade.title",
            subtitle: "trafficSources.displayAds.upgrade.subtitle",
            descriptionTexts: [
                "trafficSources.displayAds.upgrade.desc.line1",
                "trafficSources.displayAds.upgrade.desc.line2",
                "trafficSources.displayAds.upgrade.desc.line3",
            ],
            buttonLabel: "trafficSources.displayAds.upgrade.contact.button",
            buttonSucessLabel: "trafficSources.displayAds.upgrade.contact.button.success",
        };
        this.state = {
            success: false,
        };
    }

    @autobind
    sendUserData() {
        ContactUsService.submit(this.props.createUserData(this.userMessage))
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        success: true,
                    });
                    this.props.services.tracker.all.trackEvent(
                        "Contactus/Contact Me",
                        "submit-ok",
                        this.props.initiator,
                    );
                }
                setTimeout(() => this.props.closeModalHandler(), 1000);
            })
            .catch((err) => {
                swLog.error(`Contact Us submit error: ${err.statusText}`);
            });
    }

    componentDidUpdate(prevProps) {
        if (this.props.showModal) {
            this.props.services.tracker.all.trackEvent(
                "Contactus/Contact Me",
                "open",
                this.props.initiator,
            );
        }
    }

    render() {
        return (
            <ReactModal
                style={modalStyles}
                isOpen={this.props.showModal}
                onRequestClose={this.props.closeModalHandler}
                shouldCloseOnOverlayClick={true}
            >
                <div>
                    <FlexBox>
                        <LeftContent>
                            <Title primary={true}>
                                <I18n>{this.translations.title}</I18n>
                            </Title>
                            <HighlightSubtitle>
                                <I18n>{this.translations.subtitle}</I18n>
                            </HighlightSubtitle>
                            {_.map(this.translations.descriptionTexts, (desc: string, index) => (
                                <TitleAndIcon
                                    key={index}
                                    preTitleIconName={"checked"}
                                    title={i18nFilter()(desc)}
                                />
                            ))}
                            <Button
                                style={{ backgroundColor: "#41bd63", margin: "20px 0px 0px 32px" }}
                                {...{
                                    onClick: this.sendUserData,
                                    isPrimary: true,
                                    label: i18nFilter()(
                                        this.state.success
                                            ? this.translations.buttonSucessLabel
                                            : this.translations.buttonLabel,
                                    ),
                                    width: 260,
                                    height: 36,
                                    className: "Button--rounded",
                                }}
                            />
                        </LeftContent>
                        <BgImage imgSrc={`images/creativeUpgradeHook.png`} />
                    </FlexBox>
                </div>
            </ReactModal>
        );
    }

    static propTypes = {
        showModal: PropTypes.bool.isRequired,
        initiator: PropTypes.string,
    };
}

export default SWReactRootComponent(HookModalHoc(CreativeUpgradeModal), "CreativeUpgradeModal");
