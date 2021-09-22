import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import ContactUsButton from "components/React/ContactUs/ContactUsButton";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { PureComponent } from "react";
import * as React from "react";
import styled from "styled-components";
import LocationService from "../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { PlainTooltip } from "../Tooltip/PlainTooltip/PlainTooltip";
import UnlockModal from "../UnlockModalProvider/UnlockModalProvider";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const DownloadButtonWrapper = styled.div`
    position: relative;
    left: 7px;

    .ranking-history & {
        bottom: 3px;
    }
    .widget-KeywordsGraph & {
        bottom: 15px;
        right: 6px;
        left: inherit;
    }
    .sw-pie-chart &,
    .sw-chart-inner &,
    chart & {
        position: absolute;
        top: 8px;
        right: 12px;
        bottom: initial;
        left: initial;
    }
    .sw-section-destination-paidoutgoing & {
        right: 44px;
    }
`;

const ExportButtonsContainer = styled.div`
    display: inline-flex;
    flex-direction: row-reverse;
    margin-right: 4px;
`;

const UpsellPopupWrapper = styled.div`
    padding: 15px;
    width: 250px;
    text-align: center;
`;

const UpsellPopupText = styled.div`
    margin-bottom: 20px;
`;

export const UpSellTooltipContent: React.FC<{
    upgradeText: string;
    unlockModalConfig?: object;
    upgradeButtonText: string;
    trackingEventName: string;
    onClick: VoidFunction;
}> = ({ upgradeText, unlockModalConfig, upgradeButtonText, trackingEventName, onClick }) => {
    return (
        <UpsellPopupWrapper>
            <UpsellPopupText data-automation="Excel Upgrade Text">{upgradeText}</UpsellPopupText>
            {unlockModalConfig ? (
                <Button
                    type="upsell"
                    onClick={() => {
                        onClick();
                        allTrackers.trackEvent(
                            "hook/Contact Us/Pop Up",
                            "click",
                            trackingEventName,
                        );
                    }}
                >
                    {upgradeButtonText}
                </Button>
            ) : (
                <ContactUsButton
                    label="Download Excel"
                    onClick={() => {
                        allTrackers.trackEvent("Contact Us/pop up", "click", "Download Excel");
                    }}
                >
                    {upgradeButtonText}
                </ContactUsButton>
            )}
        </UpsellPopupWrapper>
    );
};

interface IDownloadButtonMenuProps {
    Excel?: boolean;
    PNG?: boolean;
    excelLocked?: boolean;
    pngLocked?: boolean;
    exportFunction?: (type: string) => void;
    downloadUrl?: string;
    downloadTooltipText?: string;
    clientSideDownloadInProgress?: boolean;
}

interface IDownloadButtonMenuState {
    isUnlockModalOpen: boolean;
}

export class DownloadButtonMenu extends PureComponent<
    IDownloadButtonMenuProps,
    IDownloadButtonMenuState
> {
    public unlockModalConfig;
    private swNavigator: any;
    private readonly upgradeText;
    private readonly upgradeButtonText;
    private readonly popupConfig;

    constructor(props) {
        super(props);

        this.state = {
            isUnlockModalOpen: false,
        };

        this.swNavigator = Injector.get("swNavigator");
        this.unlockModalConfig = this.getUnlockModalConfig();

        this.upgradeText = i18nFilter()("directives.csv.notPermitted.text");
        this.upgradeButtonText = i18nFilter()("directives.csv.notPermitted.button");

        this.popupConfig = {
            cssClass: "Popup-element-wrapper--pro",
            cssClassContent: "Popup-content--pro",
            placement: "bottom",
            allowHover: true,
        };
    }

    public render() {
        return (
            <div className="export-buttons-wrapper">
                <ExportButtonsContainer>{this.getDownloadButton()}</ExportButtonsContainer>
                {this.unlockModal()}
            </div>
        );
    }

    private getDownloadButton() {
        const downloadButtons = [];
        if (this.props.PNG) {
            downloadButtons.push(this.getButtonWithPopup("PNG"));
        }
        if (this.props.Excel) {
            downloadButtons.push(this.getButtonWithPopup("Excel"));
        }
        return downloadButtons;
    }

    private unlockModal = () => {
        if (this.unlockModalConfig) {
            return (
                <UnlockModal
                    isOpen={this.state.isUnlockModalOpen}
                    onCloseClick={() => {
                        this.setState({ isUnlockModalOpen: false });
                    }}
                    {...this.unlockModalConfig}
                />
            );
        }
    };

    private upsellContent = () => {
        return (
            <UpSellTooltipContent
                trackingEventName={this.getTrackingEventName()}
                upgradeButtonText={this.upgradeButtonText}
                upgradeText={this.upgradeText}
                unlockModalConfig={this.unlockModalConfig}
                onClick={() => this.setState({ isUnlockModalOpen: true })}
            />
        );
    };

    private getButtonWithPopup(type) {
        const {
            excelLocked,
            pngLocked,
            downloadUrl,
            downloadTooltipText,
            exportFunction,
            clientSideDownloadInProgress,
        } = this.props;
        let iconName = "download";

        if (type === "Excel") {
            iconName = "excel";
            if (excelLocked) {
                iconName = "excel-locked";
            }
        }
        if (type === "PNG" && pngLocked) {
            iconName = "download-locked";
        }

        if (pngLocked || excelLocked) {
            return (
                <PopupHoverContainer
                    key={`popup-download-${type.toLowerCase()}`}
                    content={() => this.upsellContent()}
                    config={this.popupConfig}
                >
                    <DownloadButtonWrapper data-automation={`Download ${type}`}>
                        <IconButton
                            key={`single${type}`}
                            type="flat"
                            iconName={iconName}
                            onClick={this.track}
                        />
                    </DownloadButtonWrapper>
                </PopupHoverContainer>
            );
        } else {
            return (
                <PlainTooltip
                    key={`tooltip-download-${type.toLowerCase()}`}
                    text={
                        downloadTooltipText
                            ? downloadTooltipText
                            : `${i18nFilter()("btn.download")} ${type}`
                    }
                    cssClass="PlainTooltip-element PlainTooltip--downloadButton"
                >
                    <DownloadButtonWrapper
                        data-automation={`Download ${type}`}
                        data-downloadurl={downloadUrl}
                    >
                        <IconButton
                            key={`single${type}`}
                            type="flat"
                            iconName={iconName}
                            onClick={() => exportFunction(type)}
                            isLoading={clientSideDownloadInProgress}
                        />
                    </DownloadButtonWrapper>
                </PlainTooltip>
            );
        }
    }

    private track() {
        TrackWithGuidService.trackWithGuid("button_download_locked", "click", {
            location: LocationService.getCurrentLocation(),
        });
    }

    private getUnlockModalConfig() {
        return this.props.Excel && this.props.excelLocked
            ? {
                  location: `${LocationService.getCurrentLocation()}/Download Table`,
                  ...UnlockModalConfig().DownloadTable,
              }
            : null;
    }

    private getTrackingEventName() {
        const trackingId: any = this.swNavigator.current().trackingId;
        const arr = [];

        Object.keys(trackingId).forEach((key) => {
            arr.push(trackingId[key]);
        });

        return arr.join("/");
    }
}

export default SWReactRootComponent(DownloadButtonMenu, "DownloadButtonMenu");
