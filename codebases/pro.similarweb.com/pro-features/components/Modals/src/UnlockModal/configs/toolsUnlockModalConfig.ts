import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IToolsModalConfigTypes {
    LeadGenerator: "1" | "2";
    CIG: "CIG";
}

export const ToolsUnlockModalConfig = (): {
    [D in keyof IToolsModalConfigTypes]: IModalConfig<D>;
} => ({
    LeadGenerator: {
        slides: {
            1: {
                img: AssetsService.assetUrl("/images/upsale-screenshot-1.png"),
                title: i18nFilter()("grow.lead_generator.modal.module.header"),
                subtitle: i18nFilter()("grow.lead_generator.modal.module.title1"),
                text: i18nFilter()("grow.lead_generator.modal.module.subtitle1"),
            },
            2: {
                img: AssetsService.assetUrl("/images/upsale-screenshot-2.png"),
                title: i18nFilter()("grow.lead_generator.modal.module.header"),
                subtitle: i18nFilter()("grow.lead_generator.modal.module.title2"),
                text: i18nFilter()("grow.lead_generator.modal.module.subtitle2"),
            },
        },
        ctaText: i18nFilter()("grow.lead_generator.modal.module.purchase"),
        label: "Grow/Request lead generator module",
    },
    CIG: {
        slides: {
            CIG: {
                img: AssetsService.assetUrl("/images/unlock-modal/cig.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/cig-2x.jpg"),
                title: i18nFilter()("hook_unlock.cig.title"),
                subtitle: i18nFilter()("hook_unlock.cig.subtitle"),
                text: i18nFilter()("hook_unlock.cig.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.cig.cta_text"),
        label: "Grow/Report Generator",
    },
});
