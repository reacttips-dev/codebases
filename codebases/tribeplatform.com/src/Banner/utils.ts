export const getTransform = ({ cropY, cropHeight, cropAreaHeight, imageHeight, zoomX, }) => {
    const cropYFactor = ((cropY * (cropAreaHeight / cropHeight)) / imageHeight) * 100;
    if (!Number.isFinite(cropYFactor))
        return;
    const cropYResult = cropYFactor > 0 ? Math.floor(cropYFactor) : Math.ceil(cropYFactor);
    return `translateY(${cropYResult}%) scale(${zoomX})`;
};
export function preventNavigation(event) {
    event.preventDefault();
    return '.';
}
//# sourceMappingURL=utils.js.map