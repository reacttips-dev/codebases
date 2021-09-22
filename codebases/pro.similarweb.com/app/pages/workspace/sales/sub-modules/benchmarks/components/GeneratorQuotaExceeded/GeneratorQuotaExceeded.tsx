import React from "react";
import { StyledGeneratorQuotaContainer } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import QuotaExceeded from "pages/sales-intelligence/common-components/quota/QuotaExceeded/QuotaExceeded";

type GeneratorQuotaExceededProps = {
    viewsLimit: number;
};

const GeneratorQuotaExceeded = (props: GeneratorQuotaExceededProps) => {
    const translate = useTranslation();

    return (
        <StyledGeneratorQuotaContainer>
            <QuotaExceeded
                title={translate("si.insights.quota_reached.ultimate.title", {
                    numberOfViews: props.viewsLimit,
                })}
                subtitle={translate("si.insights.quota_reached.ultimate.subtitle")}
            />
        </StyledGeneratorQuotaContainer>
    );
};

export default GeneratorQuotaExceeded;
