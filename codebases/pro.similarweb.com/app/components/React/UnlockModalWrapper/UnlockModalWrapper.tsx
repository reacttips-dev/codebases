import * as React from "react";
import { connect } from "react-redux";
import UnlockModal from "../UnlockModalProvider/UnlockModalProvider";
import UnlockModalConfig from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";
import { closeUnlockModal } from "../../../actions/unlockModalActions";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";

const getConfigByName = (unlockHook) => UnlockModalConfig()[unlockHook];

export const UnlockModalWrapper = (props) => {
    const config = props.unlockHook && getConfigByName(props.unlockHook.modal);
    return (
        <UnlockModal
            isOpen={props.isOpen}
            onCloseClick={props.closeModal}
            location={props.unlockHook.location}
            activeSlide={(props.unlockHook && props.unlockHook.slide) || ""}
            {...config}
        />
    );
};

function mapStateToProps(state) {
    return {
        isOpen: state.unlockModal.isOpen,
        unlockHook: state.unlockModal.unlockHook,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeModal: () => {
            dispatch(closeUnlockModal());
        },
    };
}
SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(UnlockModalWrapper),
    "UnlockModalWrapper",
);
