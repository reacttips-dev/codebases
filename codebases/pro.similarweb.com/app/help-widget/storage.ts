import { PreferencesService } from "services/preferences/preferencesService";

export interface IHelpWidgetStorage {
    markArticleSeen: (id: string) => void;
    isArticleSeen: (id: string) => boolean;
}

const READ_ARTICLES = "helpWidgetReadArticles";

const unique = (...elements) => Array.from(new Set(elements));

export class HelpWidgetStorage implements IHelpWidgetStorage {
    public markArticleSeen(id) {
        /* HACK:
      markArticleSeen() doesn't wait for the promise to settle but that's ok. You can use
      a task queue to guarantee that the state in HelpWidgetStorage is consistent.
     */
        PreferencesService.add({
            [READ_ARTICLES]: unique(...this.getSeenArticles(), id),
        });
    }

    public isArticleSeen(id) {
        return this.getSeenArticles().includes(id);
    }

    private getSeenArticles(): string[] {
        return (PreferencesService.get(READ_ARTICLES) || []) as string[];
    }
}
