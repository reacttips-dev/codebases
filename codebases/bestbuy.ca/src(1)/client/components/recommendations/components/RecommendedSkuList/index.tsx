import * as React from "react";
import {IBrowser} from "redux-responsive/types";
import * as styles from "./style.css";
import {classname} from "utils/classname";
import {MerchSkuListType, SectionItemTypes} from "models";
import MerchSkuList from "components/banners/MerchSkuList";

interface RecommendedSkuListProps {
    products: any[];
    screenSize: IBrowser;
    language: Language;
    title?: string;
    className?: string;
    noCrawl?: boolean;
    extraAttributes?: any;
    disableSeoAttributes?: boolean;
}

export const RecommendedSkuList: React.SFC<RecommendedSkuListProps> = (props: RecommendedSkuListProps) => {
    if (!props.products || props.products.length === 0) {
        return null;
    }

    const merchSkuList: MerchSkuListType = {
        skuList: props.products,
        type: SectionItemTypes.skuList,
    };

    return (
        <React.Fragment>
            <div
                className={classname([props.className, styles.recommendedSkuList])}
                style={{display: "flex", flexFlow: "row wrap"}}
                {...props.extraAttributes}>
                {!!props.title && <h2 className={styles.header}>{props.title}</h2>}
                <MerchSkuList
                    {...merchSkuList}
                    language={props.language}
                    screenSize={props.screenSize}
                    noCrawl={props.noCrawl}
                    alignLeft={true}
                    disableSeoAttributes={props.disableSeoAttributes}
                />
            </div>
        </React.Fragment>
    );
};

export default RecommendedSkuList;
