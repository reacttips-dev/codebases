import {tracker} from "@bbyca/ecomm-utilities";
import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {connect} from "react-redux";
import {get} from "lodash-es";

import {
    Warranty,
    WarrantySectionItem,
    WarrantyType,
    Contexts,
    Dispatch,
    BenefitsMessage,
} from "models";
import {RoutingActionCreators, routingActionCreators} from "actions";
import {bindActionCreators} from "redux";

import WarrantyOptions from "../../../../components/WarrantyOptions";
import WarrantyBenefits from "../WarrantyBenefits";

interface OwnProps {
    className?: string;
    parentSku: string;
    warranties: Warranty[];
    warrantyBenefitMessage: BenefitsMessage;
    warrantyTermsAndConditionUrl: string;
    onSelectWarranty(warranty: Warranty | null): void;
}

interface DispatchProps {
    routingActions: RoutingActionCreators;
}

interface State {
    isWarrantySelected: boolean;
    selectedWarranty: Warranty | null;
}

export const getContextForWarranty = (
    warrantyType: WarrantyType | null,
    contexts: Contexts,
    fallbackWarrantyType: WarrantyType,
): WarrantySectionItem => {
    const gspMessage: WarrantySectionItem = get(contexts, "gsp.items[0]");
    const gsrpMessage: WarrantySectionItem = get(contexts, "gsrp.items[0]");

    if (warrantyType && contexts) {
        return warrantyType === WarrantyType.PRP ? gsrpMessage : gspMessage;
    }

    // no plan case
    if (fallbackWarrantyType === WarrantyType.PRP) {
        return gsrpMessage;
    }

    return gspMessage;
};

type Props = OwnProps & DispatchProps & InjectedIntlProps;

export class ProductWarranties extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isWarrantySelected: false,
            selectedWarranty: null,
        };
    }

    public render() {
        if (!this.props.warranties || this.props.warranties.length === 0) {
            return null;
        }

        const {selectedWarranty} = this.state;
        const {warranties, warrantyBenefitMessage, warrantyTermsAndConditionUrl, parentSku} = this.props;

        const warrantyType = (warranties?.[0]?.type as WarrantyType);

        return (
            <div id="terms">
                <WarrantyBenefits
                    warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                    warrantyType={warrantyType}
                    warrantyBenefitsMessage={warrantyBenefitMessage}
                    onToggleBenefitsDialog={() => {
                        tracker.dispatchEvent({
                            action: "Click",
                            category: "Warranty",
                            label: "Learn More",
                        });
                    }}
                />
                <WarrantyOptions
                    trackEngagements={false}
                    className={this.props.className}
                    parentSku={parentSku}
                    options={this.props.warranties}
                    initialOption={selectedWarranty}
                    onOptionSelected={this.handleWarrantySelect}
                    warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                />
            </div>
        );
    }

    private handleWarrantySelect = (parentSku: string, warranty: Warranty | null) => {
        this.setState({
            isWarrantySelected: !warranty,
            selectedWarranty: warranty,
        });
        this.props.onSelectWarranty(warranty);

        if (warranty) {
            tracker.dispatchEvent({
                action: "Click",
                category: "Warranty",
                label: `${warranty.title} ${warranty.regularPrice}`,
            });
        }
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(injectIntl(ProductWarranties));
