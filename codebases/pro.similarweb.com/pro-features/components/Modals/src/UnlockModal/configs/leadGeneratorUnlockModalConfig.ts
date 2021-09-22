import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface ILeadGeneratorUnlockModalTypes {
    WebsiteCategory: "WebsiteCategory";
    Growth: "Growth";
    CompanyHQ: "CompanyHQ";
    SourceLeads: "SourceLeads";
}

export const LeadGeneratorUnlockModalConfig = (): {
    [D in keyof ILeadGeneratorUnlockModalTypes]: IModalConfig<D>;
} => ({
    WebsiteCategory: {
        slides: {
            WebsiteCategory: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-category.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-category-2x.jpg"),
                title: i18nFilter()("hook_unlock.lead_generator.website_category.title"),
                subtitle: i18nFilter()("hook_unlock.lead_generator.website_category.title"),
                text: i18nFilter()("hook_unlock.lead_generator.website_category.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.default.cta_text"),
        label: "Website Category",
    },
    Growth: {
        slides: {
            Growth: {
                img: AssetsService.assetUrl("/images/unlock-modal/growth.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/growth-2x.jpg"),
                title: i18nFilter()("hook_unlock.lead_generator.growth.title"),
                subtitle: i18nFilter()("hook_unlock.lead_generator.growth.title"),
                text: i18nFilter()("hook_unlock.lead_generator.growth.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.default.cta_text"),
        label: "Growth",
    },
    CompanyHQ: {
        slides: {
            CompanyHQ: {
                img: AssetsService.assetUrl("/images/unlock-modal/company-hq.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/company-hq.jpg"),
                title: i18nFilter()("hook_unlock.lead_generator.company_hq.title"),
                subtitle: i18nFilter()("hook_unlock.lead_generator.company_hq.title"),
                text: i18nFilter()("hook_unlock.lead_generator.company_hq.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.default.cta_text"),
        label: "Company HQ",
    },
    SourceLeads: {
        slides: {
            SourceLeads: {
                img: AssetsService.assetUrl("/images/unlock-modal/see-more-results.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/see-more-results-2x.jpg"),
                title: i18nFilter()("hook_unlock.lead_generator.source_leads.title"),
                subtitle: i18nFilter()("hook_unlock.lead_generator.source_leads.title"),
                text: i18nFilter()("hook_unlock.lead_generator.source_leads.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.default.cta_text"),
        label: "Source Leads",
    },
});
