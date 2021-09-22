import { func } from "prop-types";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import WithTrack from "../../../WithTrack/src/WithTrack";
import WithTranslation from "../../../WithTranslation/src/WithTranslation";
import { IProModal, IProModalCustomStyles, ProModal } from "../ProModal";
import {
    Global,
    TrialWidgetModalButton,
    TrialWidgetModalContent,
    TrialWidgetModalHeader,
    TrialWidgetModalImage,
    TrialWidgetModalList,
    TrialWidgetModalListIcon,
    TrialWidgetModalListItem,
    TrialWidgetModalSubtitle,
    TrialWidgetModalTitle,
} from "./StyledComponents";

const modalStyles: IProModalCustomStyles = {
    overlay: {
        zIndex: 1040,
        backgroundColor: "rgba(18, 27, 67, 0.6)",
    },
    content: {
        position: "absolute",
        width: "415px",
        top: "36px",
        right: "46px",
        padding: 0,
        border: 0,
        boxShadow: "0 4px 18px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12)",
    },
};

interface ITrialWidgetModalProps extends IProModal {
    workspace: string;
    onCtaClick: () => void;
}

interface ITrialWidgetModalState {
    listItems: string[];
}

export class TrialWidgetModal extends React.PureComponent<
    ITrialWidgetModalProps,
    ITrialWidgetModalState
> {
    public static contextTypes = {
        translate: func,
        track: func,
    };

    private overlayRef;

    constructor(props) {
        super(props);

        this.state = {
            listItems: [],
        };
    }

    public componentDidMount() {
        this.setState({
            listItems: this.getListItems(),
        });

        document.addEventListener("mousedown", this.onOutsideClick, { capture: true });
    }

    public componentWillUnmount() {
        document.addEventListener("mousedown", this.onOutsideClick, { capture: true });
    }

    public render() {
        const { workspace, isOpen, onCloseClick, onCtaClick } = this.props;

        return !workspace ? (
            ""
        ) : (
            <WithTranslation>
                {() => (
                    <WithTrack>
                        {() => (
                            <>
                                <Global />
                                <ProModal
                                    isOpen={isOpen}
                                    onCloseClick={onCloseClick}
                                    customStyles={modalStyles}
                                    overlayRef={(el) => (this.overlayRef = el)}
                                    portalClassName={"ReactModalPortal ReactModalPortal--trial"}
                                >
                                    <TrialWidgetModalHeader>
                                        <TrialWidgetModalTitle>
                                            <TrialWidgetModalSubtitle>
                                                {`${workspace} solution`}
                                            </TrialWidgetModalSubtitle>
                                            {this.context.translate(
                                                `trial_modal.${workspace}.title`,
                                            )}
                                        </TrialWidgetModalTitle>

                                        {/* TODO: Uncomment & remove hardcoded after adding images */}
                                        {/*<TrialWidgetModalImage src={AssetsService.assetUrl(`/images/trial-modal/${workspace}-icon.svg`)}/>*/}
                                        <TrialWidgetModalImage
                                            src={AssetsService.assetUrl(
                                                `/images/trial-modal/marketing-icon.svg`,
                                            )}
                                        />
                                    </TrialWidgetModalHeader>
                                    <TrialWidgetModalContent>
                                        {this.context.translate(`trial_modal.${workspace}.text`)}
                                        <TrialWidgetModalList>
                                            {this.state.listItems.map((item, index) => (
                                                <TrialWidgetModalListItem key={index}>
                                                    <TrialWidgetModalListIcon iconName="checked" />
                                                    {item}
                                                </TrialWidgetModalListItem>
                                            ))}
                                        </TrialWidgetModalList>
                                        <TrialWidgetModalButton type="trial" onClick={onCtaClick}>
                                            {this.context.translate("trial_modal.button.text")}
                                        </TrialWidgetModalButton>
                                    </TrialWidgetModalContent>
                                </ProModal>
                            </>
                        )}
                    </WithTrack>
                )}
            </WithTranslation>
        );
    }

    private onOutsideClick = (event) => {
        const { isOpen, onCloseClick } = this.props;

        if (!isOpen || (this.overlayRef && this.overlayRef.contains(event.target))) {
            return;
        }

        if (onCloseClick) {
            onCloseClick();
        }
    };

    private getListItems(): string[] {
        const items = [];
        let i = 1;
        const getKey = (i) => `trial_modal.${this.props.workspace}.list_item${i}`;

        while (this.context.translate(getKey(i)) !== getKey(i)) {
            items.push(this.context.translate(getKey(i)));
            i++;
        }

        return items;
    }
}
