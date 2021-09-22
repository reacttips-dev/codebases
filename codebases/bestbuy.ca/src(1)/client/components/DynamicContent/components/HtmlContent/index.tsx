import * as React from "react";
import {AgeGatePortal} from "../../../AgeGate";

export interface HtmlContentProps {
    hasRestrictedContent?: boolean;
    restrictedElementSelector?: string;
    body: string;
}
const HtmlContent: React.FunctionComponent<HtmlContentProps> = ({
    body,
    restrictedElementSelector,
    hasRestrictedContent,
}) => {
    const containerRef = React.useRef(null);
    const container = containerRef.current;

    return (
        <>
            {container && hasRestrictedContent && restrictedElementSelector && (
                <AgeGatePortal selector={restrictedElementSelector} target={container} />
            )}
            <div ref={containerRef} dangerouslySetInnerHTML={{__html: body}} />
        </>
    );
};

export default HtmlContent;
