import * as React from "react";

import { allTrackers } from "services/track/track";
import { openUnlockModal } from "../../../../../app/services/ModalService";

interface IUnlockModalHookProps {
    modal: string;
    slide?: string;
    location: string;
    componentId?: string;
}

class UnlockModalHookWrapper extends React.Component<IUnlockModalHookProps, any> {
    public render() {
        return <a onClick={this.onClick}>{this.props.children}</a>;
    }

    private onClick = () => {
        const { modal, slide, location, componentId } = this.props;
        allTrackers.trackEvent("hook/Contact Us/Pop up", "click", `${location}/${componentId}`);
        openUnlockModal({ modal, slide }, `${location}/${componentId}`);
    };
}

export const UnlockModalHookWrapperBind = (props: IUnlockModalHookProps) => (childProps: any) => (
    <UnlockModalHookWrapper {...props} {...childProps}>
        {childProps.children}
    </UnlockModalHookWrapper>
);

export default UnlockModalHookWrapper;
