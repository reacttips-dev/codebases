import * as React from "react";
import { SFC } from "react";
import LinkProvider from "../../../../components/WithLink/src/LinkProvider";
import TrackProvider from "../../../../components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../../components/WithTranslation/src/TranslationProvider";
import FiltersProvider from "./FiltersProvider";

const AllContexts: SFC<any> = ({ translate, track, trackWithGuid, linkFn, filters, children }) => (
    <TranslationProvider translate={translate}>
        <TrackProvider track={track} trackWithGuid={trackWithGuid}>
            <LinkProvider linkFn={linkFn}>
                <FiltersProvider filters={filters}>{children}</FiltersProvider>
            </LinkProvider>
        </TrackProvider>
    </TranslationProvider>
);
AllContexts.displayName = "AllContexts";
export default AllContexts;
