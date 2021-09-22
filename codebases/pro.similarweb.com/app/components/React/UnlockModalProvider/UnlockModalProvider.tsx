import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { allTrackers } from "services/track/track";
import UnlockModal, {
    UnlockModalSlides,
} from "../../../../.pro-features/components/Modals/src/UnlockModal/UnlockModal";
import TrackProvider from "../../../../.pro-features/components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../.pro-features/components/WithTranslation/src/TranslationProvider";
import { TrackWithGuidService } from "../../../services/track/TrackWithGuidService";

interface IUnlockModalWrapperProps {
    isOpen: boolean;
    onCloseClick?: () => void;
    onAfterOpen?: () => void;
    location: string;
    activeSlide?: string;
    slides: UnlockModalSlides<string>;
    ctaText: string;
    label: string;
}

const UnlockModalProvider: React.FunctionComponent<IUnlockModalWrapperProps> = (props) => (
    <TranslationProvider translate={i18nFilter()}>
        <TrackProvider
            track={allTrackers.trackEvent.bind(allTrackers)}
            trackWithGuid={TrackWithGuidService.trackWithGuid}
        >
            <UnlockModal {...props} />
        </TrackProvider>
    </TranslationProvider>
);

SWReactRootComponent(UnlockModalProvider, "UnlockModalProvider");

export default UnlockModalProvider;
