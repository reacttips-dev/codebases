export interface LeftNavUpsellState {
    isHidden: boolean;
    url: string;
    datapointNameShow: string;
    datapointNameClicked: string;
    buttonText: string;
    buttonTextLine2: string;
    buttonIconPath: string;
    buttonIconType: ButtonIconType;
    irisImpressionUrl?: string; // This is the iris returned url that we call for logging loadingImpression
    irisBeaconUrl?: string; // This is the iris returned url that we call for logging user interaction like click
}

export enum ButtonIconType {
    SvgIcon,
    FabricIcon,
    UrlIcon,
}
