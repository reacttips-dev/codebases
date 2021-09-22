import * as React from "react";
import ReactDOM from "react-dom";
import withAgeGate from "../../../../components/AgeGate";

interface AgeGatesPortalProps {
    target: HTMLElement;
    selector: string;
    key?: string;
}

export const getAgeGatePortals = (restrictedItems: NodeListOf<Element>, key: string = "portal") => {
    const items: React.ReactPortal[] = [];
    restrictedItems.forEach((video: Element, index: number) => {
        const restrictedContent = video.outerHTML;
        const Wrapper = withAgeGate(() => <div dangerouslySetInnerHTML={{__html: restrictedContent}} />);
        video.innerHTML = "";
        items.push(ReactDOM.createPortal(<Wrapper key={key + index} ageRestricted={true} />, video));
    });
    return items;
};

const AgeGatesPortal: React.FunctionComponent<AgeGatesPortalProps> = ({target, selector, key}) => {
    const [AgeGates, setAgeGates] = React.useState<React.ReactPortal[]>();
    React.useEffect(() => setAgeGates(getAgeGatePortals(target.querySelectorAll(selector), key)), []);
    return <>{AgeGates}</>;
};

export default AgeGatesPortal;
