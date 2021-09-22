import { IPromise } from "angular";

export const PNG_WIDTH = 1400;
export const DEFAULT_TITLE_HEIGHT = 80;
export const M_SCREEN = 1500;
export const S_SCREEN = 1200;
export const L_SCREEN_OFFSET = 40;
export const S_SCREEN_OFFSET = -40;

export interface IPngExportService {
    export(): IPromise<boolean>;
}
