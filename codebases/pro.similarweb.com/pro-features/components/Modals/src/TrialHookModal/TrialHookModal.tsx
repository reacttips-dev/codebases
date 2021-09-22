import { ContactUsShort as SwContactUsShort } from "@similarweb/contact-us";
import { SWReactIcons } from "@similarweb/icons";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import React from "react";
import { AssetsService } from "services/AssetsService";
import { openChiliPiper } from "services/chiliPiper/chiliPiper";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IUser } from "../../../../../app/@types/ISwSettings";
import { IProModalCustomStyles, ProModal } from "../ProModal";
import { IUnlockModalProps, IUnlockModalSlide } from "../UnlockModal/UnlockModal";
import {
    TrialHookModalBackButton,
    TrialHookModalCloseButton,
    TrialHookModalCloseIcon,
    TrialHookModalContainer,
    TrialHookModalContent,
    TrialHookModalFigure,
    TrialHookModalFormButton,
    // TrialHookModalFormText,
    TrialHookModalFormWrap,
    TrialHookModalImage,
    TrialHookModalSidebar,
    TrialHookModalText,
    TrialHookModalTitle,
} from "./StyledComponents";

interface ITrialHookModalState {
    step: TrialHookModalSteps;
    isSubmitted: boolean;
}

export enum TrialHookModalSteps {
    Form,
    Content,
    Chilipiper,
}

export const proModalStyles: IProModalCustomStyles = {
    overlay: {
        zIndex: 2079,
    },
    content: {
        width: "auto",
        padding: 0,
        border: 0,
    },
};

const category = "hook/Contact Us/non mql Pop Up";

class TrialHookModal extends React.PureComponent<IUnlockModalProps, ITrialHookModalState> {
    public static defaultProps = {
        onCloseClick: _.noop,
    };

    private readonly user: IUser;
    private readonly contactUsApiUrl;

    constructor(props) {
        super(props);

        this.user = swSettings.user;
        this.contactUsApiUrl = swSettings.swsites.light;

        this.state = {
            step: TrialHookModalSteps.Content,
            isSubmitted: false,
        };
    }

    public componentDidMount() {
        if (!_.isEmpty(this.props.slides)) {
            const slide: IUnlockModalSlide = _.values(this.props.slides)[0];
            if (slide.img) {
                const cachedImage = new Image();
                cachedImage.src = slide.img;
            }
        }
    }

    public componentDidUpdate(
        prevProps: Readonly<IUnlockModalProps>,
        prevState: ITrialHookModalState,
    ) {
        if (prevProps.isOpen === false && this.props.isOpen === true) {
            this.setState({
                isSubmitted: false,
                step: TrialHookModalSteps.Content,
            });
        }

        if (
            prevState.step !== TrialHookModalSteps.Chilipiper &&
            this.state.step === TrialHookModalSteps.Chilipiper
        ) {
            openChiliPiper({
                onError: () => this.setState({ step: TrialHookModalSteps.Form }),
                onClose: () => this.props.onCloseClick(),
            });
        }
    }

    public render() {
        const { isOpen } = this.props;

        if (isOpen && this.state.step === TrialHookModalSteps.Chilipiper) {
            return null;
        }

        return (
            <ProModal
                isOpen={isOpen}
                onCloseClick={this.onCloseModalClick}
                customStyles={proModalStyles}
                showCloseIcon={false}
            >
                {this.renderStep()}
                <TrialHookModalCloseIcon onClick={this.onCloseModalClick}>
                    <SWReactIcons iconName="clear" />
                </TrialHookModalCloseIcon>
            </ProModal>
        );
    }

    private renderStep() {
        return (
            <TrialHookModalContainer>
                {this.state.step === TrialHookModalSteps.Content && this.renderContent()}
                {this.state.step === TrialHookModalSteps.Form && this.renderForm()}
                {this.renderSidebar()}
            </TrialHookModalContainer>
        );
    }

    private renderContent() {
        const slide: IUnlockModalSlide = _.values(this.props.slides)[0];

        return this.state.isSubmitted ? null : (
            <TrialHookModalContent>
                {!slide ? null : (
                    <>
                        <TrialHookModalImage
                            // Hard coded image height to prevent element resizing after loading
                            trialHookImgHeight={"173.33px"}
                            src={slide.img}
                            srcSet={slide.img2x && `${slide.img2x} 2x`}
                            alt={slide.title}
                        />
                        <TrialHookModalTitle>{slide && slide.title}</TrialHookModalTitle>
                        <TrialHookModalText
                            dangerouslySetInnerHTML={{ __html: slide.text }}
                            onClick={(event) => {
                                event.persist();

                                const target = event.target as HTMLElement;
                                if (target.tagName.toLowerCase() === "a") {
                                    this.trackModalEvent("click", "learn more");
                                }
                            }}
                        />
                    </>
                )}
            </TrialHookModalContent>
        );
    }

    private renderForm() {
        return (
            <TrialHookModalFormWrap>
                {!this.state.isSubmitted && (
                    <>
                        {this.state.step === TrialHookModalSteps.Form && (
                            <TrialHookModalBackButton
                                type="flat"
                                iconName="arrow-left"
                                onClick={this.onBackButtonClick}
                            >
                                {i18nFilter()("hook_unlock.back_button.text")}
                            </TrialHookModalBackButton>
                        )}
                        <TrialHookModalTitle>
                            {i18nFilter()("hook_unlock.form_title")}
                        </TrialHookModalTitle>
                    </>
                )}
                <SwContactUsShort
                    apiUrl={this.contactUsApiUrl}
                    submitUrl={`${this.contactUsApiUrl}/api/forms/hook`}
                    userInfo={this.user}
                    title=""
                    subtitle=""
                    messagePlaceholder={i18nFilter()("hook_unlock.form_message_placeholder")}
                    trackingCategory={category}
                    trackingName="UnlockModal"
                    hiddenFields={{
                        formLocationBreadcrumbs: location,
                    }}
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    onSubmit={this.onContactUsSubmit}
                    scheduleMeetingOnSubmit={false}
                />
                {this.state.isSubmitted && (
                    <TrialHookModalCloseButton type="trial" onClick={this.onCloseModalClick}>
                        {i18nFilter()("hook_unlock.contact_us.close")}
                    </TrialHookModalCloseButton>
                )}
                {
                    // edited by: yehoshua leventhal 31/10/2019.
                    // ticket: PAN-7
                    // explanation: leaving section commented out to allow future
                    //               addition of text.
                    /*{(!this.state.isSubmitted && this.state.isTwoStep) && (
                    <TrialHookModalFormText>
                        {i18nFilter()("hook_unlock.form_caption")}
                    </TrialHookModalFormText>
                )}*/
                }
            </TrialHookModalFormWrap>
        );
    }

    private renderSidebar() {
        return this.state.isSubmitted ? null : (
            <TrialHookModalSidebar>
                <TrialHookModalFigure
                    // Hard coded image height to prevent element resizing after loading
                    trialHookFigureImgHeight={"99px"}
                >
                    <img
                        src={AssetsService.assetUrl("/images/unlock-modal/sales-specialists.png")}
                        alt=""
                    />
                    <figcaption>{i18nFilter()("hook_unlock.avatar_caption")}</figcaption>
                </TrialHookModalFigure>
                {this.state.step !== TrialHookModalSteps.Form && (
                    <TrialHookModalFormButton onClick={this.onTalkToUsClick}>
                        {i18nFilter()("hook_unlock.button_open_form.text")}
                    </TrialHookModalFormButton>
                )}
            </TrialHookModalSidebar>
        );
    }

    private onTalkToUsClick = () => {
        this.setState({ step: TrialHookModalSteps.Chilipiper });
        this.trackModalEvent("click", "talk to us");
    };

    private onContactUsSubmit = () => {
        this.setState({ isSubmitted: true });
    };

    private onBackButtonClick = () => {
        TrackWithGuidService.trackWithGuid(
            "upgrade.hook.contact_us.mql_pop_up.unlock_sw_platform.back",
            "click",
            { action: "back" },
        );
        this.setState({ step: TrialHookModalSteps.Content });
    };

    private onCloseModalClick = () => {
        this.props.onCloseClick();
        this.trackModalEvent("close");
    };

    private trackModalEvent(action, name = "") {
        const slide: IUnlockModalSlide = _.values(this.props.slides)[0];

        if (this.props.isOpen && slide) {
            const title: string = slide.trackId || slide.title || slide.subtitle;
            allTrackers.trackEvent(category, action, `${title}${name ? `/${name}` : ""}`);
        }
    }
}

export default TrialHookModal;
