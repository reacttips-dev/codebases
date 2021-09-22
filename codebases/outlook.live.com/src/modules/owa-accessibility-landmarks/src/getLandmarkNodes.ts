import RegionLandmarkSelector from './selectors';

// get all potential landmark nodes (still needs checking via `getRole`, since
// some header and footer regions may not be page-width, per requirements in
// './selectors')
export default function getLandmarkNodes(element: Document = window.document) {
    const landmarkNodeList = element.querySelectorAll(RegionLandmarkSelector);
    return getArrayFromNodeList(landmarkNodeList);
}

export function getArrayFromNodeList(nodeList: NodeList) {
    const landmarks: HTMLElement[] = [];
    for (let i = 0; i < nodeList.length; i++) {
        landmarks.push(nodeList[i] as HTMLElement);
    }
    return landmarks;
}
