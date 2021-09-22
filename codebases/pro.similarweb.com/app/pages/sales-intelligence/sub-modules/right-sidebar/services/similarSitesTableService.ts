import { formatAsPercents } from "pages/workspace/sales/sub-modules/benchmarks/helpers";
import { compareNumericPropDesc } from "pages/workspace/sales/helpers";
import {
    PANEL_DOMAIN_COLUMN_WIDTH,
    PANEL_SIMILARITY_COLUMN_WIDTH,
} from "../constants/similar-sites";
import {
    SimilarSitesTableColumns,
    SimilarSiteTableEntry,
    SimilarSiteType,
} from "../types/similar-sites";

export const createSimilarSitesTableService = (
    websites: SimilarSiteType[],
    translate: (key: string, replacements?: object) => string,
) => {
    const compareBySimilarityDesc = compareNumericPropDesc("similarity");
    /**
     * A map callback to create a table entries from a website object
     * @param domain
     * @param similarity
     */
    const mapToTableEntry = ({ domain, similarity }: SimilarSiteType) => {
        const formattedSimilarity = !similarity
            ? translate("si.sidebar.similar_sites.table.added_by_user")
            : formatAsPercents(similarity);

        return {
            domain,
            similarity: formattedSimilarity,
        };
    };
    /**
     * Just a plain object for mapping between domain and its favicon for a future use
     */
    const domainFaviconMap = websites.reduce<Record<string, string>>((map, website) => {
        map[website.domain] = website.favicon;

        return map;
    }, {});
    /**
     * A sort callback for given websites.
     * Websites added by user (similarity === 0 or "undefined") go first, then - rest, by similarity descending
     * @param a
     * @param b
     */
    const putCustomFirst = (a: SimilarSiteType, b: SimilarSiteType) => {
        if (!a.similarity) {
            return -1;
        }

        if (!b.similarity) {
            return 1;
        }

        return compareBySimilarityDesc(a, b);
    };
    /**
     * Ready to use table data
     */
    const tableData: ReadonlyArray<SimilarSiteTableEntry> = websites
        .slice()
        .sort(putCustomFirst)
        .map(mapToTableEntry);
    /**
     * Translated website column text
     */
    const websiteColumnText = translate("si.sidebar.similar_sites.table.column.domain", {
        numberOfWebsites: websites.length,
    });
    /**
     * Translated similarity column text
     */
    const similarityColumnText = translate("si.sidebar.similar_sites.table.column.similarity");
    /**
     * Map of translated columns texts for future use
     */
    const columnsTexts = {
        domain: websiteColumnText,
        similarity: similarityColumnText,
    };

    return {
        getData() {
            return tableData;
        },
        getColumns(): Readonly<SimilarSitesTableColumns> {
            return {
                domain: {
                    text: columnsTexts["domain"],
                    size: PANEL_DOMAIN_COLUMN_WIDTH,
                },
                similarity: {
                    align: "right",
                    text: columnsTexts["similarity"],
                    size: PANEL_SIMILARITY_COLUMN_WIDTH,
                },
            };
        },
        getFavicon(domain: string) {
            return domainFaviconMap[domain];
        },
        getColumnText(name: keyof SimilarSitesTableColumns) {
            return columnsTexts[name];
        },
        getSimilarityHeaderTooltipText() {
            return translate("si.sidebar.similar_sites.table.column.similarity.tooltip");
        },
    };
};

export default createSimilarSitesTableService;
