import { UpgradeLink } from "components/React/Table/cells";
import { UrlCell } from "components/React/Table/cells/UrlCell";

// the UrlCell implements adapter design pattern for each type of input value.
export const UrlCellWebsiteAnalysis = (props) => {
    const { value, tableOptions } = props;
    const isValueArray = Array.isArray(value);

    if (!isValueArray && value === "grid.upgrade") {
        return <UpgradeLink hookType="pages" />;
    }

    return isValueArray ? (
        <UrlCell site={value[0].Value} tooltipData={value.length > 1 ? value : undefined} />
    ) : (
        <UrlCell site={value} />
    );
};
