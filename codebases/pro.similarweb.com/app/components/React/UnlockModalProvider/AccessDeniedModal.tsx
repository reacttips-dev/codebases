import { HookModal } from "components/Modals/src/HookModal/HookModal";
import * as _ from "lodash";
import { HOOKS_V2_MODAL_ID } from "pages/workspace/config/stateToWsConfigMap";
import { connect } from "react-redux";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { closeUnlockModal } from "../../../actions/unlockModalActions";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import UnlockModalWrapper from "../UnlockModalProvider/UnlockModalProvider";

const getConfigByName = (unlockHook) => UnlockModalConfig()[unlockHook];

export const AccessDeniedModal = (props) => {
    if (props.unlockHook.modal === HOOKS_V2_MODAL_ID) {
        return !props.isOpen ? null : (
            <HookModal
                featureKey={props.unlockHook.slide}
                onClose={props.closeModal}
                trackingSubKey={props.unlockHook.location}
            />
        );
    }

    const {
        modal = "",
        slide = "",
        isNoTouch = false,
        location = `Hook PRO/${modal}/${slide}/Unlock Module`,
        onOpen = _.noop,
        onClose = _.noop,
    } = props.unlockHook || {};

    const config = getConfigByName(modal);

    return (
        <UnlockModalWrapper
            isOpen={props.isOpen}
            onCloseClick={_.flow(props.closeModal, onClose)}
            location={location}
            activeSlide={slide}
            onAfterOpen={onOpen}
            isNoTouch={isNoTouch}
            {...config}
        />
    );
};

const mapStateToProps = ({ unlockModal }) => unlockModal;

function mapDispatchToProps(dispatch) {
    return {
        closeModal: () => {
            dispatch(closeUnlockModal());
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(AccessDeniedModal),
    "AccessDeniedModal",
);
