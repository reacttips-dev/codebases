import { IModalConfig } from "components/Modals/src/UnlockModal/unlockModalConfig";
import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";

export interface ICustomSegmentsUnlockModalTypes {
    segments: "CustomSegmentsCommon";
}

export const CustomSegmentsUnlockModalConfig = (): {
    [D in keyof ICustomSegmentsUnlockModalTypes]: IModalConfig<D>;
} => ({
    segments: {
        slides: {
            CustomSegmentsCommon: {
                img: AssetsService.assetUrl("/images/unlock-modal/custom-segments.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/custom-segments-2x.jpg"),
                title: i18nFilter()("hook_unlock.custom-segments.title"),
                subtitle: i18nFilter()("hook_unlock.custom-segments.subtitle"),
                text: i18nFilter()("hook_unlock.custom-segments.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Custom Segments",
    },
});
