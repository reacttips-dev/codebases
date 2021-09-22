/**
 * Chart Markers
 */
class ChartMarkerBuilder {
    private _cache = {};

    /**
     * creates a data: url string
     * usage:
     * var color = '#f1afab' || '#F3C';
     * var dataSrc = ChartMarkerService.createMarkerSrc(color);
     * <img src = "{{dataSrc}}"/>
     *
     * @param color
     * @returns {string}
     */
    public createMarkerSrc(color) {
        return this.createMarker(color);
    }

    /**
     * creates a styles object
     * usage:
     * var color = '#f1afab' || '#F3C';
     * var style = ChartMarkerService.createMarkerStyle(color);
     * <span class="item-marker" ng-style="style"/></span>
     *
     * @param color
     * @returns {{background: string}}
     */
    public createMarkerStyle(color) {
        return { background: `url(${this.createMarkerSrc(color)})` };
    }

    private createMarker(color) {
        color = color.trim().toLocaleLowerCase();
        if (color.charAt(0) !== "#") {
            color = "#" + color;
        }
        if (this._cache[color]) {
            return this._cache[color];
        }
        let markup = `<svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><title>svg-marker</title>
    <defs>
        <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="a">
            <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/>
            <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/>
            <feMerge>
                <feMergeNode in="shadowMatrixOuter1"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    <circle cx="12.0" cy="12.0" r="5.5" stroke="#FFF" filter="url(#a)" stroke-width="2" fill="${color}" fill-rule="evenodd"/>
</svg>`;
        let base64 = window.btoa(markup);
        let res = `data:image/svg+xml;base64,${base64}`;
        this._cache[color] = res;
        return res;
    }
}

let service = new ChartMarkerBuilder();
export default service;
export const ChartMarkerService = service;
