import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";

class TrialService {
    private readonly swSettings = swSettings;

    public isTrialExpired(): boolean {
        return this.swSettings.components.Workspaces.resources.WorkspaceType === "Hook";
    }

    public isTrial(): boolean {
        return this.swSettings.components.Home.resources.IsTrial || this.isTrialExpired();
    }

    public getDaysLeft(): number {
        const trialExpirationDate = this.swSettings.components.Home.resources.TrialExpirationDate;

        if (trialExpirationDate) {
            const today = dayjs.utc();
            today.set("hour", 0);
            today.set("minute", 0);
            today.set("second", 0);
            today.set("millisecond", 0);
            const diff = dayjs.utc(trialExpirationDate).diff(today, "days");

            return diff < 0 ? 0 : diff + 1;
        }

        return 0;
    }

    public getWorkspaceName(): string {
        let workspace = this.swSettings.components.Workspaces.resources.WorkspaceType;

        if (_.isArray(workspace)) {
            workspace = workspace[0];
        }
        if (!workspace || /hook/i.test(workspace)) {
            workspace = this.swSettings.components.Home.resources.TrialWorkspace;
        }

        return !workspace ? "" : workspace.trim().toLowerCase();
    }
}

export default TrialService;
