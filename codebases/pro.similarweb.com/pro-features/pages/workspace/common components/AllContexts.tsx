import * as React from "react";
import { SFC } from "react";
import TrackProvider from "../../../components/WithTrack/src/TrackProvider";
import TranslationProvider from "../../../components/WithTranslation/src/TranslationProvider";
import LinkProvider from "../../../components/WithLink/src/LinkProvider";
import ComponentsProvider from "../../../components/WithComponent/src/ComponentsProvider";

const AllContexts: SFC<any> = ({
    translate,
    track,
    trackWithGuid,
    linkFn,
    children,
    components = {},
}) => (
    <TranslationProvider translate={translate}>
        <TrackProvider track={track} trackWithGuid={trackWithGuid}>
            <LinkProvider linkFn={linkFn}>
                <ComponentsProvider components={components}>{children}</ComponentsProvider>
            </LinkProvider>
        </TrackProvider>
    </TranslationProvider>
);
export default AllContexts;
