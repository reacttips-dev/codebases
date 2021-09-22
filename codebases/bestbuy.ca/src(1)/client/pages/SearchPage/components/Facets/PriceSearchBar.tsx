import * as React from "react";
import * as styles from "./style.css";
import {Button, Form, Input} from "@bbyca/bbyca-components";
import State from "store";
import {bindActionCreators, Dispatch} from "redux";
import {connect} from "react-redux";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {searchActionCreators, SearchActionCreators} from "../../../../actions";
import messages from "./translations/messages";

interface StateProps {
    minPrice: string;
    maxPrice: string;
    minMaxPriceFacetEnabled: boolean;
}

interface Props {
    filters: string[];
}

interface PriceSearchBarDispatchProps {
    actions: SearchActionCreators;
}

interface Price {
    min: string;
    max: string;
}
export class PriceSearchBar extends React.Component<
    StateProps & Props & InjectedIntlProps & PriceSearchBarDispatchProps,
    Price
> {
    constructor(props) {
        super(props);
        this.state = {
            min: this.props.minPrice,
            max: this.props.maxPrice,
        };
    }

    public componentDidUpdate(prevProps: StateProps & Props) {
        if (prevProps.minPrice !== this.props.minPrice || prevProps.maxPrice !== this.props.maxPrice) {
            this.setState({min: this.props.minPrice, max: this.props.maxPrice});
        }
    }

    public render() {
        const {formatMessage} = this.props.intl;
        const inputExtraProps = {
            extraAttrs: {
                inputMode: "numeric",
            },
        };

        const handleMinPriceOnChange = (name: string, value: string) => {
            this.setState({min: value});
        };

        const handleMaxPriceOnChange = (name: string, value: string) => {
            this.setState({max: value});
        };

        const onApplyHandler = (e: React.FormEvent) => {
            e.preventDefault();
            this.props.actions.applyPriceRangeQuery(this.state.min, this.state.max);
        };

        const onClearHandler = (e: React.FormEvent) => {
            e.preventDefault();
            this.props.actions.applyPriceRangeQuery("", "", true);
            this.setState({min: "", max: ""});
        };

        const element = this.props.minMaxPriceFacetEnabled && (
            <div className={styles.priceBarOverride}>
                <Form data-automation="x-price-search-bar-form">
                    <div className={styles.priceInputContainer}>
                        <Input
                            label={formatMessage(messages.minLabel)}
                            {...inputExtraProps}
                            className={styles.priceSearchInput}
                            name="price-search-bar-min-input"
                            data-automation="x-price-search-bar-min-input"
                            inputMode="numeric"
                            value={this.state.min}
                            handleAsyncChange={handleMinPriceOnChange}
                            formatter="$##########"
                            placeholder="$"
                            autoComplete="off"
                        />
                        <div className={styles.priceSearchRangeTo} data-automation="x-price-search-bar-range-to">
                            -
                        </div>
                        <Input
                            label={formatMessage(messages.maxLabel)}
                            {...inputExtraProps}
                            className={styles.priceSearchInput}
                            name="price-search-bar-max-input"
                            data-automation="x-price-search-bar-max-input"
                            inputMode="numeric"
                            value={this.state.max}
                            handleAsyncChange={handleMaxPriceOnChange}
                            formatter="$##########"
                            placeholder="$"
                            autoComplete="off"
                        />
                    </div>
                    <div className={styles.priceButtonFlexContainer}>
                        <Button
                            type={"submit"}
                            appearance="secondary"
                            className={`${styles.button} ${styles.priceSearchButton} ${!this.state.min &&
                                !this.state.max &&
                                styles.disabled} `}
                            onClick={onApplyHandler}
                            isDisabled={!this.state.min && !this.state.max}
                            data-automation="x-price-search-bar-submit">
                            {formatMessage(messages.applyPrice)}
                        </Button>
                    </div>
                    {this.state.min || this.state.max ? (
                        <div className={styles.clearMinMax}>
                            <button onClick={onClearHandler} data-automation="x-price-search-bar-clear">
                                {formatMessage(messages.clearPriceRange)}
                            </button>
                        </div>
                    ) : null}
                    {this.props.filters !== undefined && this.props.filters.length !== 0 ? (
                        <div className={styles.dividerFlexContainer}>
                            <div className={styles.dividerLine}></div>
                        </div>
                    ) : null}
                </Form>
            </div>
        );

        return <React.Fragment>{element}</React.Fragment>;
    }
}

const mapStateToProps: (state: State) => StateProps = (state: State) => ({
    minMaxPriceFacetEnabled: state.config.features.minMaxPriceFacetEnabled,
    minPrice: state.search.minPrice,
    maxPrice: state.search.maxPrice,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    actions: bindActionCreators(searchActionCreators, dispatch),
});

export default connect<StateProps & Props, PriceSearchBarDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & Props & InjectedIntlProps & PriceSearchBarDispatchProps>(PriceSearchBar));
