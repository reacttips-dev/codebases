import * as React from "react";
import { SFC } from "react";
import TranslationProvider from "../../../components/WithTranslation/src/TranslationProvider";
import TrackProvider from "../../../components/WithTrack/src/TrackProvider";

export const AllContexts: SFC<any> = ({ translate, track, trackWithGuid, children }) => (
    <TranslationProvider translate={translate}>
        <TrackProvider track={track} trackWithGuid={trackWithGuid}>
            {children}
        </TrackProvider>
    </TranslationProvider>
);
