import { swSettings } from "common/services/swSettings";
import { BEFORE_LOGOUT } from "constants/events";
import { DefaultFetchService } from "services/fetchService";

const USE_CASE_SCREEN_SEEN_STORAGE_KEY = "USE_CASE_SCREEN_SEEN";
enum UseCaseSeenState {
    SEEN = "1",
}

/**
 * Stores the state of the use case screen being seen. Data is stored in localStorage and in
 * user data (swSettings). Those data sources are synced at the service startup.
 */
export class UseCaseService implements IUseCaseService {
    private document: Document;
    private storage: Storage;
    private onboarded = false;
    private hasSyncedToRemote = false;

    constructor($window: Window = window) {
        this.storage = $window.localStorage;
        this.document = $window.document;

        this.sync(); // Sync local and remote changes
        this.onboarded = this.isSeen();
        this.cleanupBeforeLogout();
    }

    public isSeen(): boolean {
        return this.isSeenLocal() || this.isSeenRemote();
    }

    public markSeen(): void {
        this.markLocalAsSeen();
        this.markRemoteAsSeen();
    }

    public commitOnboarding(): void {
        this.onboarded = true;
    }

    public isOnboarding(): boolean {
        return !this.onboarded;
    }

    private cleanupBeforeLogout(): void {
        this.document.addEventListener(BEFORE_LOGOUT, () => this.cleanupLocal(), {
            once: true,
            capture: true,
        });
    }

    private sync(): void {
        const isSeenLocal = this.isSeenLocal();
        const isSeenRemote = this.isSeenRemote();

        if (!isSeenLocal && isSeenRemote) {
            this.markLocalAsSeen();
        }

        if (isSeenLocal && !isSeenRemote) {
            this.markRemoteAsSeen();
        }
    }

    private isSeenRemote(): boolean {
        return !swSettings?.components?.UserData?.resources?.NeedToShowUseCaseScreen;
    }

    private markRemoteAsSeen(): Promise<void> {
        const fetchService = DefaultFetchService.getInstance();
        return this.hasSyncedToRemote
            ? Promise.resolve()
            : fetchService.post("/api/user-management/use-case-screen-passed", {});
    }

    private isSeenLocal(): boolean {
        return !!this.storage.getItem(USE_CASE_SCREEN_SEEN_STORAGE_KEY);
    }

    private markLocalAsSeen(): void {
        this.storage.setItem(USE_CASE_SCREEN_SEEN_STORAGE_KEY, UseCaseSeenState.SEEN);
    }

    private cleanupLocal(): void {
        this.storage.removeItem(USE_CASE_SCREEN_SEEN_STORAGE_KEY);
    }
}

export type IUseCaseService = UseCaseService;

export default new UseCaseService();
