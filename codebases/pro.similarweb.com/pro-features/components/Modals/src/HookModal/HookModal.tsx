import { HookModalBase } from "@similarweb/features/lib/components/Common/HookModalBase/HookModalBase";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FC, useMemo } from "react";
import { openChiliPiper } from "services/chiliPiper/chiliPiper";
import { Modal } from "./components/Modal";
import { HooksService } from "./services/hooksService";
import { requestFeature } from "./services/requestFeature";

interface IHookModal {
    featureKey: string;
    onClose: () => void;
    trackingSubKey?: string;
}

export const HookModal: FC<IHookModal> = (props) => {
    const hookService = useMemo(() => new HooksService(), []);
    const translate = useTranslation();
    const [track] = useTrack();

    return (
        <HookModalBase
            {...props}
            hookService={hookService}
            openChiliPiper={openChiliPiper}
            requestFeature={requestFeature}
            translate={translate}
            track={track}
            components={{ Modal }}
        />
    );
};
