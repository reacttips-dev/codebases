/**/

const USE_CASE_SCREEN_SEEN_STORAGE_KEY = "USE_CASE_SCREEN_SEEN";

export class UseCaseService {
    constructor(private storage: Storage = window.localStorage) {}

    public isSeen(): boolean {
        return !!parseInt(this.storage.getItem(USE_CASE_SCREEN_SEEN_STORAGE_KEY), 10);
    }

    public markSeen(): void {
        this.storage.setItem(USE_CASE_SCREEN_SEEN_STORAGE_KEY, "1");
    }
}
