import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IWorkspaceModalTypes {
    MarketingWorkspace: "AddWorkspace";
}

export const WorkspaceUnlockModalConfig = (): {
    [D in keyof IWorkspaceModalTypes]: IModalConfig<D>;
} => ({
    MarketingWorkspace: {
        slides: {
            AddWorkspace: {
                img: AssetsService.assetUrl("/images/unlock-modal/add-marketing-workspace.png"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/add-marketing-workspace-2x.png",
                ),
                trackId: `${i18nFilter()("hook_unlock.workspace.marketing.title")}/${i18nFilter()(
                    "hook_unlock.workspace.marketing.add.workspace.title",
                )}`,
                title: i18nFilter()("hook_unlock.workspace.marketing.title"),
                subtitle: i18nFilter()("hook_unlock.workspace.marketing.add.workspace.title"),
                text: i18nFilter()("hook_unlock.workspace.marketing.add.workspace.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.workspace.marketing.cta_text"),
        label: "Marketing Workspace",
    },
});
