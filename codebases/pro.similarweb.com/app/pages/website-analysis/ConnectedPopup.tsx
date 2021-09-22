import {
    IPopupWrapperProps,
    PopupClickContainerStateless,
} from "@similarweb/ui-components/dist/popup-click-container";
import * as _ from "lodash";
import * as React from "react";
import { useCallback } from "react";
import { connect } from "react-redux";

interface IConnectedPopupOwnProps {
    openAction: object;
    closeAction: object;
    onOpen?: VoidFunction;
    onClose?: VoidFunction;
}

interface IConnectedPopupProps {
    isOpen: boolean;
    close: (action) => void;
    open: (action) => void;
}

// tslint:disable-next-line:max-line-length
const ConnectedPopup: React.FC<
    IConnectedPopupOwnProps & IConnectedPopupProps & IPopupWrapperProps
> = ({
    children,
    config,
    content,
    appendTo,
    isOpen,
    close,
    open,
    openAction,
    closeAction,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const handleClose = useCallback(() => {
        close(closeAction);
        onClose();
    }, [close, closeAction]);
    const handleOpen = useCallback(() => {
        open(openAction);
        onOpen();
    }, [open, openAction]);
    return (
        <PopupClickContainerStateless
            appendTo={appendTo}
            content={content}
            isOpen={isOpen}
            onClose={handleClose}
            onOpen={handleOpen}
            config={config}
        >
            {children}
        </PopupClickContainerStateless>
    );
};

const mapStateToProps = (state, ownProps: { stateKey: string }) => {
    const stateValue = _.get(state, ownProps.stateKey);
    return {
        isOpen: stateValue,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        close: (action) => {
            dispatch(action);
        },
        open: (action) => {
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedPopup);
