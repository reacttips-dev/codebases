export class VennDiagramUtilities {
    private static QUERY_PARAM = "CalculateVennData";
    static getKeywordsTableVennQueryParam = (calculateVennData) => ({
        [VennDiagramUtilities.QUERY_PARAM]: calculateVennData,
    });
}
