import { SWReactIcons } from "@similarweb/icons";
import { Button } from "@similarweb/ui-components/dist/button";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import { func } from "prop-types";
import * as React from "react";
import { PureComponent } from "react";
import TrialService from "services/TrialService";
import ContactUsInline from "../../../../../app/components/React/ContactUs/ContactUsInline";
import { ContactUsInlineTitle } from "../../../../../app/components/React/ContactUs/StyledComponents";
import WithTrack from "../../../WithTrack/src/WithTrack";
import WithTranslation from "../../../WithTranslation/src/WithTranslation";
import { ProModal } from "../ProModal";
import {
    Fade,
    FadeItemWrapper,
    proModalStyles,
    UnlockModalContent,
    UnlockModalContentSubtitle,
    UnlockModalContentTitle,
    UnlockModalHeader,
    UnlockModalImage,
    UnlockModalTitle,
    UnlockModalTitleWrap,
    UnlockModalWrap,
} from "./StyledComponents";
import TrialHookModal from "../TrialHookModal";
import { BulletPager } from "@similarweb/ui-components/dist/bullet-pager";

export interface IUnlockModalSlide {
    img?: string;
    img2x?: string;
    trackId?: string;
    // Optional width of img element. Default is 420px.
    imgWidth?: number;

    // TODO: Make optional (for no image case)
    title: string;

    subtitle: string;
    text: string;
}

export type UnlockModalSlides<T extends string> = {
    [name in T]: IUnlockModalSlide;
};

export interface IUnlockModalProps {
    isOpen: boolean;
    onCloseClick?: () => void;
    onAfterOpen?: () => void;
    location: string;
    activeSlide?: string;
    slides: UnlockModalSlides<string>;
    ctaText: string;
    label: string;
}

enum UnlockModalState {
    UnlockInfo,
    ContactUs,
}

export interface IUnlockModalState {
    page: number;
    current: UnlockModalState;
    currentSlide: IUnlockModalSlide;
    submitted: boolean;
}

class UnlockModal extends PureComponent<IUnlockModalProps, IUnlockModalState> {
    public static contextTypes = {
        translate: func,
        track: func,
    };

    private readonly trialService;
    private startSlide = 1;

    constructor(props) {
        super(props);

        this.trialService = new TrialService();

        this.state = {
            page: this.startSlide,
            current: UnlockModalState.UnlockInfo,
            currentSlide: null,
            submitted: false,
        };
    }

    public handleKeyUp = (e) => {
        const { page } = this.state;
        const slides: IUnlockModalSlide[] = _.values(this.props.slides);

        if (e.keyCode === 39 && page < slides.length) {
            this.setPage(slides, page + 1);
        }
        if (e.keyCode === 37 && page > this.startSlide) {
            this.setPage(slides, page - 1);
        }
    };

    public componentDidMount() {
        // TODO: Implement images caching
        // this.slides.forEach( slide => {
        //     if (slide.img) {
        //         const cachedImage = new Image();
        //         cachedImage.src = slide.img;
        //     }
        // });

        const { activeSlide, slides } = this.props;
        const activeSlideState = this.getActiveSlideState(slides, activeSlide);
        this.setState({ ...activeSlideState });

        document.addEventListener("keyup", this.handleKeyUp, { capture: true });
    }

    public componentDidUpdate(prevProps) {
        const { activeSlide, slides } = this.props;
        const activeSlideState = this.getActiveSlideState(slides, activeSlide);
        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen) {
            this.setState({
                current: UnlockModalState.UnlockInfo,
                submitted: false,
                ...activeSlideState,
            });
        }
    }

    public componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    public onCtaClick = () => {
        this.setState({ current: UnlockModalState.ContactUs });
        this.trackModalEvent("open");
    };

    public onCloseModalClick = () => {
        this.props.onCloseClick();
        this.trackModalEvent("close");
    };

    public onCancelClick = () => {
        this.props.onCloseClick();
        this.trackModalEvent("cancel");
    };

    public render() {
        if (this.trialService.isTrial()) {
            return <TrialHookModal {...this.props} />;
        }

        const { isOpen, onAfterOpen = _.noop } = this.props;
        const slides: IUnlockModalSlide[] = _.values(this.props.slides);
        let content;

        switch (this.state.current) {
            case UnlockModalState.ContactUs:
                content = this.renderContactUsForm();
                break;
            case UnlockModalState.UnlockInfo:
            default:
                content = this.renderUnlockInfo(slides);
        }

        return (
            <WithTranslation>
                {() => (
                    <WithTrack>
                        {() => (
                            <ProModal
                                isOpen={isOpen}
                                onCloseClick={this.onCloseModalClick}
                                customStyles={proModalStyles}
                                onAfterOpen={onAfterOpen}
                            >
                                {content}
                            </ProModal>
                        )}
                    </WithTrack>
                )}
            </WithTranslation>
        );
    }

    private setPage = (slides: IUnlockModalSlide[], page) => {
        const currentSlide: IUnlockModalSlide = slides[page - 1];

        this.setState({ page, currentSlide }, () => {
            this.trackModalEvent("switch");
        });
    };

    private getActiveSlideState = (slides, active) => {
        const slidesValues: IUnlockModalSlide[] = _.values(slides);
        let index = 0;
        if (active) {
            index = slidesValues.indexOf(slides[active]);
        }
        return {
            page: index + 1,
            currentSlide: slidesValues[index],
        };
    };

    private isModalImageExist = (slides: IUnlockModalSlide[]) =>
        slides.some((slide) => "img" in slide);

    private renderImg = (slides: IUnlockModalSlide[]) => {
        if (slides.length && this.isModalImageExist(slides)) {
            return (
                <UnlockModalImage>
                    {_.range(1, slides.length + 1).map((pageNum) => (
                        <Fade key={pageNum} in={pageNum === this.state.page}>
                            <FadeItemWrapper>
                                <img
                                    width={slides[pageNum - 1]?.imgWidth ?? 420}
                                    src={slides[pageNum - 1].img}
                                    srcSet={
                                        slides[pageNum - 1].img2x &&
                                        `${slides[pageNum - 1].img2x} 2x`
                                    }
                                    alt="feature-illustration"
                                />
                            </FadeItemWrapper>
                        </Fade>
                    ))}
                </UnlockModalImage>
            );
        }
    };

    private renderText = (slides: IUnlockModalSlide[]) => {
        return _.range(1, slides.length + 1).map((pageNum) => (
            <Fade key={pageNum} in={pageNum === this.state.page}>
                <FadeItemWrapper hidden={pageNum !== this.state.page}>
                    <UnlockModalContentTitle>
                        {slides[pageNum - 1].subtitle}
                    </UnlockModalContentTitle>
                    <UnlockModalContentSubtitle>
                        {slides[pageNum - 1].text.split("<br>")[0]}
                    </UnlockModalContentSubtitle>
                </FadeItemWrapper>
            </Fade>
        ));
    };

    private renderContactUsForm = () => {
        const { label, location } = this.props;

        const customHeader = (
            <ContactUsInlineTitle>
                {this.context.translate("hook_unlock.contact_us.title")}
            </ContactUsInlineTitle>
        );

        return (
            <ContactUsInline
                location={location}
                label={label}
                onClose={this.props.onCloseClick}
                customHeader={customHeader}
            />
        );
    };

    private renderTitle = (slides: IUnlockModalSlide[]) => {
        if (slides.length && this.isModalImageExist(slides)) {
            return _.range(1, slides.length + 1).map((pageNum) => (
                <Fade key={pageNum} in={pageNum === this.state.page}>
                    <UnlockModalTitle hidden={pageNum !== this.state.page}>
                        {slides[pageNum - 1].title}
                        <SWReactIcons iconName="locked" size="sm" />
                    </UnlockModalTitle>
                </Fade>
            ));
        }
    };

    private renderUnlockInfo = (slides: IUnlockModalSlide[]) => {
        const { ctaText } = this.props;
        return (
            <UnlockModalWrap>
                {this.renderImg(slides)}
                <UnlockModalHeader>
                    <UnlockModalTitleWrap>{this.renderTitle(slides)}</UnlockModalTitleWrap>
                    <Button onClick={this.onCtaClick} type="upsell">
                        {ctaText}
                    </Button>
                </UnlockModalHeader>
                <UnlockModalContent>{this.renderText(slides)}</UnlockModalContent>
                {slides.length > 1 && (
                    <BulletPager
                        pages={slides.length}
                        page={this.state.page}
                        onClick={(page) => {
                            this.setPage(slides, page);
                        }}
                    />
                )}
            </UnlockModalWrap>
        );
    };

    private trackModalEvent(action) {
        const current: IUnlockModalSlide = this.state.currentSlide;

        if (current && this.props.isOpen) {
            const title: string = current.trackId || current.title || current.subtitle;
            this.context.track("hook/Contact Us/description screen", action, title);
        }
    }
}

SWReactRootComponent(UnlockModal, "UnlockModal");

export default UnlockModal;
