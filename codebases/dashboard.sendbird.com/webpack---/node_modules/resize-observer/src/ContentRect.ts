interface ContentRect {
    height: number;
    left: number;
    top: number;
    width: number;
}

const ContentRect = (target: Element): Readonly<ContentRect> => {
    if ('getBBox' in (target as SVGGraphicsElement)) {
        const box = (target as SVGGraphicsElement).getBBox();
        return Object.freeze({
            height: box.height,
            left: 0,
            top: 0,
            width: box.width,
        });
    } else { // if (target instanceof HTMLElement) { // also includes all other non-SVGGraphicsElements
        const styles = window.getComputedStyle(target);
        return Object.freeze({
            height: parseFloat(styles.height || '0'),
            left: parseFloat(styles.paddingLeft || '0'),
            top: parseFloat(styles.paddingTop || '0'),
            width: parseFloat(styles.width || '0'),
        });
    }
};

export { ContentRect };
