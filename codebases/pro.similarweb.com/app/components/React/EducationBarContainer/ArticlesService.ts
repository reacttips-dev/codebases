import { ArticlesSet } from "@similarweb/pro-education-bar/src/models/ArticlesSet";
import { ArticleEntity } from "@similarweb/pro-education-bar/src/models/ArticleEntity";
import { AttachmentsContainer } from "@similarweb/pro-education-bar/src/models/AttachmentsContainer";

import swLog from "@similarweb/sw-log";

export class ArticlesService {
    private static initUrl: string = "/api/educationbar/articles";
    private static searchUrl: string = "/api/educationbar/search";
    private static viewedUrl: string = "/api/educationbar/viewed";
    private static articleUrl: string = "/api/educationbar/article";
    private static attachmentsUrl: string = "/api/educationbar/attachments";
    private static searchKey: string = "terms";
    private static initKey: string = "label";
    private static idKey: string = "id";

    public static async GetArticleById(id: number): Promise<ArticleEntity> {
        const searchUrl = `${ArticlesService.articleUrl}?${ArticlesService.idKey}=${id}&locale=en-us`;
        try {
            const result = await fetch(searchUrl, {
                method: "GET",
                credentials: "include",
            });
            const error = ArticlesService.handleErrors(result);
            return result.json();
        } catch (err) {
            swLog.error("request failed", err);
        }
    }

    public static async GetArticlesByFilter(
        term: string,
        initQuery: boolean,
    ): Promise<ArticlesSet> {
        let searchUrl = null;

        if (initQuery) {
            searchUrl = `${ArticlesService.initUrl}?${ArticlesService.initKey}=${
                term.trim() || '""'
            }`;
        } else {
            searchUrl = `${ArticlesService.searchUrl}?${ArticlesService.searchKey}=${
                term.trim() || '""'
            }`;
        }
        try {
            const result = await fetch(searchUrl, {
                method: "GET",
                credentials: "include",
            });
            const error = ArticlesService.handleErrors(result);
            return result.json();
        } catch (err) {
            swLog.error("request failed", err);
            return new ArticlesSet([], "");
        }
    }

    public static async GetAttachments(articleId: number): Promise<AttachmentsContainer> {
        const queryUrl = `${ArticlesService.attachmentsUrl}?id=${articleId}`;

        try {
            const result = await fetch(queryUrl, {
                method: "GET",
                credentials: "include",
            });
            const error = ArticlesService.handleErrors(result);
            return result.json();
        } catch (err) {
            swLog.error("request failed", err);
            return new AttachmentsContainer([]);
        }
    }

    public static async OnArticleViewed(articleId: number): Promise<any> {
        const queryUrl = `${ArticlesService.viewedUrl}`;

        try {
            const result = await fetch(queryUrl, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(articleId),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const error = ArticlesService.handleErrors(result);
        } catch (err) {
            swLog.warn("failed to set article as viewed, article id: " + articleId, err);
        }
    }

    private static handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}
